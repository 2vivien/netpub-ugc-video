import React, { useState } from 'react';
import { PortfolioProject } from '../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './ProjectLightbox.css';

interface ProjectLightboxProps {
  projects: PortfolioProject[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ projects, initialIndex, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);

  // Instead of an effect that triggers a second render, we can use a "key" from the parent 
  // or simple state synchronization if initialIndex changes while the modal is OPEN.
  // But usually, initialIndex only changes when the modal is first opened.
  
  if (!isOpen) return null;

  const currentProject = projects[currentIndex];
  const mediaUrl = currentProject.videoUrl || currentProject.mediaUrl;
  const isVideo = currentProject.mediaType === 'video';

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setIsPlaying(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setIsPlaying(true);
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>
        <X size={32} />
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-media-container">
          {isVideo ? (
            <video
              src={mediaUrl}
              className="lightbox-media"
              autoPlay={isPlaying}
              loop
              controls
              playsInline
            />
          ) : (
            <img src={mediaUrl} alt={currentProject.title} className="lightbox-media" />
          )}
        </div>

        <div className="lightbox-info">
          <h3>{currentProject.title}</h3>
          <p>{currentProject.category}</p>
        </div>
      </div>

      <button className="lightbox-nav prev" onClick={handlePrev}>
        <ChevronLeft size={48} />
      </button>
      <button className="lightbox-nav next" onClick={handleNext}>
        <ChevronRight size={48} />
      </button>
    </div>
  );
};

export default ProjectLightbox;
