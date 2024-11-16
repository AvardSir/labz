import React, { useState, useEffect } from "react";
import axios from "axios";

const AnecdotesByType = () => {
  const [types, setTypes] = useState([]); // Список типов анекдотов
  const [selectedType, setSelectedType] = useState(""); // Выбранный тип
  const [anecdotes, setAnecdotes] = useState([]); // Анекдоты

  // Получение списка типов анекдотов
  useEffect(() => {
    axios
      .get("/api/getAnecdoteTypes") // Ваш API для получения типов
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении типов анекдотов:", error);
      });
  }, []);

  // Обработчик выбора типа
  const handleTypeChange = (event) => {
    const typeId = event.target.value;
    setSelectedType(typeId);

    // Получение анекдотов по типу
    axios
      .get(`/api/getAnecdotesByType?idTypeAnecdote=${typeId}`)
      .then((response) => {
        setAnecdotes(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении анекдотов:", error);
      });
  };

  return (
    <div>
      <h3>Выберите тип анекдота:</h3>
      <select value={selectedType} onChange={handleTypeChange}>
        <option value="">-- Выберите --</option>
        {types.map((type) => (
          <option key={type.IdTypeAnecdote} value={type.IdTypeAnecdote}>
            {type.TypeAnecdote}
          </option>
        ))}
      </select>

      <div className="anecdotes">
        <h3>Результаты:</h3>
        {anecdotes.length > 0 ? (
          anecdotes.map((anecdote) => (
            <div key={anecdote.IdAnecdote} className="anecdote">
              <p>{anecdote.Text}</p>
              <p>
                Рейтинг: {anecdote.Rate} | Автор: {anecdote.UserName}
              </p>
            </div>
          ))
        ) : (
          <p>Нет анекдотов для выбранного типа.</p>
        )}
      </div>
    </div>
  );
};

export default AnecdotesByType;
