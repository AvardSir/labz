import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Импортируем AuthContext
import { AddAnecdote } from "../pages/AddAnecdotePage";
import axios from "axios"; // Импортируем axios

export const FoundAnecdotes = ({ anecdotes }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);

  const handleDelete = async (idAnecdote) => {
    try {
      const response = await axios.delete("/api/delete_anecdote", {
        data: { idAnecdote },
      });
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error);
      alert("Произошла ошибка при удалении анекдота");
    }
  };

  return (
    <div className="found-anecdotes">
      {loginData.IdRights == 2 && (
        <button 
          onClick={() => navigate("/add-anecdote")}
          className="action-btn add-btn"
        >
          ✚ Добавить анекдот
        </button>
      )}

      <h3 className="section-title">Найденные анекдоты</h3>
      
      {anecdotes.length === 0 ? (
        <p className="empty-message">Ничего не найдено</p>
      ) : (
        <ul className="anecdotes-list">
          {anecdotes.map((anecdote) => (
            
            <li key={anecdote.IdAnecdote} className="card">
            
            <div className="card-content">
            
      <p >
        {anecdote.Text.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < anecdote.Text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>

            </div>
            
            <div className="card-meta">
              <span>🏷️ {anecdote.AnecdoteType.trim()}</span>
              <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>
              {/* <span>⭐ {anecdote.Rate}</span> */}
              <span>👤 {anecdote.UserName}</span>
            </div>
              
              <div className="action-buttons">
                <button 
                  onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}
                  
                >
                  💬 Комментарии
                </button>
                
                {loginData.IdRights == 2 && (
                  <>
                    <button 
                      onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)}
                      className="action-btn edit-btn"
                    >
                      ✏️ Изменить
                    </button>
                    <button 
                      onClick={() => handleDelete(anecdote.IdAnecdote)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Удалить
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};