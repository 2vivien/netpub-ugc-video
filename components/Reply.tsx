import React from 'react';

interface ReplyProps {
  reply: any;
}

const Reply: React.FC<ReplyProps> = ({ reply }) => {
  return (
    <div className="reply">
      <p>{reply.author}: {reply.text}</p>
    </div>
  );
};

export default Reply;
