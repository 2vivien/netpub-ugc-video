import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, PortfolioCategory } from '../types';
import { useChatbot } from '../contexts/ChatbotContext';
import { NotificationService } from '../lib/notifications';
import { getAIContext } from '../lib/context-loader';
import { askNaila, fetchNailaStatus, NailaTurn } from '../lib/nailaClient';

// --- Interfaces pour Speech Recognition ---

interface SpeechRecognitionInstance extends EventTarget {
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognitionInstance;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionConstructor | undefined;
        webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
        webkitAudioContext: typeof AudioContext;
    }
}

interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
            length: number;
        };
        length: number;
    };
}

// --- Utilitaires Naïla ---
//
// L'appel au modèle passe par le backend (mutation `askNaila`).
// Aucune clé API n'est lue ni exposée dans le navigateur.

/**
 * Traduit un motif renvoyé par le serveur en diagnostic lisible.
 * Le serveur classifie déjà ses erreurs : le front ne fait que les nommer.
 */
const describeNailaError = (err: unknown): string => {
    const reason = err instanceof Error ? err.message : String(err);

    switch (reason) {
        case 'MISSING_KEY':
            return 'Clé API absente côté serveur — ajoute GEMINI_API_KEY dans .env puis relance le backend';
        case 'API_KEY_INVALID':
            return 'Clé API invalide — génère-en une sur aistudio.google.com/apikey et remplace GEMINI_API_KEY dans .env';
        case 'PERMISSION_DENIED':
            return 'Accès refusé (403) — active la Generative Language API sur le projet Google Cloud';
        case 'MODEL_NOT_FOUND':
            return `Modèle introuvable (404) — ajuste GEMINI_MODEL_ID dans .env`;
        case 'QUOTA_EXCEEDED':
            return 'Quota Gemini dépassé (429) — réessaie plus tard';
        case 'SERVER_ERROR':
            return 'Erreur serveur Gemini (5xx) — réessaie dans un instant';
        case 'NETWORK_ERROR':
            return 'Serveur injoignable — vérifie que le backend tourne';
        default:
            return reason;
    }
};

/** Message utilisateur selon la cause réelle de l'échec. */
const userFacingError = (err: unknown): string => {
    const reason = err instanceof Error ? err.message : String(err);

    switch (reason) {
        case 'MISSING_KEY':
        case 'API_KEY_INVALID':
        case 'PERMISSION_DENIED':
        case 'MODEL_NOT_FOUND':
            return "Je ne peux pas répondre pour le moment : ma configuration IA n'est pas valide. Écris-nous à contact@netpub.eurinhash.com et on répond directement 😊";
        case 'QUOTA_EXCEEDED':
            return "Oups ! Je suis un peu trop sollicitée en ce moment. Attends quelques secondes et réessaie 😊";
        case 'SERVER_ERROR':
            return "Le serveur est un peu fatigué. Réessaie dans un instant, je suis là ! 🔋";
        case 'NETWORK_ERROR':
        case 'HTTP_502':
        case 'HTTP_503':
            return "J'ai du mal à joindre mon cerveau là. Réessaie dans un instant 🛠️";
        default:
            return "Oups, Naïla a eu un petit hoquet. Peux-tu reformuler ta question ? 😊";
    }
};

// --- Composant Principal ---

/**
 * Exécute l'appel de fonction demandé par le modèle et renvoie le texte de
 * confirmation à afficher. Les mutations GraphQL restent côté client comme
 * auparavant : seule l'appel au modèle est passé côté serveur.
 */
