/**
 * Service IA — Naïla (chatbot Netpub).
 *
 * Les clés Gemini sont lues depuis l'environnement SERVEUR uniquement.
 * Elles ne sont jamais renvoyées au navigateur.
 *
 * Plusieurs clés sont mises en pool (GEMINI_API_KEYS, séparées par des
 * virgules). Quand une clé atteint son quota ou tombe en surcharge, l'appel
 * bascule sur la suivante sans interrompre la requête : l'utilisateur ne voit
 * jamais d'interruption.
 */

/** Modèles essayés dans l'ordre. Le premier disponible gagne. */
const MODEL_POOL = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL_ID,
      'gemini-flash-latest',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
    ].filter(Boolean) as string[]
  )
);

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/** Durée de mise en quarantaine d'une clé, par motif d'échec. */
const COOLDOWN_MS: Record<string, number> = {
  QUOTA_EXCEEDED: 60_000,
  SERVER_ERROR: 10_000,
  PERMISSION_DENIED: 10 * 60_000,
  API_KEY_INVALID: 60 * 60_000,
  MODEL_NOT_FOUND: 0,
};

/** Durée maximale d'une tentative avant de passer à la suivante. */
const ATTEMPT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 15_000);

/** Clé -> instant de disponibilité, pour ne pas retenter une clé morte. */
const quarantinedUntil = new Map<string, number>();

/** Curseur de rotation, pour répartir la charge entre clés valides. */
let rotationCursor = 0;

/** Pool de clés normalisé, sans doublon ni entrée vide. */
const getKeyPool = (): string[] => {
  const raw = [
    ...(process.env.GEMINI_API_KEYS || '').split(','),
    process.env.GEMINI_API_KEY || '',
    process.env.VITE_API_KEY || '',
  ]
    .map((k) => k.trim())
    .filter((k) => k && k !== 'undefined' && k !== 'null' && k.length > 20);

  return Array.from(new Set(raw));
};

/**
 * Clés utilisables maintenant : celles qui ne sont pas en quarantaine.
 * Si toutes le sont, on retente quand même la moins récemment exclue plutôt
 * que d'abandonner — mieux vaut un essai raté qu'un chatbot muet.
 */
const getAvailableKeys = (): string[] => {
  const pool = getKeyPool();
  const now = Date.now();
  const free = pool.filter((k) => (quarantinedUntil.get(k) ?? 0) <= now);
  if (free.length > 0) return free;

  const soonest = pool.reduce(
    (min, k) => Math.min(min, quarantinedUntil.get(k) ?? 0),
    Number.POSITIVE_INFINITY
  );
  for (const [key, until] of quarantinedUntil) {
    if (until === soonest) quarantinedUntil.set(key, now + 1_000);
  }
  return pool;
};

/** Le contexte métier est injecté par le client à chaque appel. */
const buildSystemPrompt = (context: string): string =>
  "Tu es Naïla, assistante chez Netpub. Discussion humaine, Emojis 😊. COURTE ET DIRECTE.\n\n" +
  (context ? `CONTEXTE NETPUB :\n${context}\n\n` : '') +
  'RÈGLES CRITIQUES :\n' +
  '1. Sois indulgente avec les fautes de frappe ou les abréviations.\n' +
  "2. Utilise 'collecterInfosClient' dès que l'utilisateur veut un service, un devis ou un RDV.\n" +
  '3. Ne sois pas trop technique, reste chaleureuse.\n' +
  '4. Une question à la fois. Max 2 phrases par réponse.';

export interface ChatTurn {
  role: string;
  text: string;
}

export interface NailaAnswer {
  text: string | null;
  functionName: string | null;
  functionArgs: string | null;
}

/** Liste blanche des outils exposés au modèle. */
const ALLOWED_FUNCTIONS = new Set([
  'prendreRendezVous',
  'passerCommande',
  'collecterInfosClient',
  'collecterFeedbackSite',
  'enregistrerNomClient',
]);

/**
 * Déclarations de fonctions envoyées au modèle.
 * Format attendu par l'API Generative Language (schema simplifié).
 */
