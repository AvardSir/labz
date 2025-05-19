import React from "react";
import { CommentItem } from "./CommentItem";

export const CommentList = ({ comments }) => {
  return (
    <ul className="comments-list">
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
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