const applyNailaFunction = async (
  name: string,
  args: Record<string, unknown>,
  conversationId: string | null
): Promise<string> => {
    const post = async (query: string, variables: Record<string, unknown>) => {
        await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
    };

    switch (name) {
        case 'prendreRendezVous': {
            const service = String(args.service ?? '');
            const date = String(args.date ?? '');
            const heure = String(args.heure ?? '');
            await post(
                `mutation CreateAppointment($service: String!, $date: String!, $time: String!, $conversationId: String!) {
                    createAppointment(service: $service, date: $date, time: $time, conversationId: $conversationId) { id }
                }`,
                { service, date, time: heure, conversationId }
            );
            return `RDV noté pour ${service} le ${date} à ${heure}.`;
        }

        case 'enregistrerNomClient': {
            const prenom = String(args.prenom ?? '');
            const nom = args.nom ? String(args.nom) : '';
            await post(
                `mutation UpdateConversation($conversationId: String!, $clientName: String) {
                    updateConversation(conversationId: $conversationId, clientName: $clientName) { id }
                }`,
                { conversationId, clientName: nom ? `${nom} ${prenom}` : prenom }
            );
            return `C'est noté ${prenom} ! Qu'est-ce qui t'amène ?`;
        }

        case 'collecterInfosClient': {
            const prenom = String(args.prenom ?? '');
            await post(
                `mutation UpdateConversation($conversationId: String!, $clientName: String, $clientEmail: String, $clientPhone: String) {
                    updateConversation(conversationId: $conversationId, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone) { id }
                }`,
                {
                    conversationId,
                    clientName: prenom,
                    clientEmail: args.email ? String(args.email) : null,
                    clientPhone: args.telephone ? String(args.telephone) : null,
                }
            );
            return `Merci ${prenom} ! Infos notées.`;
        }

        case 'collecterFeedbackSite': {
            const message = String(args.message ?? '');
            return `Merci pour ton retour, on le note : « ${message} »`;
        }

        case 'passerCommande': {
            const service = String(args.service ?? '');
            return `Commande enregistrée pour « ${service} ». On te recontacte pour finaliser.`;
        }

        default:
            return "C'est noté !";
    }
};

