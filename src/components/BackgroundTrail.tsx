import { lazy, Suspense } from 'react';
import { portfolioProjects } from '../constants';

// Chargement dynamique avec lazy loading pour Vite
const ImageTrail = lazy(() => import('./ImageTrail'));

const BackgroundTrail = () => {
  // Use first 6 projects as background trail media
  const backgroundMedia = portfolioProjects.slice(0, 6).map(p => ({
    url: p.mediaUrl,
    type: p.mediaType
  }));

  return (
    <div className="background-trail">
      <Suspense fallback={null}>
        <ImageTrail media={backgroundMedia} />
      </Suspense>
    </div>
  );
};

export default BackgroundTrail;
