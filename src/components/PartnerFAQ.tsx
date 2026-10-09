import React, { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { gsap } from '../lib/gsap';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Qu'est-ce que le Programme Partenaires ?",
    answer:
      "C'est un dispositif qui permet à nos clients de devenir des prescripteurs. En signant un accord de partenariat, votre entreprise reçoit un lien de referral unique, des remises sur vos prestations additionnelles et un accès prioritaire à la production. La commission démarre dès votre premier client apporté.",
  },
  {
    question: "Est-ce que je dois être client Netpub pour devenir partenaire ?",
    answer:
      "Oui. Le Programme Partenaires est réservé à nos clients. C'est notre principe : un partenaire qui utilise nos services connaît réellement notre travail et peut le recommander en confiance.",
  },
  {
    question: "Signer l'accord, est-ce que ça me rapporte quelque chose ?",
    answer:
      "Non, pas de commission. Signer l'accord ne vous engage à rien et ne nous doit rien non plus. Vous récupérez simplement un lien de referral, des remises et un accès prioritaire. La commission démarre uniquement quand vous apportez un client qui signe.",
  },
  {
    question: "Comment sont calculées les commissions ?",
    answer:
      "Le taux dépend de votre statut : 7% au statut Actif (1 client), 10% au Premium (3 clients), 12% au Stratégique (5 clients). Le taux s'applique sur le montant du contrat annuel apporté. Exemple : un contrat Performance ferme de 12 mois à 450 000 FCFA/mois, soit 5 400 000 FCFA par an, génère 648 000 FCFA de commission au statut Stratégique.",
  },
  {
    question: "Quand et comment suis-je payé ?",
    answer:
      "La commission porte sur le contrat annuel du client recommandé, versée en une fois par virement ou mobile money. Dès que le client règle sa facture annuelle, votre commission est déclenchée.",
  },
  {
    question: "Comment fonctionne le lien de referral ?",
    answer:
      "Chaque partenaire reçoit un lien personnel qui lui est propre. Lorsqu'un contrat est signé via ce lien, le client recommandé est automatiquement attribué à ce partenaire. Vous pouvez partager ce lien sur LinkedIn, par email, sur votre site, ou lors de vos échanges professionnels.",
  },
  {
    question: "Quels avantages ai-je en plus de la commission ?",
    answer:
      "Vos partenaires bénéficient de remises sur les prestations additionnelles, d'un accès prioritaire aux créneaux de production, d'une visibilité sur notre site (sur demande), et d'un accès au réseau des autres entreprises partenaires de Netpub.",
  },
  {
    question: "Y a-t-il un engagement de ma part ?",
    answer:
      "L'accord est souple : vous recommandez Netpub quand vous le jugez pertinent, via votre lien. Vous n'avez aucune obligation de volume minimum. Le seul engagement est de signaler vos recommandations via votre lien, pour que la traçabilité fonctionne.",
  },
  {
    question: "Y a-t-il un risque de conflit d'intérêt ?",
    answer:
      "Non. Netpub reste toujours votre prestataire : c'est nous qui exécutons la prestation et nous facturons le client recommandé selon la grille tarifaire standard. En tant que partenaire, vous êtes prescripteur, jamais sous-traitant.",
  },
];

const PartnerFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    const isOpen = openIndex === index;
    const nextOpen = isOpen ? null : index;
    setOpenIndex(nextOpen);

    const el = itemRefs.current[index];
    const answer = el?.querySelector<HTMLElement>('.partner-faq-answer');
    if (!answer) return;

    gsap.killTweensOf(answer);

    if (nextOpen === index) {
      // Mesure réelle de la hauteur du contenu
      gsap.set(answer, { height: 'auto' });
      const targetHeight = answer.offsetHeight;
      gsap.fromTo(
        answer,
        { height: 0, opacity: 0 },
        { height: targetHeight, opacity: 1, duration: 0.45, ease: 'power3.out' }
      );
    } else {
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <div className="partner-faq">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`partner-faq-item ${isOpen ? 'open' : ''}`}
          >
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
            <div className="partner-faq-answer" style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PartnerFAQ;