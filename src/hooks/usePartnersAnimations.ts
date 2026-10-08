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

      /* ---------- 2. CARTES AVANTAGES : stagger cascade ---------- */
      gsap.from('.partner-benefit-card', {
        scrollTrigger: {
          trigger: '.partner-benefits-grid',
          start: 'top 82%',
        },
        opacity: 0,
        y: 40,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.09,
      });

      /* ---------- 3. ÉTAPES : ligne verticale qui se dessine ---------- */
      const stepsGrid = rootRef.current?.querySelector('.partner-steps-grid');
      if (stepsGrid) {
        // Crée la ligne verticale reliant les étapes
        const line = document.createElement('div');
        line.className = 'partner-steps-line';
        stepsGrid.appendChild(line);

        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.partner-steps-grid',
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.6,
            },
          }
        );

        gsap.from('.partner-step-card', {
          scrollTrigger: {
            trigger: '.partner-steps-grid',
            start: 'top 78%',
          },
          opacity: 0,
          y: 32,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.14,
        });
      }

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

      /* ---------- 6. BOUCLE : pulsation séquentielle sur les flèches ---------- */
      const arrows = gsap.utils.toArray<HTMLElement>('.partner-loop-arrow');
      if (arrows.length) {
        arrows.forEach((arrow, index) => {
          gsap.fromTo(
            arrow,
            { opacity: 0.2, x: -4 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power2.inOut',
              repeat: -1,
              yoyo: true,
              delay: index * 0.25,
            }
          );
        });

        gsap.from('.partner-loop-node', {
          scrollTrigger: {
            trigger: '.partner-loop-chain',
            start: 'top 82%',
          },
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          ease: 'back.out(1.4)',
          stagger: 0.1,
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