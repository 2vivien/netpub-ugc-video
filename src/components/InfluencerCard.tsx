import React, { useState, useRef, useEffect } from 'react';
import { PortfolioProject } from '../types';
import { useChatbot } from '../contexts/ChatbotContext';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import './InfluencerCard.css';

interface InfluencerCardProps {
    project: PortfolioProject;
    onMediaClick?: () => void;
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({ project, onMediaClick }) => {
    const { openChatbot } = useChatbot();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const mediaItems = project.mediaItems || [{ url: project.mediaUrl, type: project.mediaType }];
    const currentMedia = mediaItems[activeIndex];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % mediaItems.length);
        setIsPlaying(true);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
        setIsPlaying(true);
    };

    // Reset when scrolling out of view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setIsFocused(false);
                    setIsPlaying(false); // Stop the video
                    setIsMuted(true); // Reset to muted
                    if (videoRef.current) {
                         videoRef.current.muted = true;
                    }
                }
            },
            { threshold: 0.5 } // Trigger when 50% is out of view
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    // Handle video playback
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(() => setIsPlaying(false));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Get up to 3 items for the carousel circles
    // If we have less than 3, we repeat or center them
    const getCarouselItems = () => {
        if (mediaItems.length === 0) return [];
        if (mediaItems.length === 1) return [{ item: mediaItems[0], index: 0 }];

        // Logic to show 3 circles: [prev, current, next]
        const prev = (activeIndex - 1 + mediaItems.length) % mediaItems.length;
        const next = (activeIndex + 1) % mediaItems.length;

        return [
            { item: mediaItems[prev], index: prev },
            { item: mediaItems[activeIndex], index: activeIndex },
            { item: mediaItems[next], index: next }
        ];
    };

    const carouselCircles = getCarouselItems();

    const handleMediaChange = (index: number) => {
        setActiveIndex(index);
        setIsPlaying(true);
        setIsMuted(true);
        setIsFocused(true); // Auto-focus when selecting
    };

    const handleMainMediaClick = (e: React.MouseEvent) => {
        if (isFocused) {
            e.stopPropagation();
            if (onMediaClick) {
                onMediaClick();
            }
        } else {
             // If not focused, first click focuses it (existing behavior is managed by CSS hover usually, but here we set focus)
             setIsFocused(true);
        }
    };

    const renderMedia = (media: any, isMain: boolean) => {
        if (media.type === 'video') {
            return (
                <video
                    ref={isMain ? videoRef : null}
                    src={media.url}
                    className={isMain ? "influencer-main-photo" : ""}
                    autoPlay={isMain && isPlaying}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="none" // Lazy load video content
                    key={media.url}
                />
            );
        }
        return (
            <img
                src={media.url}
                alt={project.title}
                className={isMain ? "influencer-main-photo" : ""}
                loading="lazy" // Native lazy loading
                key={media.url}
            />
        );
    };

    return (
        <div className="influencer-card" ref={cardRef} onClick={() => !isFocused && setIsFocused(true)}>
            {/* Corner Labels */}
            <div className={`card-label top-right ${isFocused ? 'hidden' : ''}`}>{project.category}</div>

            {/* Main Media Background */}
            <div className="influencer-main-media" onClick={handleMainMediaClick}>
                {renderMedia(currentMedia, true)}
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

                {mediaItems.length > 1 && (
                    <>
                        <button className="nav-arrow-btn prev" onClick={handlePrev}>
                            <ChevronLeft size={32} />
                        </button>
                        <button className="nav-arrow-btn next" onClick={handleNext}>
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}

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

            {/* Content Wrapper for Hiding/Showing */}
            <div className={`influencer-overlay-wrapper ${isFocused ? 'hidden' : ''}`}>
                {/* Fog/Blur Overlay at bottom */}
                <div className="influencer-fog-overlay"></div>

                {/* Content Overlay */}
                <div className="influencer-content-overlay">
                    {/* Carousel circles */}
                    <div className="influencer-carousel-nav">
                        {carouselCircles.map((circle, idx) => (
                            <div
                                key={`${circle.index}-${idx}`}
                                className={`carousel-circle ${circle.index === activeIndex ? 'active' : ''}`}
                                onClick={(e) => {
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

                    {/* Carousel Dots Indicator */}
                    {mediaItems.length > 1 && (
                        <div className="carousel-dots">
                            {mediaItems.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMediaChange(idx);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Bottom Information Container */}
                    <div className="influencer-bottom-info">
                        <div className="influencer-name-age">
                            {project.category === 'Influenceuses'
                                ? `${project.title}, ${project.age || 25}`
                                : project.title
                            }
                        </div>

                        <div className="influencer-badges-row">
                            {(project.hashtags || project.tags)?.slice(0, 3).map((tag: string, i: number) => (
                                <span key={i} className="glass-badge">{tag}</span>
                            ))}
                        </div>

                        <div className="influencer-bio-row">
                            {project.description || project.bio || "Découvrez nos réalisations."}
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="influencer-action-row">
                        <button
                            className="influencer-continue-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                openChatbot();
                            }}
                        >
                            Collaborer <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerCard;
