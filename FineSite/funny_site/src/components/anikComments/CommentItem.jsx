import React from "react";

export const CommentItem = ({ comment }) => {
  return (
    <li className="comment-item">
      <div className="comment-bubble">
        <p className="comment-text">{comment.Text}</p>
      </div>
      <div className="comment-meta">
        <div className="comment-author">
          <strong className="author-name">{comment.AuthorName}</strong>
        </div>
        <time 
          dateTime={new Date(comment.Date).toISOString()}
          className="comment-date"
        >
          {new Date(comment.Date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </time>
      </div>
    </li>
  );
};