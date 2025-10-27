import React from 'react';
import AnimatedHero from '../components/AnimatedHero'; // Re-added
import ClientMarquee from '../components/ClientMarquee';
import ObliqueMasonryScroller from '../components/ObliqueMasonryScroller';
import { portfolioProjects, featuredProjectIds } from '../constants';
import { PortfolioProject } from '../types';
import TestimonialCarousel from '../components/TestimonialCarousel';
import StatsSection from '../components/StatsSection';
import CallToAction from '../components/CallToAction';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const handleProjectClick = (project: PortfolioProject) => {
        console.log('Project clicked:', project);
    };

    const featuredProjects = portfolioProjects
        .filter(p => featuredProjectIds.includes(p.id))
        .sort((a, b) => featuredProjectIds.indexOf(a.id) - featuredProjectIds.indexOf(b.id));

    return (
        <div className="page-container home-page">
            <AnimatedHero /> {/* Re-added */}
            <ClientMarquee />
                        <div className="oblique-masonry-header">
              <h2>Un aperçu de notre travail</h2>
              <p>Plongez dans un univers de créativité et découvrez comment nous donnons vie aux marques.</p>
              <Link to="/portfolio" className="cta-button-secondary">Voir tout le portfolio</Link>
            </div>
            <ObliqueMasonryScroller projects={featuredProjects.slice(0, 8)} onProjectClick={handleProjectClick} aspectRatio="9:16" />
            <StatsSection />
            <TestimonialCarousel />
            <CallToAction />
        </div>
    );
};

export default Home;
