import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Hook d'animations pour la page Partenaires.
 * Tout est scope au ref racine pour éviter les conflits.
 */
export const usePartnersAnimations = (rootRef: React.RefObject<HTMLElement | null>) => {
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      /* ---------- 1. HERO : split-text reveal ---------- */
      const heroTitle = rootRef.current?.querySelector('.partner-hero-title');
      if (heroTitle) {
        // Découpe le titre en lignes puis en mots
        const lines = heroTitle.innerHTML.split('<br />');

        heroTitle.innerHTML = lines
          .map(
            (line: string) =>
              `<span class="hero-line-mask"><span class="hero-line-inner">${line}</span></span>`
          )
          .join('');

        gsap.set('.hero-line-inner', { yPercent: 110 });

        gsap.to('.hero-line-inner', {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
        });
      }

      // Eyebrow + subtitle + actions
      gsap.from('.partner-hero-eyebrow', {
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: 'power2.out',
      });

      gsap.from('.partner-hero-subtitle', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.45,
      });

      gsap.from('.partner-hero-actions > *', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.6,
      });

      /* ---------- 2. AVANTAGES : cascade + halo ---------- */
      gsap.from('.partner-benefit-card', {
        scrollTrigger: {
          trigger: '.partner-benefits-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
      });

      /* ---------- 3. ÉTAPES : fade in / fade out au scroll ---------- */
      const stepCards = gsap.utils.toArray<HTMLElement>('.partner-step');

      stepCards.forEach((card, i) => {
        const content = card.querySelector('.partner-step-inner');

        // Entrée quand la carte arrive dans le tiers bas du viewport
        gsap.fromTo(
          content,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Léger décalage entre les cartes, pour un rythme
        /* Barre verticale : grandit de 0 à 1 pendant que la carte
           monte dans le viewport, puis se fige. */
        gsap.fromTo(
          card,
          { '--step-progress': 0 },
          {
            '--step-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 42%',
              scrub: 0.4,
            },
          }
        );

        void i;
      });

      /* ---------- 4. COMPTEUR ANIMÉ 648 000 FCFA ---------- */
      const resultEl = rootRef.current?.querySelector('.partner-example-result');
      if (resultEl) {
        const finalValue = 648000;
        const counter = { value: 0 };

        gsap.to(counter, {
          value: finalValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.partner-example',
            start: 'top 78%',
          },
          onUpdate: () => {
            const formatted = Math.floor(counter.value)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            resultEl.textContent = `${formatted} FCFA`;
          },
        });

        // Entry scale du bloc
        gsap.from('.partner-example-inner', {
          scrollTrigger: {
            trigger: '.partner-example',
            start: 'top 80%',
          },
          scale: 0.94,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      }

      /* ---------- 5. STATUTS : reveal progressif ---------- */
      gsap.from('.partner-level-card', {
        scrollTrigger: {
          trigger: '.partner-levels-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.11,
      });

      /* ---------- 6. BOUCLE : apparition du rail ---------- */
      const rail = rootRef.current?.querySelector('.loop-rail');
      if (rail) {
        gsap.from(rail, {
          scrollTrigger: {
            trigger: '.partner-loop',
            start: 'top 85%',
          },
          opacity: 0,
          y: 30,
          duration: 0.85,
          ease: 'power3.out',
        });
      }

      /* ---------- 7. CTA : slide up ---------- */
      gsap.from('.partner-join-inner', {
        scrollTrigger: {
          trigger: '.partner-join',
          start: 'top 84%',
        },
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      /* ---------- 8. FAQ : headers en stagger ---------- */
      gsap.from('.partner-faq-item', {
        scrollTrigger: {
          trigger: '.partner-faq',
          start: 'top 82%',
        },
        opacity: 0,
        x: -20,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.07,
      });
    },
    { scope: rootRef }
  );
};

/**
 * Refresh des ScrollTrigger après changement de contenu (lazy images, etc).
 */
export const refreshPartnerScrollTriggers = () => {
  ScrollTrigger.refresh();
};