import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYouModal.css'; // We'll create this CSS file next

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  clientEmail: string;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, clientName, clientEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content thank-you-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="thank-you-header">
          <div className="thank-you-icon">🎉</div>
          <h1>Merci {clientName}!</h1>
        </div>
        <div className="thank-you-body">
          <p className="lead">Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.</p>
          <div className="thank-you-details">
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <span>Un email de confirmation vous a été envoyé à <strong>{clientEmail}</strong></span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span>Réponse sous 24h ouvrées</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <span>Disponible au +229 01 54 10 21 25</span>
            </div>
          </div>
        </div>
        <div className="thank-you-actions">
          <Link to="/" className="cta-button-primary" onClick={onClose}>Retour à l'accueil</Link>
          <Link to="/portfolio" className="cta-button-secondary" onClick={onClose}>Voir notre portfolio</Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
