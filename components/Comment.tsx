import React, { useState } from 'react';
import Reply from './Reply';
import './Reply.css';

interface CommentProps {
  comment: {
    author: string;
    text: string;
    avatar: string;
    timestamp: string;
    replies?: any[];
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);

  const handleReplySubmit = () => {
    if (replyText.trim() !== '') {
      const newReply = {
        author: 'You', // Replace with actual user data
        text: replyText,
        avatar: 'https://i.pravatar.cc/150?img=3', // Replace with actual user data
        timestamp: 'Just now',
      };
      setReplies([...replies, newReply]);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  return (
    <div className="comment">
      <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="comment-avatar" />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-timestamp">{comment.timestamp}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
        <button className="reply-button" onClick={() => setShowReplyInput(!showReplyInput)}>
          Reply
        </button>
        {showReplyInput && (
          <div className="reply-input">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={handleReplySubmit}>Send</button>
          </div>
        )}
        {replies && (
          <div className="replies-section">
            {replies.map((reply, index) => (
              <Reply key={index} reply={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
