import React from 'react';
import PartnerTierChart, { PartnerTier } from './PartnerTierChart';
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
    title: 'Commission jusqu’à 12%',
    description: 'De 7% à 12% selon votre statut, sur la première année de chaque contrat apporté. Payable à l’encaissement.',
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
      'Le taux dépend de votre statut : 7%, 10% ou 12% de la première année, payables dès l’encaissement du premier paiement.',
  },
];

const levels: PartnerTier[] = [
  {
    name: 'Partenaire',
    condition: 'Accord signé',
    rate: 0,
    bonus: 'Lien de referral + remises',
    colors: ['#c7cbd1', '#9aa1aa', '#6b7280'],
  },
  {
    name: 'Partenaire Actif',
    condition: '1 client apporté et signé',
    rate: 7,
    bonus: 'Accès prioritaire production',
    colors: ['#a5e3ff', '#38bdf8', '#0284c7'],
  },
  {
    name: 'Partenaire Premium',
    condition: '3+ clients apportés',
    rate: 10,
    bonus: 'Accès prioritaire étendu',
    colors: ['#cfc0ff', '#8b7cf6', '#6d4fe0'],
  },
  {
    name: 'Partenaire Stratégique',
    condition: '5+ clients apportés',
    rate: 12,
    bonus: 'Projets spécifiques + cas client',
    colors: ['#ffd88a', '#f59e0b', '#d97706'],
    featured: true,
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
            <strong>Performance à 450 000 FCFA/mois</strong>, au statut Stratégique.
          </p>
          <p className="partner-example-math">
            450 000 × 12 mois × 12% ={' '}
            <span className="partner-example-result">648 000 FCFA</span>
          </p>
          <p className="partner-example-note">
            Partenaire Stratégique — le taux le plus élevé du programme.
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
          {levels.map((level) => (
            <PartnerTierChart
              key={level.name}
              tier={level}
            />
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