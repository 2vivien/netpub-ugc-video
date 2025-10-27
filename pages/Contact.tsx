import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaInstagram, FaTiktok, FaYoutube, FaBehance, FaLinkedin } from 'react-icons/fa';
import { useChatbot } from '../contexts/ChatbotContext'; // Import useChatbot

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const contactFormRef = useRef<HTMLDivElement>(null);
  const isContactFormVisible = useOnScreen(contactFormRef, { threshold: 0.1 });

  const directInfoRef = useRef<HTMLDivElement>(null);
  const isDirectInfoVisible = useOnScreen(directInfoRef, { threshold: 0.1 });

  const socialMarqueeRef = useRef<HTMLDivElement>(null);
  const isSocialMarqueeVisible = useOnScreen(socialMarqueeRef, { threshold: 0.1 });

  const contactFooterRef = useRef<HTMLDivElement>(null);
  const isContactFooterVisible = useOnScreen(contactFooterRef, { threshold: 0.1 });

  const socialLinks = [
    { icon: <FaInstagram />, name: 'Instagram', url: '#' },
    { icon: <FaTiktok />, name: 'TikTok', url: '#' },
    { icon: <FaYoutube />, name: 'YouTube', url: '#' },
    { icon: <FaBehance />, name: 'Behance', url: '#' },
    { icon: <FaLinkedin />, name: 'LinkedIn', url: '#' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-container contact-page">
        <div className="contact-thank-you text-center">
          <h1>Merci !</h1>
          <p className="lead">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
          <Link to="/" className="cta-button">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const contactDetails = [
    {
      icon: FiPhone,
      label: 'Appelez-nous',
      value: '+33 6 45 78 90 12',
      href: 'tel:+33645789012',
    },
    {
      icon: FiMail,
      label: 'Écrivez-nous',
      value: 'hello@netpub.agency',
      href: 'mailto:hello@netpub.agency',
    },
    {
      icon: FiMapPin,
      label: 'Basés à',
      value: 'Paris & Cotonou',
    },
    {
      icon: FiClock,
      label: 'Disponibles',
      value: 'Lun – Sam, 9h → 19h',
    },
  ];

  const { openChatbot } = useChatbot(); // Get openChatbot from context

  return (
    <div className="page-container contact-page">

      {/* Section Hero - On crée ensemble ? */}
      <section className="contact-hero-section">
        <video className="contact-hero-video-bg" src="/grok-video-badaba1c-f52f-423e-b1ec-fc1c29427aa1 (1).mp4" autoPlay loop muted playsInline></video>
        <div className="contact-hero-content text-center">
          <h1 className="contact-hero-title">Un projet. Une idée. Une vision ? Parlons-en.</h1>
          <p className="contact-hero-subtitle">Remplissez le formulaire ou contactez-nous directement — on adore les nouveaux défis.</p>
          <Link to="#contact-form-section" className="cta-button contact-hero-cta">Lancer une collaboration</Link>
        </div>
      </section>

      <div className="contact-form-and-info-wrapper">
        {/* Section Formulaire de Contact */}
        <section id="contact-form-section" ref={contactFormRef} className={`contact-form-section fade-up-section ${isContactFormVisible ? 'is-visible' : ''}`}>
          <div className="contact-form-card">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Votre nom, parce qu’on aime savoir à qui on parle…" />
              </div>
              <div className="form-group">
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Un mail pour vous répondre (promis, pas de spam)" />
              </div>
              <div className="form-group">
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Votre entreprise (optionnel)" />
              </div>
              <div className="form-group">
                <select id="service" name="service" value={formData.service} onChange={handleChange}>
                  <option value="">Quel service vous intéresse ?</option>
                  <option value="UGC">Vidéos UGC</option>
                  <option value="Publicités émotionnelles">Publicités émotionnelles</option>
                  <option value="Storytelling & Scénarisation">Storytelling & Scénarisation</option>
                  <option value="Montage & Optimisation Ads">Montage & Optimisation Ads</option>
                  <option value="Design sonore & voix-off émotionnelle">Design sonore & voix-off émotionnelle</option>
                  <option value="Branding & Identité visuelle">Branding & Identité visuelle</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Parlez-nous de votre projet, de vos rêves, de vos défis…"></textarea>
              </div>
              <button type="submit" className="cta-button">Envoyer le message</button>
            </form>
          </div>
        </section>

        {/* Section Informations Directes */}
        <section ref={directInfoRef} className={`direct-info-section fade-up-section ${isDirectInfoVisible ? 'is-visible' : ''}`}>
          <div className="direct-info-card">
            <h3 className="text-3xl font-bold mb-8 text-slate-900">Besoin d'une réponse immédiate ?</h3>
            <p className="text-md text-gray-600 mb-4">Notre assistant virtuel est là pour vous aider 24h/24 et 7j/7. Posez-lui vos questions sur nos services, nos tarifs ou pour toute autre information.</p>
            <button onClick={openChatbot} className="cta-button-secondary inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full shadow-sm text-blue-600 bg-blue-50 hover:bg-blue-100">
              Discuter avec notre Chatbot
            </button>
          </div>
        </section>
      </div>

      {/* Section Réseaux sociaux (bande dynamique) */}
      <section ref={socialMarqueeRef} className={`social-marquee-section bg-gray-900 text-white py-8 fade-up-section ${isSocialMarqueeVisible ? 'is-visible' : ''}`}>
        <div className="social-marquee-track">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="social-marquee-item">
                {social.icon}
                <span className="ml-2">{social.name}</span>
              </a>
            ))}
            {socialLinks.map((social, index) => (
              <a key={index + socialLinks.length} href={social.url} target="_blank" rel="noopener noreferrer" className="social-marquee-item" aria-hidden="true">
                {social.icon}
                <span className="ml-2">{social.name}</span>
              </a>
            ))}
        </div>
      </section>

      {/* Section Footer “Let’s Create Magic.” */}
      <section ref={contactFooterRef} className={`contact-footer-section text-center fade-up-section ${isContactFooterVisible ? 'is-visible' : ''}`}>
        <h2 className="contact-footer-title">Les grandes idées naissent toujours d’une première conversation.</h2>
        <p className="contact-footer-subtitle">Contactez-nous, et donnons vie à la vôtre.</p>
        <button onClick={openChatbot} className="cta-button contact-footer-cta">Contactez-nous directement</button>
      </section>

    </div>
  );
};

export default Contact;






