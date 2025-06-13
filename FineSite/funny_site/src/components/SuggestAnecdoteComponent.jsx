"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import { Header } from "../components/Header"


const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    minHeight: "100vh",
    color: 'black',
    textShadow: 'none', // убираем тень

  },
  form: {
    width: "100%",

    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: "2px solid #e6fffa",
  },
  title: {
    color: "#2d3748",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subtitle: {
    color: "black",
    marginBottom: "2rem",
    textAlign: "center",
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#2d3748",
    fontSize: "0.95rem",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "150px",
    transition: "all 0.2s ease",
    lineHeight: "1.6",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "white",
    transition: "all 0.2s ease",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "2rem",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#38a169",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    minWidth: "140px",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#718096",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    minWidth: "140px",
  },
  errorMessage: {
    color: "#e53e3e",
    margin: "1rem 0",
    textAlign: "center",
    padding: "0.75rem",
    backgroundColor: "#fed7d7",
    borderRadius: "8px",
    border: "1px solid #feb2b2",
  },
  successMessage: {
    color: "#38a169",
    margin: "1rem 0",
    textAlign: "center",
    padding: "0.75rem",
    backgroundColor: "#c6f6d5",
    borderRadius: "8px",
    border: "1px solid #9ae6b4",
  },
  infoBox: {
    backgroundColor: "#ebf8ff",
    border: "1px solid #bee3f8",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
    color: "#2b6cb0",
    fontSize: "0.9rem",
  },
}

export const SuggestAnecdoteComponent = () => {
  const { loginData } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    Text: "",
    IdTypeAnecdote: "",
    Comment: "", // Дополнительный комментарий от пользователя
  })

  const [anecdoteTypes, setAnecdoteTypes] = useState([])
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Проверяем авторизацию
    if (!loginData?.IdUser) {
      navigate("/")
      return
    }

    const fetchAnecdoteTypes = async () => {
      try {
        const response = await fetch("/api/anecdotes/types")
        const result = await response.json()
        setAnecdoteTypes(result)

        if (result.length > 0) {
          setFormData((prev) => ({
            ...prev,
            IdTypeAnecdote: result[0].id,
          }))
        }
      } catch (err) {
        console.error("Ошибка при получении типов анекдотов:", err)
        setError("Не удалось загрузить типы анекдотов")
      }
    }

    fetchAnecdoteTypes()
  }, [loginData, navigate])

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      const response = await fetch("/api/suggest-anecdote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          IdTypeAnecdote: Number(formData.IdTypeAnecdote),
          IdUser: loginData.IdUser,
          Status: "pending", // Статус "на рассмотрении"
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Ошибка при отправке предложения")

      setSuccessMessage("Ваше предложение отправлено на рассмотрение администраторам!")

      // Очищаем форму
      setFormData({
        Text: "",
        IdTypeAnecdote: anecdoteTypes.length > 0 ? anecdoteTypes[0].id : "",
        Comment: "",
      })

      setTimeout(() => navigate("/"), 3000)
    } catch (err) {
      setError(err.message)
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.title}>💡 Предложить анекдот</h2>
          <p style={styles.subtitle}>
            Поделитесь своим анекдотом с сообществом! Ваше предложение будет рассмотрено администраторами и при
            одобрении добавлено на сайт.
          </p>


          {error && <div style={styles.errorMessage}>❌ {error}</div>}
          {successMessage && <div style={styles.successMessage}>✅ {successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="Text" style={styles.label}>
                Текст анекдота: <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <textarea
                id="Text"
                name="Text"
                value={formData.Text}
                onChange={handleChange}
                required
                placeholder="Введите текст вашего анекдота..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="IdTypeAnecdote" style={styles.label}>
                Тип анекдота: <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <select
                id="IdTypeAnecdote"
                name="IdTypeAnecdote"
                value={formData.IdTypeAnecdote}
                onChange={handleChange}
                required
                style={styles.select}
              >
                {anecdoteTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="Comment" style={styles.label}>
                Дополнительный комментарий (необязательно):
              </label>
              <textarea
                id="Comment"
                name="Comment"
                value={formData.Comment}
                onChange={handleChange}
                placeholder="Расскажите что-то интересное об этом анекдоте или оставьте комментарий для администраторов..."
                style={{
                  ...styles.textarea,
                  minHeight: "80px",
                }}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.primaryButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Отправка..." : "💡 Предложить анекдот"}
              </button>

              <button type="button" onClick={() => navigate("/")} style={styles.secondaryButton}>
                ← Назад
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
