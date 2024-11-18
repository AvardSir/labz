// AnecdoteSearch.jsx
import React, { useState, useEffect } from "react";

export const AnecdoteSearch = ({ searchData, setSearchData, setFoundAnecdotes, handleSearchAnecdotes }) => {
  const [anecdoteTypes, setAnecdoteTypes] = useState([]);

  // Получение типов анекдотов при загрузке компонента
  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types");
        const result = await response.json();
        setAnecdoteTypes(result); // Сохраняем типы анекдотов
        if (result.length > 0) {
            setSearchData((prevData) => ({ ...prevData, anecdote: result[0].id }));
          }
      } catch (error) {
        console.error("Ошибка при получении типов анекдотов:", error);
      }
    };

    fetchAnecdoteTypes();
  }, []);

  const handleSearchChange = ({ target: { name, value } }) => {
    setSearchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSearchButtonClick = async () => {
    const { anecdote } = searchData;
    try {
      const response = await fetch(
        `/api/anecdotes/by-type?idTypeAnecdote=${encodeURIComponent(anecdote)}`
      );
      const result = await response.json();
      setFoundAnecdotes(Array.isArray(result) ? result : []);
      handleSearchAnecdotes(); // Вызываем handleSearchAnecdotes у родителя
    } catch (error) {
      console.error("Ошибка при поиске анекдотов:", error);
      setFoundAnecdotes([]);
    }
  };

  return (
    <div className="search-box">
      <h3>По типу анекдота</h3>
      <select
        name="anecdote"
        value={searchData.anecdote}
        onChange={handleSearchChange}
      >
        {anecdoteTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <button onClick={handleSearchButtonClick}>Поиск анекдотов</button>
    </div>
  );
};
