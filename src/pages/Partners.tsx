import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PartnerProgram from '../components/PartnerProgram';
import PartnerVideo from '../components/PartnerVideo';
import PartnerFAQ from '../components/PartnerFAQ';
import { usePartnersAnimations } from '../hooks/usePartnersAnimations';
import { useChatbot } from '../contexts/ChatbotContext';
import SEO from '../components/SEO';
import '../assets/styles/Partners.css';

const Partners = () => {
  const { openChatbot } = useChatbot();
  const rootRef = useRef<HTMLDivElement>(null);

  usePartnersAnimations(rootRef);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setEmail('');
  };

  return (
    <div className="page-container partners-page" ref={rootRef}>
      <SEO
        title="Programme Partenaires - Devenir prescripteur & touché une commission"
        description="Le Programme Partenaires Netpub : recommandez Netpub à votre réseau, touchez jusqu'à 12% de commission sur chaque contrat signé, et bénéficiez de remises et de l'accès prioritaire à la production."
        keywords="programme partenaires, affiliation, commission, prescripteur, réseau entreprises, netpub, marketing externe"
      />

      {/* Hero */}
      <section className="partner-hero">
        <span className="partner-hero-eyebrow">Programme Partenaires</span>
        <h1 className="partner-hero-title">
          Votre réseau vaut plus<br />
          que votre portefeuille
        </h1>
        <p className="partner-hero-subtitle">
          Netpub ne fonctionne pas comme une agence où la relation s'arrête après la
          prestation. Chaque client peut devenir prescripteur, toucher une commission,
          et construire un réseau d'opportunités avec nous.
        </p>

        <div className="partner-hero-actions">
          <a href="#devenir-partenaire" className="cta-button">
            Rejoindre le programme
          </a>
          <Link to="/contact" className="cta-button-secondary">
            Nous contacter
          </Link>
        </div>
      </section>

      {/* Vidéo de présentation */}
      <PartnerVideo />

      {/* Programme */}
      <PartnerProgram />

      {/* Devenir partenaire */}
      <section id="devenir-partenaire" className="partner-join">
        <div className="partner-join-inner">
          <h2>Devenir Partenaire Netpub</h2>
          <p>
            Vous êtes déjà client ? Demandez votre lien de referral et rejoignez le
            programme. Nous vous répondons sous 48h.
          </p>

          {sent ? (
            <div className="partner-join-success">
              <p>Demande reçue. Notre équipe vous recontacte sous 48h.</p>
              <button className="cta-button-secondary" onClick={() => setSent(false)}>
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form className="partner-join-form" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                aria-label="Votre email"
                required
              />
              <button type="submit" className="cta-button">
                Demander mon lien
              </button>
            </form>
          )}

          <p className="partner-join-note">
            Pas encore client ?{' '}
            <Link to="/services" onClick={() => setTimeout(openChatbot, 300)}>
              Découvrir nos offres
            </Link>{' '}
            et choisissons votre niveau d'accompagnement.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="partner-faq-section">
        <div className="partner-section-header">
          <h2 className="section-title">Questions fréquentes</h2>
          <p className="section-subtitle">
            Tout ce qu'il faut savoir avant de rejoindre le programme.
          </p>
        </div>

        <PartnerFAQ />
      </section>
    </div>
  );
};

export default Partners;