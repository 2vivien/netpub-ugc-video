import React, { useState, useEffect, useRef } from 'react';
import ProjectFeedItem from './ProjectFeedItem';
import { PortfolioProject } from '../types';
import './ProjectFeed.css';

interface ProjectFeedProps {
  projects: PortfolioProject[];
  initialProjectIndex: number;
  onClose: () => void;
}

const ProjectFeed: React.FC<ProjectFeedProps> = ({ projects, initialProjectIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(initialProjectIndex);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Scroll to the initially selected project without smooth scrolling
    const initialElement = itemRefs.current.get(initialProjectIndex);
    if (initialElement) {
      initialElement.scrollIntoView({ behavior: 'auto' });
    }

    // Set up the Intersection Observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.7 } // 70% of the item must be visible
    );

    const currentObserver = observer.current;
    itemRefs.current.forEach((ref) => {
      currentObserver.observe(ref);
    });

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [projects, initialProjectIndex]);

  const setRef = (index: number, node: HTMLDivElement | null) => {
    if (node) {
      itemRefs.current.set(index, node);
    } else {
      itemRefs.current.delete(index);
    }
  };

  return (
    <div className="project-feed-container">
      <button className="close-feed-button" onClick={onClose}>×</button>
      {projects.map((project, index) => (
        <div 
          key={project.id} 
          ref={(node) => setRef(index, node)}
          data-index={index}
        >
          <ProjectFeedItem project={project} isActive={index === activeIndex} />
        </div>
      ))}
    </div>
  );
};

export default ProjectFeed;