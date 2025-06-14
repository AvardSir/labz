import React from "react";

import { EventTypeTag } from "../foundEvent/EventTypeTag";
import { ShareButtons } from "./ShareButtons";
import { ActionButtons } from "./ActionButtons";


export const EventCard = ({ event, onDelete, navigate, canEdit, setFoundEvents }) => {
  return (
    <li key={event.IdEvent} className="card">
      <h4 className="card-title">{event.Name}</h4>
      <div className="card-content">
        <p>{event.Description}</p>
      </div>

      <div className="card-meta">
        <EventTypeTag
          type={event.ТипМероприятия}
          EventTypeId={event.EventTypeId}
          setFoundEvents={setFoundEvents}
        />
        <span>💰 {event.Стоимость} ₽</span>
        <span>🪑 {event.HowManyFreeSeats} мест</span>
        <span>📅 {new Date(event.Date).toLocaleDateString()}</span>
        <span>{event.Проведено ? "✅ Проведено" : "🕒 Запланировано"}</span>

        <ShareButtons event={event} />
      </div>

      <ActionButtons
        event={event}
        onDelete={onDelete}
        navigate={navigate}
        canEdit={canEdit}
      />
    </li>
  );
};