const FUNCTION_DECLARATIONS = [
  {
    name: 'prendreRendezVous',
    description:
      "Prendre un rendez-vous pour un service spécifique à une date et une heure données.",
    parameters: {
      type: 'OBJECT',
      properties: {
        service: { type: 'STRING', description: 'Le service concerné' },
        date: { type: 'STRING', description: 'La date du rendez-vous' },
        heure: { type: 'STRING', description: "L'heure du rendez-vous" },
      },
      required: ['service', 'date', 'heure'],
    },
  },
  {
    name: 'collecterInfosClient',
    description:
      "Collecter les informations du client : prénom, email, téléphone, service souhaité.",
    parameters: {
      type: 'OBJECT',
      properties: {
        prenom: { type: 'STRING', description: 'Le prénom du client' },
        email: { type: 'STRING', description: "L'email du client" },
        telephone: { type: 'STRING', description: 'Le téléphone du client' },
        service: { type: 'STRING', description: 'Le service souhaité' },
      },
      required: ['prenom'],
    },
  },
  {
    name: 'enregistrerNomClient',
    description: 'Enregistrer le prénom ou le nom du client dans la conversation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        nom: { type: 'STRING', description: 'Le nom de famille, si connu' },
        prenom: { type: 'STRING', description: 'Le prénom du client' },
      },
      required: ['prenom'],
    },
  },
  {
    name: 'collecterFeedbackSite',
    description: 'Recueillir un retour ou une suggestion sur le site.',
    parameters: {
      type: 'OBJECT',
      properties: {
        message: { type: 'STRING', description: 'Le retour du client' },
      },
      required: ['message'],
    },
  },
  {
    name: 'passerCommande',
    description: 'Enregistrer une commande de prestation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        service: { type: 'STRING', description: 'La prestation commandée' },
        details: { type: 'STRING', description: 'Les détails de la commande' },
      },
      required: ['service', 'details'],
    },
  },
];

/** Traduit une erreur de l'API en motif exploitable par le resolver. */
const classifyGeminiError = (status: number, body: string): string => {
  if (status === 400 && /API key not valid|API_KEY_INVALID/i.test(body)) {
    return 'API_KEY_INVALID';
  }
  if (status === 400 && /API_KEY_INVALID/.test(body)) return 'API_KEY_INVALID';
  if (status === 403) return 'PERMISSION_DENIED';
  if (status === 404) return 'MODEL_NOT_FOUND';
  if (status === 429) return 'QUOTA_EXCEEDED';
  if (status >= 500) return 'SERVER_ERROR';
  return `HTTP_${status}`;
};

