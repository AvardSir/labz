import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";
import { EventCard } from "./EventCard";
import { Footer } from "../Footer";

const ITEMS_PER_PAGE = 10;

export const FoundEvents = ({ events, fetchEvents, setFoundEvents }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  // Пагинация
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl, events]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(`/api/delete_event/${eventId}`);
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении мероприятия:", error.response?.data || error);
      alert(error.response?.data?.error || "Ошибка при удалении мероприятия");
    }
  };

  return (
    <div className="found-events">
      <button onClick={fetchEvents} className="action-btn">
        Сбросить поиск по типам
      </button>

      {loginData.IdRights == 2 && (
        <button
          onClick={() => navigate(`/add-event`)}
          className="action-btn add-btn"
        >
          ✚ Добавить мероприятие
        </button>
      )}

      <h3>Найденные мероприятия</h3>

      {events.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <>
          <ul>
            {visibleEvents.map((event) => (
              <EventCard
                key={event.IdEvent}
                event={event}
                onDelete={handleDelete}
                navigate={navigate}
                canEdit={loginData.IdRights == 2}
                setFoundEvents={setFoundEvents}
              />
            ))}
          </ul>

          {/* Пагинация */}
          <div className="pagination">
            {currentPage > 1 && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)}>
                ←
              </button>
            )}

            {currentPage > 3 && (
              <>
                <button className="page-btn" onClick={() => handlePageChange(1)}>1</button>
                {currentPage > 4 && <span className="dots">...</span>}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNum => pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              .map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-btn ${pageNum === currentPage ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="dots">...</span>}
                <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            {currentPage < totalPages && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)}>
                →
              </button>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};
