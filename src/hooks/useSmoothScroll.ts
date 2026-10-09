import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

/**
 * Smooth scroll Lenis, synchronisé avec ScrollTrigger.
 *
 * Sans ce couplage, les déclencheurs de GSAP se calent sur la position
 * native alors que le défilement réel est interpolé par Lenis : les
 * animations démarrent en retard et les pins sautent.
 */
export const useSmoothScroll = (): void => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Un peu d'inertie : le défilement s'arrête au lieu de s'arrêter net.
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    const onScroll = () => ScrollTrigger.update();

    lenis.on('scroll', onScroll);

    // Lenis pilote le ticker GSAP : une seule horloge pour les deux.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Les liens d'ancrage doivent passer par Lenis, sinon le scroll
    // natif et le scroll lissé se marchent dessus.
    const onClickAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
    };

    document.addEventListener('click', onClickAnchor);

    // Le conteneur peut changer de taille (images lazy, charts) :
    // sans ça les déclencheurs gardent une géométrie périmée.
    const refresh = () => lenis.resize();
    window.addEventListener('resize', refresh);

    return () => {
      document.removeEventListener('click', onClickAnchor);
      window.removeEventListener('resize', refresh);
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
};
