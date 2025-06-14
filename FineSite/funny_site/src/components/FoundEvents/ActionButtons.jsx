import React from "react";
import { SignUpButton } from "../SignUpButton";

export const ActionButtons = ({ event, onDelete, navigate, canEdit }) => {
  return (
    <div className="action-buttons">
      <button
        onClick={() => navigate(`/event-comments/${event.IdEvent}`)}
        className="action-btn"
      >
        💬 Комментарии
      </button>

      <SignUpButton
        eventId={event.IdEvent}
        className="action-btn signup-btn"
      />

      {canEdit && (
        <>
          <button
            onClick={() => navigate(`/edit-event/${event.IdEvent}`)}
            className="action-btn edit-btn"
          >
            ✏️ Изменить
          </button>
          <button
            onClick={() => onDelete(event.IdEvent)}
            className="action-btn delete-btn"
          >
            🗑️ Удалить
          </button>
        </>
      )}
    </div>
  );
};