/** Lance un appel sur une clé, avec délai maximum. */
const attempt = async (
  key: string,
  model: string,
  body: unknown,
  headersFor: (key: string) => Record<string, string>
): Promise<{ ok: true; payload: unknown } | { ok: false; reason: string; status: number }> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headersFor(key) },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (response.ok) return { ok: true, payload: await response.json() };

    const text = await response.text();
    return {
      ok: false,
      reason: classifyGeminiError(response.status, text),
      status: response.status,
    };
  } catch (err) {
    const reason =
      (err as Error)?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
    return { ok: false, reason, status: 0 };
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Appelle l'API en course parallèle sur le pool (clé × modèle) : toutes les
 * combinaisons partent en même temps et la première réponse successful est
 * retenue. Enchaîner les clés l'une après l'autre coûtait jusqu'à 87 s quand
 * plusieurs étaient en surcharge — la course renvoie la réponse la plus
 * rapide, donc la latence perçue reste celle d'un seul appel.
 */
const callWithFailover = async (
  body: unknown,
  headersFor: (key: string) => Record<string, string>
): Promise<unknown> => {
  const keys = getAvailableKeys();
  if (keys.length === 0) {
    throw Object.assign(new Error('MISSING_KEY'), { reason: 'MISSING_KEY' });
  }

  // Rythme la charge : on décale le point de départ d'un appel à l'autre.
  const offset = rotationCursor++ % keys.length;
  const ordered = [...keys.slice(offset), ...keys.slice(0, offset)];

  let lastReason = 'UNKNOWN';
  let lastStatus = 0;

  // Un modèle à la fois : les clés courent en parallèle pour ce modèle, et
  // les modèles suivants ne sont essayés que si toutes les clés échouent.
  // Lancer les 28 combinaisons d'un coup sature le quota sans nécessité.
  for (const model of MODEL_POOL) {
    const outcomes: Array<
      { ok: true; payload: unknown } | { ok: false; reason: string; status: number }
    > = [];

    // Promise.race : on rend la main dès la PREMIÈRE réponse réussie, sans
    // attendre les autres appels. Promise.allSettled attendrait aussi les
    // tentatives qui expirent, ce qui imposait leur délai de timeout.
    const winner = await Promise.race(
      ordered.map((key) =>
        attempt(key, model, body, headersFor).then((result) => {
          outcomes.push(result);
          if (result.ok) return result.payload;
          return new Promise<never>(() => {}); // jamais gagnant
        })
      )
    );

    if (winner !== undefined) return winner;

    // Aucun succès sur ce modèle : les échecs sont tous dans `outcomes`.
    outcomes.forEach((result, i) => {
      if (result.ok) return;
      lastReason = result.reason;
      lastStatus = result.status;
      const cooldown = COOLDOWN_MS[result.reason] ?? 30_000;
      if (cooldown > 0) {
        quarantinedUntil.set(ordered[i], Date.now() + cooldown);
      }
    });

    // Si des appels sont encore en vol, on ne les attend pas : on passe au
    // modèle suivant. Leurs résultat alimenteront le tour suivant.
    if (outcomes.length < ordered.length) {
      console.warn('[Naila] abandon des tentatives encore en vol');
    }
  }

  console.error(`[Naila] aucune clé n'a répondu — ${lastReason} (HTTP ${lastStatus})`);
  throw Object.assign(new Error(lastReason), {
    reason: lastReason,
    status: lastStatus,
  });
};

export const nailaService = {
  /** Au moins une clé est-elle disponible ? */
  isConfigured(): boolean {
    return getAvailableKeys().length > 0;
  },

  /**
   * Vérifie la clé par un appel réel à l'API.
   * `configured: false` = clé absente ; `valid: false` = clé rejetée.
   */
  async checkStatus(): Promise<{
    configured: boolean;
    valid: boolean;
    reason: string | null;
  }> {
    if (!this.isConfigured()) {
      return { configured: false, valid: false, reason: 'MISSING_KEY' };
    }

    try {
      await callWithFailover(
        { contents: [{ role: 'user', parts: [{ text: 'ping' }] }] },
        (key) => ({ 'x-goog-api-key': key })
      );
      return { configured: true, valid: true, reason: null };
    } catch (err) {
      const reason = (err as { reason?: string }).reason ?? 'NETWORK_ERROR';
      console.error(`[Naila] aucune clé Gemini utilisable — ${reason}`);
      return { configured: true, valid: false, reason };
    }
  },

  /**
   * Interroge le modèle et renvoie soit du texte, soit un appel de fonction.
   */
  async ask(
    message: string,
    history: ChatTurn[],
    context: string
  ): Promise<NailaAnswer> {
    if (!this.isConfigured()) {
      throw Object.assign(new Error('MISSING_KEY'), { reason: 'MISSING_KEY' });
    }

    const contents = [
      ...history.map((turn) => ({
        role: turn.role === 'model' ? 'model' : 'user',
        parts: [{ text: turn.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const payload = (await callWithFailover(
      {
        systemInstruction: { parts: [{ text: buildSystemPrompt(context) }] },
        contents,
        tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
      },
      (key) => ({ 'x-goog-api-key': key })
    )) as {
      candidates?: Array<{
        content?: { parts?: Array<Record<string, unknown>> };
      }>;
    };

    const parts = payload.candidates?.[0]?.content?.parts ?? [];

    const fnPart = parts.find((p) => p.functionCall) as
      | { functionCall?: { name?: string; args?: unknown } }
      | undefined;

    if (fnPart?.functionCall?.name) {
      const name = fnPart.functionCall.name;
      // Garde-fou : seule une fonction déclarée peut être invoquée
      if (!ALLOWED_FUNCTIONS.has(name)) {
        throw Object.assign(new Error('UNKNOWN_FUNCTION'), {
          reason: 'UNKNOWN_FUNCTION',
        });
      }
      return {
        text: null,
        functionName: name,
        functionArgs: JSON.stringify(fnPart.functionCall.args ?? {}),
      };
    }

    const textPart = parts.find((p) => typeof p.text === 'string') as
      | { text?: string }
      | undefined;

    return {
      text: textPart?.text ?? "Désolé, je n'ai pas compris.",
      functionName: null,
      functionArgs: null,
    };
  },
};