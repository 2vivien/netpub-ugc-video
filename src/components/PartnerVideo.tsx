import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

const VIDEO_SOURCES = [
  { src: '/Video/programme-partenaires/programme-partenaires.webm', type: 'video/webm' },
  { src: '/Video/programme-partenaires/programme-partenaires.mp4', type: 'video/mp4' },
];

const PartnerVideo: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      gsap.from('.partner-video-frame', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
        },
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from('.partner-video-caption', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.25,
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      className="partner-video"
      ref={rootRef}
      aria-label="Présentation du Programme Partenaires"
    >
      <div className="partner-video-frame">
        <video
          className="partner-video-el"
          width={1920}
          height={1080}
          controls
          preload="metadata"
          playsInline
          poster="/webp-images/programme-partenaires-poster.webp"
        >
          {VIDEO_SOURCES.map((s) => (
            <source key={s.type} src={s.src} type={s.type} />
          ))}
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>

      <p className="partner-video-caption">
        Le Programme Partenaires en 15 secondes — de l’accord signé à la commission versée.
      </p>
    </section>
  );
};

export default PartnerVideo;