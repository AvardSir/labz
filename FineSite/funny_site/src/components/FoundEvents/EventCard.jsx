import React, { useEffect, useState } from "react";

import { EventTypeTag } from "../foundEvent/EventTypeTag";
import { ShareButtons } from "./ShareButtons";
import { ActionButtons } from "./ActionButtons";

export const EventCard = ({ event, onDelete, navigate, canEdit, setFoundEvents }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Попробуем получить список файлов из папки /uploads/{IdEvent}
    const loadImages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${event.IdEvent}/images`);
        if (res.ok) {
          const files = await res.json();
          setImages(files); // files = ["photo1.jpg", "photo2.jpg"]
        }
      } catch (err) {
        console.error("Ошибка загрузки картинок:", err);
      }
    };

    loadImages();
  }, [event.IdEvent]);

  return (
    <li key={event.IdEvent} className="card">
      <h4 className="card-title">{event.Name}</h4>

      {/* Плашка с картинками */}
      {images.length > 0 && (
        <div
          className="image-gallery"
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            marginBottom: "10px",
            justifyContent: "center", // Центрирование по горизонтали
          }}
        >          {images.map((fileName, idx) => (
          <img
            key={idx}
            src={`http://localhost:5000/uploads/${event.IdEvent}/${fileName}`}
            alt={`event-img-${idx}`}
            style={{ height: "100px", borderRadius: "8px", objectFit: "cover" }}
          />
        ))}
        </div>
      )}

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
