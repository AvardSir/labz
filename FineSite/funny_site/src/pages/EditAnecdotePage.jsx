import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";

export const EditAnecdotePage = () => {
  const { id } = useParams(); // Получение ID анекдота из URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Text: "",
    Rate: "",
    IdTypeAnecdote: "",
  });
  const [anecdoteTypes, setAnecdoteTypes] = useState([]); // Список типов анекдотов
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Загрузка типов анекдотов
  useEffect(() => {
    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке типов анекдотов");
        }
        const result = await response.json();
        setAnecdoteTypes(result);
      } catch (error) {
        console.error(error);
        setError("Не удалось загрузить типы анекдотов");
      }
    };

    fetchAnecdoteTypes();
  }, []);

  // Загрузка данных анекдота
  useEffect(() => {
    const fetchAnecdote = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/anecdotes/${id}`);
        if (!response.ok) {
          throw new Error("Ошибка при загрузке анекдота");
        }
        const data = await response.json();
        setFormData({
          Text: data.Text || "",
          Rate: data.Rate || "",
          IdTypeAnecdote: data.IdTypeAnecdote || "",
        });
      } catch (error) {
        console.error(error);
        setError("Не удалось загрузить анекдот");
      } finally {
        setLoading(false);
      }
    };

    fetchAnecdote();
  }, [id]);

  // Обработчик изменения полей формы
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await fetch("/api/update-anecdote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdAnecdote: id,
          NewText: formData.Text,
          NewRate: parseInt(formData.Rate, 10),
          NewIdTypeAnecdote: parseInt(formData.IdTypeAnecdote, 10),
        }),
      });
      if (!response.ok) {
        throw new Error("Ошибка при обновлении анекдота");
      }
      alert("Анекдот успешно обновлен!");
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Не удалось обновить анекдот");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="edit-anecdote-page">
        <h2>Редактировать анекдот</h2>
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Text">Текст анекдота:</label>
            <textarea
              id="Text"
              name="Text"
              value={formData.Text}
              onChange={handleChange}
              required
            ></textarea>
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

          <button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>
      </div>
    </div>
  );
};
