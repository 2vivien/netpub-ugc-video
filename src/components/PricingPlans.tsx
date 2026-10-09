import React from 'react';
import '../assets/styles/Pricing.css';

interface Plan {
  id: string;
  name: string;
  /** Accroche du PDF, citée telle quelle. */
  pitch: string;
  /** Ce que le palier ajoute au palier précédent. */
  inherits?: string;
  /** Seul le dernier palier affiche un prix. Absent = aucun prix affiché. */
  priceLabel?: string;
  /** Les libellés suivent les sections du PDF, qui diffèrent par palier. */
  groups: { title: string; items: string[] }[];
  /** Met la carte en avant : fond sombre, pour le dernier palier. */
  highlighted?: boolean;
  popular?: boolean;
}

// Contenu repris de docs/netpub-business-plan.md (sections 06 à 09).
// Les paliers sont cumulatifs : chaque niveau inclut le précédent.
// Aucun prix n'est affiché ici, la prise de contact passe par le chatbot.
const plans: Plan[] = [
  {
    id: 'presence',
    name: 'Netpub Présence',
    pitch: 'Votre marque doit être visible avant d’être choisie.',
    groups: [
      {
        title: 'Contenu',
        items: ['4 affiches / mois', '1 vidéo UGC / mois', 'Jusqu’à 12 contenus / mois'],
      },
      {
        title: 'Présence & communauté',
        items: [
          'Audit initial et profil Facebook, Instagram, TikTok, Google Business',
          'Calendrier éditorial mensuel',
          'Gestion des réseaux sociaux et programmation des publications',
          'Community management basique (modération)',
          'Reporting mensuel et recommandations',
        ],
      },
    ],
  },
  {
    id: 'acquisition',
    name: 'Netpub Acquisition',
    pitch: 'Ne vous contentez plus d’être visible. Générez des prospects.',
    inherits: 'Netpub Présence + acquisition payante',
    popular: true,
    groups: [
      {
        title: 'Contenu',
        items: [
          '10 affiches / mois',
          '4 vidéos UGC / mois',
          '2 vidéos court métrage / mois',
          '1 podcast et 1 présentation produit / mois',
        ],
      },
      {
        title: 'Publicité & acquisition',
        items: [
          'Campagnes Meta Ads, TikTok Ads et Google Ads',
          'Création des annonces, tests A/B, retargeting',
          'CRM et parcours d’acquisition',
          'Suivi des conversions et analyse du coût par prospect',
          'Réunion stratégique mensuelle',
        ],
      },
    ],
  },
  {
    id: 'performance',
    name: 'Netpub Performance',
    pitch: 'Votre contenu devient votre machine commerciale.',
    inherits: 'Netpub Acquisition + équipe créative et production vidéo au complet',
    groups: [
      {
        title: 'Contenu',
        items: [
          '12 affiches / mois',
          '6 vidéos UGC / mois',
          '4 vidéos court métrage / mois',
          '4 présentations produit et 2 podcasts / mois',
          'Une séance de tournage par mois',
        ],
      },
      {
        title: 'Production & diffusion',
        items: [
          'Concepts publicitaires, scripts et storyboards',
          'Tournage, direction artistique et comédiens',
          'Montage, sous-titrage, formats TikTok / Reels / Shorts',
          'Publicité Meta, TikTok et Google/YouTube Ads',
          'Optimisation des créations selon les performances',
          'Formation de l’équipe et reporting',
        ],
      },
    ],
  },
  {
    id: 'business',
    name: 'Netpub Business',
    pitch: 'Nous construisons votre système marketing.',
    inherits: 'Netpub Performance + extension de votre équipe marketing',
    priceLabel: 'Sur devis',
    highlighted: true,
    groups: [
      {
        title: 'Contenu',
        items: [
          'Affiches illimitées, sur demande',
          '10 vidéos UGC / mois',
          '8 vidéos court métrage / mois',
          '8 présentations produit / mois',
          '2 podcasts / mois',
          '2 séances de tournage par mois',
        ],
      },
      {
        title: 'Tout Netpub Performance',
        items: [
          'Concepts publicitaires, scripts et storyboards',
          'Tournage, direction artistique et comédiens',
          'Montage, sous-titrage, formats TikTok / Reels / Shorts',
          'Publicité Meta, TikTok et Google/YouTube Ads',
          'Optimisation des créations selon les performances',
        ],
      },
      {
        title: 'Stratégie & accompagnement',
        items: [
          'Stratégie marketing globale, positionnement et plan trimestriel',
          'Stratégie d’acquisition et de conversion',
          'Réunion stratégique mensuelle',
          'Direction marketing externalisée',
          'Construction de CRM sur demande',
          'Création de site et d’application sur demande',
        ],
      },
      {
        title: 'IA & automatisation',
        items: [
          'Assistant IA / chatbot site web, assistant WhatsApp',
          'Réponses automatiques et FAQ automatisée',
          'Qualification des prospects et collecte de leads',
          'Organisation du pipeline commercial et relances',
        ],
      },
      {
        title: 'Formation de l’équipe',
        items: [
          'Formation marketing digital et outils',
          'Formation à l’intelligence artificielle appliquée',
          'Formation à la cybersécurité',
        ],
      },
    ],
  },
];

const PricingPlans: React.FC = () => {
  const openChatbot = (planName: string) => {
    const chatbotButton = document.querySelector('.chatbot-toggler') as HTMLElement;
    if (chatbotButton) {
      chatbotButton.click();
      setTimeout(() => {
        const event = new CustomEvent('chatbotContext', {
          detail: { plan: planName, message: `Je suis intéressé par le ${planName}` },
        });
        window.dispatchEvent(event);
      }, 500);
    }
  };

  const PricingCard = ({ plan }: { plan: Plan }) => (
    <article
      className={[
        'pp-card',
        plan.highlighted ? 'pp-card--dark' : '',
        plan.popular ? 'pp-card--featured' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="pp-card__head">
        {plan.popular && <span className="pp-card__flag">Le plus choisi</span>}
        <h3 className="pp-card__name">{plan.name}</h3>
        <p className="pp-card__pitch">{plan.pitch}</p>
        {/* Seul le dernier palier affiche un prix, sous forme de devis */}
        {plan.priceLabel && <p className="pp-card__price">{plan.priceLabel}</p>}
        {plan.inherits && <p className="pp-card__inherits">{plan.inherits}</p>}
      </header>

      <div className="pp-card__groups">
        {plan.groups.map((group) => (
          <div className="pp-card__group" key={group.title}>
            <h4 className="pp-card__group-title">{group.title}</h4>
            <ul className="pp-card__list">
              {group.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <footer className="pp-card__foot">
        <button
          type="button"
          className="pp-card__cta"
          onClick={() => openChatbot(plan.name)}
        >
          {plan.highlighted ? 'Parler de mon projet' : 'Choisir cette offre'}
        </button>
      </footer>
    </article>
  );

  return (
    <section className="pp-section">
      <div className="pp-container">
        <div className="pp-header">
          <h2 className="pp-title">Choisissez l’expérience qui propulse votre image</h2>
          <p className="pp-subtitle">
            Quatre offres cumulatives : chaque niveau inclut tous les précédents
          </p>
        </div>

        <div className="pp-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;