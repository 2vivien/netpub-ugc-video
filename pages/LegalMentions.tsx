import React from 'react';

const LegalMentions: React.FC = () => {
  return (
    <div className="page-container">
      <header className="article-header text-center">
        <h1>Mentions Légales</h1>
      </header>
      <div className="content-section">
        <p>Netpub est une agence de production publicitaire et UGC (User Generated Content) dédiée à la création de contenus percutants pour les marques.</p>
        <h2>Informations Légales</h2>
        <p><strong>Siège social :</strong> [Votre adresse ici]</p>
        <p><strong>Numéro d'immatriculation :</strong> [Votre numéro d'immatriculation ici]</p>
        <p><strong>Directeur de la publication :</strong> [Nom du directeur]</p>
        <p><strong>Contact :</strong> [Votre email ou formulaire de contact]</p>
        <p><strong>Hébergeur :</strong> [Nom de l'hébergeur, adresse]</p>

        <h2>Propriété Intellectuelle</h2>
        <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>

        <h2>Limitation de Responsabilité</h2>
        <p>Netpub s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, Netpub ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site. En conséquence, Netpub décline toute responsabilité pour toute interruption du site, problèmes techniques, pour toute inexactitude ou omission sur des informations disponibles sur le site, pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à la disposition sur le site.</p>
      </div>
    </div>
  );
};

export default LegalMentions;
