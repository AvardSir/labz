import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Импортируем AuthContext
import { AddAnecdote } from "../pages/AddAnecdotePage";
import axios from "axios"; // Импортируем axios

export const FoundAnecdotes = ({ anecdotes }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext); // Достаем loginData из контекста

  const handleDelete = async (idAnecdote) => {
    try {
      // Отправляем DELETE запрос на сервер
      const response = await axios.delete("/api/delete_anecdote", {
        data: { idAnecdote }, // Передаем ID анекдота в теле запроса
      });
      
      // Если удаление прошло успешно, показываем сообщение
      alert(response.data.message);
      
      // Здесь вы можете обновить список анекдотов, чтобы отобразить актуальные данные
      // Например, вызвать функцию для обновления списка анекдотов
      window.location.reload();

    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error);
      alert("Произошла ошибка при удалении анекдота");
    }
  };


  return (
    <div className="found-anecdotes">
      {/* Условие отображения кнопки */}
      {loginData.IdRights !== 1 && (
        <button onClick={() => navigate("/add-anecdote")}>Добавить анекдот</button>
      )}

      <h3>Найденные анекдоты</h3>
      {anecdotes.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <ul>
          {anecdotes.map((anecdote) => (
            <li key={anecdote.IdAnecdote} className="anecdote-item">
              <p><strong>Текст:</strong> {anecdote.Text}</p>
              <p><strong>Дата:</strong> {new Date(anecdote.Date).toLocaleDateString()}</p>
              <p><strong>Рейтинг:</strong> {anecdote.Rate}</p>
              <p><strong>Автор:</strong> {anecdote.UserName}</p>
              <p><strong>Тип:</strong> {anecdote.AnecdoteType.trim()}</p>
              <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>
                Перейти к комментариям
              </button>
              {/* Условие отображения кнопки "Изменить" */}
              {loginData.IdRights !== 1 && (
                <button onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)}>
                  Изменить
                </button>
              )}
              {/* Условие отображения кнопки "Удалить" */}
              {loginData.IdRights !== 1 && (
                <button onClick={() => handleDelete(anecdote.IdAnecdote)}>
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
