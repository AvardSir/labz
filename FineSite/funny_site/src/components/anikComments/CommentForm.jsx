import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const CommentForm = ({ 
  newComment, 
  setNewComment, 
  handleAddComment,
  showBackButton = true 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="comment-container">
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Добавить комментарий"
        className="comment-input"
      />
      <button onClick={handleAddComment} className="comment-button">
        Добавить
      </button>
      {showBackButton && (
        <button onClick={() => navigate('/')} className="back-button">
          Назад
        </button>
      )}
    </div>
  );
};