import React, { useRef, useState } from 'react';
import { Handshake } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

const NODES = [
  'Vous devenez partenaire',
  'Vous recommandez',
  'Le client signe',
  'Il devient partenaire',
];

interface LoopRailProps {
  /**
   * Facteur de duplication du contenu. 2 = le contenu apparaît deux fois
   * d'affilée, ce qui rend la remontée invisible (quand la fin du rail
   * atteint le bord gauche, le début exact entre par la droite).
   */
  repeats?: number;
}

/**
 * Rail horizontal défilant en continu.
 *
 * La séquence entre par la DROITE et sort par la GAUCHE, comme dans le
 * design de référence. L'illusion repose sur un contenu dupliqué
 * `repeats` fois : `translateX` va de 0 à `-100 / repeats` %, soit
 * exactement la largeur d'une copie. Au moment où la copie qui sort
 * quitte le bord gauche, la copie suivante entre par la droite.
 *
 * Le rail s'arrête au survol et se fige sous `prefers-reduced-motion`
 * (l'information reste lisible, seule l'animation s'arrête).
 */
const LoopRail: React.FC<LoopRailProps> = ({ repeats = 2 }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const track = trackRef.current;
      if (!track) return;

      const duration = 26;
      // 1 copie = -100 %. On décale d'exactement une copie.
      const distance = () => -(100 / repeats);

      const tween = gsap.to(track, {
        xPercent: distance,
        duration,
        ease: 'none',
        repeat: -1,
        // 'reverse' repartirait du mauvais côté : on veut un cycle continu.
        repeatRefresh: true,
      });

      const root = rootRef.current;
      const enter = () => tween.timeScale(0.18);
      const leave = () => tween.timeScale(1);
      const freeze = () => tween.pause();
      const resume = () => tween.play();

      root?.addEventListener('pointerenter', enter);
      root?.addEventListener('pointerleave', leave);
      root?.addEventListener('focusin', enter);

      return () => {
        root?.removeEventListener('pointerenter', enter);
        root?.removeEventListener('pointerleave', leave);
        root?.removeEventListener('focusin', enter);
        void freeze;
        void resume;
        tween.kill();
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      className="loop-rail"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="loop-rail-track" ref={trackRef}>
        {Array.from({ length: repeats }, (_, block) => (
          <div className="loop-rail-block" key={block} aria-hidden={block > 0}>
            {NODES.map((label, i) => (
              <React.Fragment key={label}>
                <div className="loop-rail-node">
                  <Handshake size={18} />
                  <span>{label}</span>
                </div>
                {i < NODES.length - 1 && <span className="loop-rail-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* Dégradés de bord : le contenu se fond au lieu d'être coupé net */}
      <span className="loop-rail-fade is-left" aria-hidden="true" />
      <span className="loop-rail-fade is-right" aria-hidden="true" />
    </div>
  );
};

export default LoopRail;
