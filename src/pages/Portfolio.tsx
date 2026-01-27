import React, { useState } from 'react';
import { portfolioProjects } from '../constants';
import { PortfolioCategory, PortfolioProject } from '../types';
import MasonryGrid from '../components/MasonryGrid';
import ProjectLightbox from '../components/ProjectLightbox';
import TestimonialCarousel from '../components/TestimonialCarousel';
import CallToAction from '../components/CallToAction';
import SEO from '../components/SEO';



const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory | 'All'>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialProjectIndex, setInitialProjectIndex] = useState(0);

  const categories = ['All', ...Object.values(PortfolioCategory)];

  const influencers = portfolioProjects.filter(p => p.category === PortfolioCategory.INFLUENCEUSES);
  const otherCategories = Object.values(PortfolioCategory).filter(cat => cat !== PortfolioCategory.INFLUENCEUSES);

  const categoryGroups = otherCategories.map((cat, index) => {
    const projectsInCat = portfolioProjects.filter(p => p.category === cat);
    if (projectsInCat.length === 0) return null;

    const allMedia = projectsInCat.flatMap(p => p.mediaItems || [{ url: p.mediaUrl, type: p.mediaType }]);

    return {
      id: -(index + 1),
      title: cat,
      category: cat,
      mediaUrl: allMedia[0]?.url || '',
      mediaType: allMedia[0]?.type || 'image',
      mediaItems: allMedia,
      tags: [cat],
      description: `Découvrez nos réalisations en ${cat}.`
    } as PortfolioProject;
  }).filter((p): p is PortfolioProject => p !== null);

  let groupedProjects: PortfolioProject[] = [];
  if (selectedCategory === 'All') groupedProjects = [...categoryGroups, ...influencers];
  else if (selectedCategory === PortfolioCategory.INFLUENCEUSES) groupedProjects = influencers;
  else groupedProjects = categoryGroups.filter(p => p.category === selectedCategory);

  const handleCardClick = (project: PortfolioProject) => {
    const projectIndex = groupedProjects.findIndex(p => p.id === project.id);
    setInitialProjectIndex(projectIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="page-container portfolio-page">
      <SEO
        title="Portfolio - Nos Réalisations de Vidéos UGC & Publicitaires"
        description="Explorez les réalisations de NetPub. Découvrez notre portfolio de vidéos UGC, de spots publicitaires créatifs et de contenu de marque qui captivent et convertissent."
        keywords="portfolio, réalisations, vidéos UGC, spots publicitaires, contenu de marque, études de cas, netpub"
      />
      <header className="article-header text-center">
        <p className="article-meta">Notre travail</p>
        <h1>Découvrez nos réalisations</h1>
      </header>

      <div className="portfolio-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category as PortfolioCategory | 'All')}
          >
            {category === 'All' ? 'Tous les projets' : category}
          </button>
        ))}
      </div>

      <MasonryGrid projects={groupedProjects} onProjectClick={handleCardClick} />
      
      <ProjectLightbox 
        key={initialProjectIndex}
        projects={groupedProjects} 
        initialIndex={initialProjectIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
      />

      <TestimonialCarousel />
      <CallToAction />
    </div>
  );
};

export default Portfolio;