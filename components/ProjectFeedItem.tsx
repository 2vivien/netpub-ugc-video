import React, { useState, useEffect, useRef } from 'react';
import './ProjectFeedItem.css';
import { PortfolioProject } from '../types';
import Comment from './Comment';
import './Comment.css';

interface ProjectFeedItemProps {
  project: PortfolioProject;
  isActive: boolean;
}

const ProjectFeedItem: React.FC<ProjectFeedItemProps> = ({ project, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [likes, setLikes] = useState(project.likes || 0);
  const [showHeart, setShowHeart] = useState(false);
  const [comments, setComments] = useState(project.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentJustSent, setCommentJustSent] = useState(false);

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

  const handleLike = () => {
    setLikes(likes + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const handleCommentIconClick = () => {
    setIsCommenting(true);
    setCommentJustSent(false);
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value);

  const handleCommentSubmit = () => {
    if (newComment.trim() !== '') {
      const newCommentObj = {
        author: 'You',
        text: newComment,
        avatar: 'https://i.pravatar.cc/150?img=3',
        timestamp: 'Just now',
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      setCommentJustSent(true);

      setTimeout(() => {
        setIsCommenting(false);
        setCommentJustSent(false);
      }, 2000); // Revert to icons after 2 seconds
    }
  };

  const renderFooterContent = () => {
    return (
      <>
        {!isCommenting && (
          <div className="engagement-stats">
            <span onClick={handleLike}>
              <div className="icon">❤️</div>
              {likes}
            </span>
            <span onClick={handleCommentIconClick}>
              <div className="icon">💬</div>
              {comments.length}
            </span>
          </div>
        )}
        {!isCommenting && (
          <div className="hashtags-container">
            {project.hashtags?.map((tag: string) => (
              <span key={tag} className="hashtag">#{tag}</span>
            ))}
          </div>
        )}
        <div className="comments-section">
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
        </div>
        {isCommenting && (
          <div className="inline-comment-input">
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChange={handleCommentChange}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              autoFocus
            />
            <button onClick={handleCommentSubmit} className="send-comment-button">➤</button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`project-feed-item ${isActive ? 'is-active' : ''}`} onDoubleClick={handleLike}>
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
        {showHeart && <div className="heart-animation">❤️</div>}
      </div>

      <div className="item-footer">
        {renderFooterContent()}
      </div>
    </div>
  );
};

export default ProjectFeedItem;
