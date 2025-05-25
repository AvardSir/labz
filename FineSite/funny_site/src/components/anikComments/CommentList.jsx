import React, { useState, useEffect } from "react";
import { CommentItem } from "./CommentItem";

export const CommentList = ({ comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleDelete = (deletedId) => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.IdCommentsontheAnecdote !== deletedId)
    );
  };

  return (
    <ul className="comments-list">
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <CommentItem
            key={comment.IdCommentsontheAnecdote || index}
            comment={comment}
            onDelete={handleDelete}
          />

        ))
      ) : (
        <div className="no-comments">
          <i className="icon-comment"></i>
          <p>Пока нет комментариев</p>
        </div>
      )}
    </ul>
  );
};
