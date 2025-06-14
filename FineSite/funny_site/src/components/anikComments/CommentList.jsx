import React, { useState, useEffect } from "react";
import { CommentItem } from "./CommentItem";

const BATCH_SIZE = 10;

export const CommentList = ({ comments: initialComments }) => {
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  useEffect(() => {
    setComments(initialComments);
    setVisibleCount(BATCH_SIZE);
  }, [initialComments]);

  const handleDelete = (deletedId) => {
    setComments(prev =>
      prev.filter(c => c.IdCommentsontheAnecdote !== deletedId)
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setVisibleCount(prev =>
          Math.min(prev + BATCH_SIZE, comments.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [comments]);

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <ul className="comments-list">
      {visibleComments.length > 0 ? (
        visibleComments.map((comment, index) => (
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
