import React from 'react';
import {
  Handshake,
  Link2,
  Coins,
  Percent,
  Clock,
  Star,
  Users,
} from 'lucide-react';

const benefits = [
  {
    icon: <Link2 size={22} />,
    title: 'Lien de referral unique',
    description: 'Une page dédiée à votre nom qui enregistre automatiquement chaque recommandation.',
  },
  {
    icon: <Coins size={22} />,
    title: 'Commission de 12%',
    description: 'Sur la première année de chaque contrat apporté et signé. Payable à l’encaissement.',
  },
  {
    icon: <Percent size={22} />,
    title: 'Tarifs préférentiels',
    description: '10% de remise sur toutes vos prestations additionnelles, quel que soit le niveau.',
  },
  {
    icon: <Clock size={22} />,
    title: 'Priorité production',
    description: 'Réservation prioritaire sur les créneaux de tournage et de post-production.',
  },
  {
    icon: <Users size={22} />,
    title: 'Accès au réseau',
    description: 'Mise en relation avec les autres entreprises partenaires de Netpub.',
  },
  {
    icon: <Star size={22} />,
    title: 'Visibilité',
    description: 'Votre logo et votre mention sur notre site, sur simple demande.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Vous signez l’accord',
    description:
      'Une page, pas un contrat d’avocats. Netpub s’engage sur les avantages, vous vous engagez à recommander par votre lien.',
  },
  {
    number: '02',
    title: 'Vous recevez votre lien',
    description:
      'Un lien personnel et unique. Vous le partagez sur LinkedIn, par email, ou lors de vos échanges professionnels.',
  },
  {
    number: '03',
    title: 'Le contrat est signé',
    description:
      'Le client recommandé est automatiquement attribué à votre lien. Nous confirmons l’attribution sous 48h.',
  },
  {
    number: '04',
    title: 'La commission est versée',
    description:
      '12% de la première année, payables dès l’encaissement du premier paiement du client.',
  },
];

const levels = [
  {
    name: 'Partenaire',
    condition: 'Accord signé',
    commission: '12%',
    bonus: 'Lien de referral + avantages',
  },
  {
    name: 'Partenaire Actif',
    condition: '1 client apporté et signé',
    commission: '12%',
    bonus: 'Bonus de 50 000 FCFA',
  },
  {
    name: 'Partenaire Premium',
    condition: '3+ clients apportés',
    commission: '15%',
    bonus: 'Accès prioritaire étendu',
  },
  {
    name: 'Partenaire Stratégique',
    condition: '5+ clients apportés',
    commission: '15%',
    bonus: 'Projets spécifiques + cas client',
  },
];

const PartnerProgram: React.FC = () => {
  return (
    <>
      {/* Avantages */}
      <section className="partner-benefits">
        <div className="partner-section-header">
          <h2 className="section-title">Ce que vous recevez</h2>
          <p className="section-subtitle">
            Un dispositif complet, tracé et rémunéré. Pas du bouche-à-oreille informel.
          </p>
        </div>

        <div className="partner-benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="partner-benefit-card">
              <div className="partner-benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="partner-steps">
        <div className="partner-section-header">
          <h2 className="section-title">Comment ça marche</h2>
          <p className="section-subtitle">Quatre étapes, de l’accord au versement.</p>
        </div>

        <div className="partner-steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="partner-step-card">
              <span className="partner-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Exemple de commission */}
      <section className="partner-example">
        <div className="partner-example-inner">
          <Coins size={28} />
          <p className="partner-example-label">Exemple concret</p>
          <p className="partner-example-text">
            Vous recommandez une PME qui signe un contrat{' '}
            <strong>Performance à 450 000 FCFA/mois</strong>.
          </p>
          <p className="partner-example-math">
            450 000 × 12 mois × 12% ={' '}
            <span className="partner-example-result">648 000 FCFA</span>
          </p>
          <p className="partner-example-note">
            Payables à l’encaissement du premier paiement du client recommandé.
          </p>
        </div>
      </section>

      {/* Statuts */}
      <section className="partner-levels">
        <div className="partner-section-header">
          <h2 className="section-title">Votre statut évolue</h2>
          <p className="section-subtitle">
            Chaque client apporté vous fait monter. L’ascension est le moteur du programme.
          </p>
        </div>

        <div className="partner-levels-grid">
          {levels.map((level, index) => (
            <div
              key={level.name}
              className={`partner-level-card ${index === 3 ? 'highlight' : ''}`}
            >
              {index === 3 && <span className="partner-level-flag">Statut maximal</span>}
              <h3>{level.name}</h3>
              <p className="partner-level-condition">{level.condition}</p>
              <p className="partner-level-commission">{level.commission}</p>
              <p className="partner-level-bonus">{level.bonus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boucle */}
      <section className="partner-loop">
        <div className="partner-section-header">
          <h2 className="section-title">La boucle Netpub</h2>
          <p className="section-subtitle">
            Chaque nouveau client peut devenir prescripteur à son tour.
          </p>
        </div>

        <div className="partner-loop-chain">
          {['Vous devenez partenaire', 'Vous recommandez', 'Le client signe', 'Il devient partenaire'].map(
            (label, index) => (
              <React.Fragment key={label}>
                <div className="partner-loop-node">
                  <Handshake size={20} />
                  <span>{label}</span>
                </div>
                {index < 3 && <span className="partner-loop-arrow">→</span>}
              </React.Fragment>
            )
          )}
        </div>
      </section>
    </>
  );
};

export default PartnerProgram;