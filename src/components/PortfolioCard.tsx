import React, { useRef, useState, useEffect } from 'react';
import { PortfolioProject } from '../types';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './PortfolioCard.css';

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: (project: PortfolioProject) => void;
  aspectRatio?: 'auto' | '9:16';
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaItems = project.mediaItems || [{ url: project.mediaUrl, type: project.mediaType }];

  const handleMediaChange = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(true);
    setIsMuted(true);
    setIsFocused(true); // Auto-focus when selecting from circles/thumbnails
  };

  const toggleFocus = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFocused(!isFocused);
  };

  const getCarouselItems = () => {
    if (mediaItems.length === 0) return [];
    if (mediaItems.length === 1) return [{ item: mediaItems[0], index: 0 }];

    const prev = (activeIndex - 1 + mediaItems.length) % mediaItems.length;
    const next = (activeIndex + 1) % mediaItems.length;

    return [
      { item: mediaItems[prev], index: prev },
      { item: mediaItems[activeIndex], index: activeIndex },
      { item: mediaItems[next], index: next }
    ];
  };

  const carouselCircles = getCarouselItems();

  const currentMedia = mediaItems[activeIndex];

  const renderMedia = () => {
    if (currentMedia.type === 'video') {
      return (
        <video
          ref={videoRef}
          src={currentMedia.url}
          className="influencer-main-photo"
          autoPlay={isPlaying}
          loop
          muted={isMuted} // Controlled by state
          playsInline
          key={currentMedia.url}
        />
      );
    } else {
      return (
        <img
          src={currentMedia.url}
          alt={project.title}
          className="influencer-main-photo"
          loading="lazy"
          key={currentMedia.url}
        />
      );
    }
  };

  return (
    <div className="influencer-card portfolio-item-card" onClick={() => !isFocused && onClick(project)}>
      {/* Corner Label - Category */}
      <div className={`card-label top-right ${isFocused ? 'hidden' : ''}`}>{project.category}</div>

      {/* Main Media */}
      <div className="influencer-main-media" onClick={(e) => isFocused && e.stopPropagation()}>
        {renderMedia()}
      </div>

      {/* Focus Mode Controls */}
      <div className={`focus-ui-controls ${isFocused ? 'visible' : ''}`}>
        <button
          className="focus-close-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsFocused(false);
          }}
          aria-label="Fermer le mode focus"
        >
          <X size={24} />
        </button>

        {currentMedia.type === 'video' && (
          <div className="focus-video-controls" onClick={(e) => e.stopPropagation()}>
            <button className="focus-control-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="focus-control-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        )}
      </div>

      {/* Fog Overlay - Wraps all "obstructing" content */}
      <div className={`influencer-overlay-wrapper ${isFocused ? 'hidden' : ''}`}>
        {/* Fog Overlay */}
        <div className="influencer-fog-overlay"></div>

        {/* Content Overlay */}
        <div className="influencer-content-overlay">
          {/* Carousel circles */}
          {mediaItems.length > 1 && (
            <div className="influencer-carousel-nav">
              {carouselCircles.map((circle, idx) => (
                <div
                  key={`${circle.index}-${idx}`}
                  className={`carousel-circle ${circle.index === activeIndex ? 'active' : ''}`}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleMediaChange(circle.index);
                  }}
                >
                  {circle.item.type === 'video' ? (
                    <video src={circle.item.url} muted playsInline preload="metadata" />
                  ) : (
                    <img src={circle.item.url} alt="media preview" loading="lazy" />
                  )}
                  {circle.index === activeIndex && idx === 1 && (
                    <div className="circle-label">Projet #{circle.index + 1}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Information */}
          <div className="influencer-bottom-info">
            <div className="influencer-name-age">
              {project.title}
            </div>

            <div className="influencer-badges-row">
              {project.tags?.slice(0, 3).map((tag: string, i: number) => (
                <span key={i} className="glass-badge">{tag}</span>
              ))}
            </div>

            {project.description && (
              <div className="influencer-bio-row">
                {project.description}
              </div>
            )}
          </div>

          {/* Action Row: Button */}
          <div className="influencer-action-row">
            <button className="influencer-continue-btn" onClick={(e) => {
              e.stopPropagation();
              onClick(project);
            }}>
              Voir le projet <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;