const Chatbot: React.FC = () => {
    const { isOpen, toggleChatbot, closeChatbot } = useChatbot();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputValueRef = useRef(inputValue);
    const messagesRef = useRef(messages);

    /**
     * Statut de la configuration IA, demandé au serveur.
     * 'pending' = pas encore testé · 'valid' · 'invalid' · 'missing'
     */
    const [keyStatus, setKeyStatus] = useState<'pending' | 'valid' | 'invalid' | 'missing'>('pending');
    const keyCheckedRef = useRef(false);

    useEffect(() => {
        inputValueRef.current = inputValue;
    }, [inputValue]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const GRAPHQL_ENDPOINT = '/graphql';

    /**
     * Demande au serveur si sa clé Gemini est opérationnelle.
     * La clé n'est jamais lue ici : le front ne fait que lire un statut.
     */
    const verifyApiKey = useCallback(async (): Promise<boolean> => {
        try {
            const status = await fetchNailaStatus();

            if (!status.configured) {
                setKeyStatus('missing');
                console.error('[Chatbot] GEMINI_API_KEY absente côté serveur — ajoute-la dans .env');
                return false;
            }

            if (!status.valid) {
                setKeyStatus('invalid');
                console.error('[Chatbot] Clé Gemini rejetée —', status.reason);
                return false;
            }

            setKeyStatus('valid');
            return true;
        } catch (err) {
            setKeyStatus('invalid');
            console.error('[Chatbot] Impossible de vérifier la configuration IA —', err);
            return false;
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speakText = useCallback((text: string) => {
        if (!window.speechSynthesis || !text) return;

        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1;
        utterance.pitch = 1;

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [stopSpeaking]);

    const saveChatMessageToDb = useCallback(async (sender: string, text: string) => {
        if (!conversationId) return;
        try {
            await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation AddChatMessage($conversationId: ID!, $sender: String!, $text: String!) {
                        addChatMessage(conversationId: $conversationId, sender: $sender, text: $text) { id }
                    }`,
                    variables: { conversationId, sender, text },
                }),
            });
        } catch { /* ignore */ }
    }, [conversationId]);

    const createConversation = useCallback(async () => {
        if (isLoading || conversationId) return;
        setIsLoading(true);

        const initialGreeting = keyStatus === 'valid'
            ? "Salut ! 😊 Je suis Naïla, Community Manager chez Netpub. Comment dois-je t'appeler ?"
            : keyStatus === 'missing'
                ? "Hé ! On m'a oublié une configuration côté serveur. Écris-nous à contact@netpub.eurinhash.com et on te répond avec le sourire 😊"
                : keyStatus === 'invalid'
                    ? "Je ne peux pas répondre pour le moment : ma clé d'IA n'est pas valide. Écris-nous à contact@netpub.eurinhash.com et on s'occupe de tout 😊"
                    : "Salut ! 😊 Je suis Naïla, Community Manager chez Netpub. Comment dois-je t'appeler ?";

        // Afficher l'accueil AVANT tout appel réseau : si la persistance
        // échoue, l'utilisateur doit quand même voir un message.
        setMessages([{ id: Date.now(), role: 'model', text: initialGreeting, type: 'text' }]);

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `mutation CreateConversation { createConversation { id userName userId } }`,
                }),
            });

            interface CreateConversationResponse {
                data?: {
                    createConversation?: {
                        id: string;
                        userName: string;
                        userId: string;
                    };
                };
            }

            const result = await response.json() as CreateConversationResponse;

            if (result.data?.createConversation) {
                const conversation = result.data.createConversation;
                setConversationId(conversation.id);

                await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `mutation AddChatMessage($conversationId: ID!, $sender: String!, $text: String!) {
                            addChatMessage(conversationId: $conversationId, sender: $sender, text: $text) { id }
                        }`,
                        variables: { conversationId: conversation.id, sender: 'model', text: initialGreeting }
                    }),
                });

                NotificationService.notifyNewConversation({
                    id: conversation.id,
                    userName: conversation.userName,
                    userId: conversation.userId
                });
            }
        } catch (err) {
            // Le salon reste utilisable même si la sauvegarde échoue
            console.error('[Chatbot] createConversation a échoué —', err);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, isLoading, keyStatus]);

    const handleSendMessage = useCallback(async (e: React.FormEvent | null, textOverride?: string) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || inputValueRef.current;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: textToSend, type: 'text' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        stopSpeaking();
        saveChatMessageToDb('user', textToSend);

        // L'historique part au serveur, qui construit l'appel au modèle.
        // Le premier message (accueil) n'est pas de l'utilisateur : on l'exclut.
        const history: NailaTurn[] = messagesRef.current
            .filter((msg, index) => !(index === 0 && msg.role === 'model'))
            .map((msg) => ({ role: msg.role, text: msg.text }));

        try {
            // Le contexte métier est fourni par le front puis transféré côté serveur,
            // qui le joint à l'instruction système.
            const answer = await askNaila(textToSend, history, getAIContext());

            if (answer.functionName) {
                let args: Record<string, unknown> = {};
                try {
                    args = JSON.parse(answer.functionArgs || '{}');
                } catch {
                    args = {};
                }

                const confirmationText = await applyNailaFunction(
                    answer.functionName,
                    args,
                    conversationId
                );

                const functionMessage: ChatMessage = {
                    id: Date.now(),
                    role: 'model',
                    text: confirmationText,
                    type: 'function_confirmation',
                };
                setMessages(prev => [...prev, functionMessage]);
                saveChatMessageToDb('model', confirmationText);
                speakText(confirmationText);
            } else {
                const modelText = answer.text || "Désolé.";
                const modelMessage: ChatMessage = { id: Date.now(), role: 'model', text: modelText, type: 'text' };
                setMessages(prev => [...prev, modelMessage]);
                saveChatMessageToDb('model', modelText);
                speakText(modelText);
            }
        } catch (err) {
            console.error('[Chatbot] Échec de la génération —', describeNailaError(err));

            // Une erreur de configuration court terme la session :
            // inutile de laisser l'utilisateur réessayer en boucle.
            const reason = err instanceof Error ? err.message : '';
            if (
                reason === 'MISSING_KEY' ||
                reason === 'API_KEY_INVALID' ||
                reason === 'PERMISSION_DENIED'
            ) {
                setKeyStatus(reason === 'MISSING_KEY' ? 'missing' : 'invalid');
            }

            const errorMessage = userFacingError(err);
            setMessages(prev => [...prev, { id: Date.now(), role: 'model', text: errorMessage, type: 'text' }]);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, isLoading, saveChatMessageToDb, speakText, stopSpeaking]);

    useEffect(() => {
        if (isOpen) {
            // 1. Demander au serveur si sa configuration IA est opérationnelle
            if (!keyCheckedRef.current) {
                keyCheckedRef.current = true;
                verifyApiKey();
            }

            // 2. La conversation démarre une fois le statut connu,
            //    pour que l'accueil reflète la réalité
            if (keyStatus !== 'pending' && messages.length === 0 && !conversationId && !isLoading) {
                createConversation();
            }

            const handler = (event: Event) => {
                const customEvent = event as CustomEvent<{ message?: string }>;
                const msg = customEvent.detail?.message;
                if (msg) handleSendMessage(null, msg);
            };
            window.addEventListener('chatbotContext', handler);
            return () => window.removeEventListener('chatbotContext', handler);
        } else {
            if (messages.length > 0) setMessages([]);
            if (conversationId !== null) setConversationId(null);
        }
    }, [isOpen, messages.length, conversationId, isLoading, createConversation, handleSendMessage, keyStatus, verifyApiKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        const recognition = new SR();
        recognition.lang = 'fr-FR';
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            handleSendMessage(null, transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
    }, [handleSendMessage]);

    const handleToggleChatbot = () => {
        toggleChatbot();
    };

    const handleToggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            stopSpeaking();
            recognitionRef.current.start();
        }
    };

    const handleCloseChatbot = async () => {
        if (conversationId) {
            try {
                await fetch(GRAPHQL_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `mutation NotifyEnded($id: ID!) { notifyConversationEnded(conversationId: $id) }`,
                        variables: { id: conversationId }
                    })
                });
            } catch { /* ignore silently */ }
        }
        closeChatbot();
    };

    return (
        <>
            <button className="chatbot-toggler" onClick={handleToggleChatbot}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15zM2 8c0-3.418 2.582-6.182 5.5-6.182S13.5 4.582 13.5 8s-2.582 6.182-5.5 6.182c-1.802 0-3.41-.8-4.47-2.067a.498.498 0 0 1 .11-.643c.488-.34.954-.743 1.34-1.22.04-.05.056-.118.042-.176-.17-.73-.255-1.52-.255-2.355C4.733 8.36 4.613 8.68 4.5 9c-.114.32-.26.657-.43 1.004-.175.35-.37.718-.592 1.107A6.47 6.47 0 0 1 2 8zm5-1.996a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002zm2.5-.002a.5.5 0 0 0-1 0v.002a.5.5 0 0 0 1 0v-.002z" /></svg>
            </button>
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h2>Naïla - Assistante Netpub</h2>
                        <button onClick={handleCloseChatbot} aria-label="Fermer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg></button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.role}`}>
                                {msg.role === 'model' && isLoading && messages[messages.length - 1].id === msg.id ? (
                                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                                ) : <p>{msg.text}</p>}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Posez votre question..." disabled={isLoading} />
                        <button type="button" className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={handleToggleRecording} disabled={isLoading}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" /><path d="M8 8a3 3 0 0 0 3-3V3a3 3 0 0 0-6 0v2a3 3 0 0 0 3 3z" /></svg>
                        </button>
                        <button type="submit" disabled={isLoading || !inputValue.trim()}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493z" /></svg></button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;