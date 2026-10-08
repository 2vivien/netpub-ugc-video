import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Qu'est-ce que le Programme Partenaires ?",
    answer: "C'est un dispositif qui permet à nos clients de devenir des prescripteurs rémunérés. En signant un accord de partenariat, votre entreprise reçoit un lien de referral unique et touche une commission de 12% sur chaque contrat apporté et signé via ce lien.",
  },
  {
    question: "Est-ce que je dois être client Netpub pour devenir partenaire ?",
    answer: "Oui. Le Programme Partenaires est réservé à nos clients. C'est notre principe : un partenaire qui utilise nos services connaît réellement notre travail et peut le recommander en confiance.",
  },
  {
    question: "Comment sont calculées et versées les commissions ?",
    answer: "La commission est de 12% du montant total de la première année de contrat du client apporté (exemple : un contrat Performance à 450 000 FCFA/mois génère 648 000 FCFA de commission sur 12 mois). Elle est versée à l'encaissement du premier paiement du client recommandé, par virement ou mobile money.",
  },
  {
    question: "Comment fonctionne le lien de referral ?",
    answer: "Chaque partenaire reçoit un lien personnel qui lui est propre. Lorsqu'un contrat est signé via ce lien, le client recommandé est automatiquement attribué à ce partenaire. Vous pouvez partager ce lien sur LinkedIn, par email, sur votre site, ou lors de vos échanges professionnels.",
  },
  {
    question: "Quels avantages ai-je en plus de la commission ?",
    answer: "Vos partenaires bénéficient de remises de 10% sur toutes les prestations additionnelles, d'un accès prioritaire aux créneaux de production, d'une visibilité sur notre site (sur demande), et d'un accès au réseau des autres entreprises partenaires de Netpub.",
  },
  {
    question: "Y a-t-il un engagement de ma part ?",
    answer: "L'accord est souple : vous recommandez Netpub quand vous le jugez pertinent, via votre lien. Vous n'avez aucune obligation de volume minimum. Le seul engagement est de signaler vos recommandations via votre lien, pour que la traçabilité fonctionne.",
  },
  {
    question: "Comment puis-je devenir Premium ou Stratégique ?",
    answer: "Le statut évolue selon vos recommandations. À 1 client apporté et signé, vous devenez Partenaire Actif (bonus de 50 000 FCFA). À 3 clients, vous passez à Premium (commission de 15%). À 5 clients ou plus, vous devenez Partenaire Stratégique, avec la possibilité de collaborer sur des projets spécifiques.",
  },
  {
    question: "Y a-t-il un risque de conflit d'intérêt ?",
    answer: "Non. Netpub reste toujours votre prestataire — c'est nous qui exécutons la prestation et nous facturons le client recommandé selon la grille tarifaire standard. En tant que partenaire, vous êtes prescripteur, jamais sous-traitant. Netpub n'est jamais imposé comme référence : le client qui vous a recommandé reste votre client.",
  },
];

const PartnerFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="partner-faq">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`partner-faq-item ${isOpen ? 'open' : ''}`}>
            <button
              className="partner-faq-question"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className="partner-faq-icon">
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>
            <div
              className="partner-faq-answer"
              style={{
                maxHeight: isOpen ? `${item.answer.length * 0.95 + 40}px` : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PartnerFAQ;