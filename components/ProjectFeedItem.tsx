import React, { useState, useEffect, useRef } from 'react';
import './ProjectFeedItem.css';
import { PortfolioProject, Like } from '../types';
import CommentThread from './CommentThread';

import { fetchCsrfToken } from '../utils/csrf';

const GRAPHQL_ENDPOINT = '/graphql';

interface ProjectFeedItemProps {
  project: PortfolioProject;
  isActive: boolean;
}

const ProjectFeedItem: React.FC<ProjectFeedItemProps> = ({ project, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [likes, setLikes] = useState<Like[]>(project.likes || []);
  const [userId, setUserId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem('viewerId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('viewerId', id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => {
          console.log('Autoplay prevented: ' + error);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const handleLike = async () => {
    if (!userId) return;

    const existingLike = Array.isArray(likes) ? likes.find(like => like.anonymousId === userId) : undefined;

    if (existingLike) {
      // Optimistically remove the like
      setLikes(Array.isArray(likes) ? likes.filter(like => like.anonymousId !== userId) : []);
      try {
        const csrf = await fetchCsrfToken();
        if (!csrf) {
          throw new Error('CSRF token not available');
        }

        await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
          body: JSON.stringify({
            query: `
              mutation RemoveLike($projectId: ID!, $anonymousId: String!) {
                removeLike(projectId: $projectId, anonymousId: $anonymousId)
              }
            `,
            variables: { projectId: project.id, anonymousId: userId },
          }),
        });
      } catch (error) {
        setLikes(likes); // Revert on error
      }
    } else {
      // Optimistically add the like
      const newLike = { id: Date.now().toString(), anonymousId: userId };
      setLikes(Array.isArray(likes) ? [...likes, newLike] : [newLike]);
      try {
        const csrf = await fetchCsrfToken();
        if (!csrf) {
          throw new Error('CSRF token not available');
        }

        await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
          body: JSON.stringify({
            query: `
              mutation AddLike($projectId: ID!, $anonymousId: String) {
                addLike(projectId: $projectId, anonymousId: $anonymousId) {
                  id
                  anonymousId
                }
              }
            `,
            variables: { projectId: project.id, anonymousId: userId },
          }),
        });
      } catch (error) {
        console.error('Error adding like:', error);
        setLikes(likes); // Revert on error
      }
    }
  };

  const renderFooterContent = () => {
    const isLikedByViewer = Array.isArray(likes) && likes.some(like => like.anonymousId === userId);

    const HeartIcon = ({ filled }: { filled: boolean }) => (
      <svg fill={filled ? '#ff3040' : 'white'} stroke="black" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    );

    const CommentIcon = () => (
      <svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
      </svg>
    );

    return (
      <>
        <div className="item-actions">
          <button onClick={handleLike} className="action-button like-button">
            <HeartIcon filled={isLikedByViewer} />
          </button>
          <span className="likes-count">{Array.isArray(likes) ? likes.length : 0}</span>
          <button onClick={() => setShowComments(!showComments)} className="action-button comment-button">
            <CommentIcon />
          </button>
        </div>
        <div className="hashtags-container">
          {project.hashtags?.map((tag: string) => (
            <span key={tag} className="hashtag">#{tag}</span>
          ))}
        </div>
        {showComments && <CommentThread project={project} />}
      </>
    );
  }

  return (
    <div className={`project-feed-item ${isActive ? 'is-active' : ''}`}>
      <div className="media-container">
        {project.mediaType === 'video' ? (
          <video 
            ref={videoRef} 
            key={project.id} 
            src={project.mediaUrl} 
            loop 
            playsInline 
          />
        ) : (
          <img key={project.id} src={project.mediaUrl} alt={project.title} />
        )}
      </div>

      <div className="item-footer">
        {renderFooterContent()}
      </div>
    </div>
  );
};

export default ProjectFeedItem;
