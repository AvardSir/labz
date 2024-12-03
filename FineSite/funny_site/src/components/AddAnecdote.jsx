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

  // Загрузка типов анекдотов
  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
        try {
            console.log("Запрос типов анекдотов..."); // Добавить лог
            const response = await fetch("http://localhost:5000/anecdote-types");
            console.log("Ответ сервера:", response); // Проверка ответа
            const types = await response.json();
            console.log("Типы анекдотов:", types); // Проверка данных
            setAnecdoteTypes(types);
        } catch (err) {
            console.error("Ошибка загрузки типов анекдотов:", err);
            setError("Не удалось загрузить типы анекдотов");
        }
    };


    fetchAnecdoteTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Добавляем IdUser из контекста
    const requestData = { ...formData, IdUser: loginData.IdUser };

    try {
      const response = await fetch("http://localhost:5000/add-anecdote", {
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
            <option value="">Выберите тип</option>
            {anecdoteTypes.map((type) => (
              <option key={type.IdTypeAnecdote} value={type.IdTypeAnecdote}>
                {type.TypeAnecdote}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};
