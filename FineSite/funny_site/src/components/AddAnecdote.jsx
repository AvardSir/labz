import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./context/AuthContext";

export const AddAnecdoteComponent = () => {
  const { loginData } = useContext(AuthContext); // Получаем данные пользователя
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Text: "",
    Rate: 0,
    IdTypeAnecdote: "",
  });
  const [anecdoteTypes, setAnecdoteTypes] = useState([]); // Список типов анекдотов
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Загрузка типов анекдотов при загрузке компонента
  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types"); // URL должен соответствовать рабочему примеру
        const result = await response.json();
        setAnecdoteTypes(result);
  
        // Установка первого типа по умолчанию, если он есть
        if (result.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            IdTypeAnecdote: result[0].id, // Устанавливаем значение первого типа
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            IdTypeAnecdote: "", // Если нет типов, устанавливаем пустое значение
          }));
        }
      } catch (error) {
        console.error("Ошибка при получении типов анекдотов:", error);
        setError("Не удалось загрузить типы анекдотов");
      }
    };
  
    fetchAnecdoteTypes();
  }, []);
  

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Преобразование значений в числа
    const requestData = {
      ...formData,
      Rate: Number(formData.Rate),       // Преобразуем в число
      IdTypeAnecdote: Number(formData.IdTypeAnecdote), // Преобразуем в число
      IdUser: loginData.login,
    };
    console.log("Form data being sent:", loginData);

    try {
      const response = await fetch("/api/add-anecdote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Не удалось добавить анекдот");
      }
  
      setSuccessMessage("Анекдот успешно добавлен!");
      setError(null);
  
      // Через 2 секунды перенаправляем обратно
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message);
      setSuccessMessage(null);
    }
  };
  
  

  return (
    <div className="add-anecdote">
      <h2>Добавить анекдот</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Text">Текст анекдота:</label>
          <textarea
            id="Text"
            name="Text"
            value={formData.Text}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="Rate">Рейтинг:</label>
          <input
            type="number"
            id="Rate"
            name="Rate"
            value={formData.Rate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="IdTypeAnecdote">Тип анекдота:</label>
          <select
            id="IdTypeAnecdote"
            name="IdTypeAnecdote"
            value={formData.IdTypeAnecdote}
            onChange={handleChange}
            required
          >
            {anecdoteTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};
