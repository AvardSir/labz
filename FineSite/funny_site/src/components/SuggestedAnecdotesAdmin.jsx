"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { Header } from "./Header"
import { useNavigate } from "react-router-dom"

// Правильный импорт CSS модуля
import styles from "../css/suggestedAnecdotesAdmin.module.css";

export const SuggestedAnecdotesAdmin = () => {
  const { loginData } = useContext(AuthContext)
  const navigate = useNavigate()

  const [suggestedAnecdotes, setSuggestedAnecdotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeAnecdote, setActiveAnecdote] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [actionInProgress, setActionInProgress] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // Проверка прав администратора
  useEffect(() => {
    if (!loginData || Number.parseInt(loginData.IdRights) !== 2) {
      navigate("/")
    }
  }, [loginData, navigate])

  // Загрузка предложенных анекдотов
  useEffect(() => {
    const fetchSuggestedAnecdotes = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/suggested-anecdotes?status=pending")

        if (!response.ok) {
          throw new Error("Ошибка загрузки предложенных анекдотов")
        }

        const data = await response.json()
        setSuggestedAnecdotes(data)
      } catch (err) {
        console.error("Ошибка при загрузке анекдотов:", err)
        setError("Произошла ошибка при загрузке предложенных анекдотов")
      } finally {
        setLoading(false)
      }
    }

    if (loginData && Number.parseInt(loginData.IdRights) === 2) {
      fetchSuggestedAnecdotes()
    }
  }, [loginData])

  // Функция для модерации анекдота
  const handleReviewAnecdote = async (action) => {
    if (!activeAnecdote || !loginData) return

    try {
      setActionInProgress(true)

      const response = await fetch("/api/review-suggested-anecdote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdSuggestedAnecdote: activeAnecdote.IdSuggestedAnecdote,
          action,
          reviewComment: reviewComment.trim() || null,
          reviewerId: loginData.IdUser,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка модерации анекдота")
      }

      const result = await response.json()

      // Удаляем анекдот из списка и показываем сообщение об успехе
      setSuggestedAnecdotes((prev) => prev.filter((a) => a.IdSuggestedAnecdote !== activeAnecdote.IdSuggestedAnecdote))

      setSuccessMessage(
        action === "approve"
          ? `Анекдот успешно опубликован! ID нового анекдота: ${result.IdAnecdote}`
          : "Анекдот отклонен",
      )

      // Сбрасываем состояние
      setActiveAnecdote(null)
      setReviewComment("")

      // Скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      console.error("Ошибка модерации анекдота:", err)
      setError(`Ошибка при ${action === "approve" ? "публикации" : "отклонении"} анекдота`)

      // Скрываем сообщение об ошибке через 5 секунд
      setTimeout(() => setError(null), 5000)
    } finally {
      setActionInProgress(false)
    }
  }

  return (
    <>
      <Header />

      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "1rem" }}>Модерация предложенных анекдотов</h1>

        {successMessage && (
          <div
            className={styles.notification}
            style={{
              padding: "1rem",
              backgroundColor: "#c6f6d5",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              color: "#2f855a",
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {error && (
          <div
            className={styles.notification}
            style={{
              padding: "1rem",
              backgroundColor: "#fed7d7",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              color: "#c53030",
            }}
          >
            ❌ {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <p>Загрузка предложенных анекдотов...</p>
          </div>
        ) : suggestedAnecdotes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              backgroundColor: "#f7fafc",
              borderRadius: "0.5rem",
            }}
          >
            <p style={{ fontSize: "1.25rem" }}>🎉 Все анекдоты проверены! Нет предложенных анекдотов на модерацию.</p>
          </div>
        ) : (
          <div>
            <p
              style={{
                marginBottom: "1rem",
                color: "white",
              }}
            >
              Найдено {suggestedAnecdotes.length} предложенных анекдотов на модерацию
            </p>

            <div
              className={styles.anecdotesContainer}
              style={{
                display: "grid",
                gridTemplateColumns: activeAnecdote ? "1fr 1fr" : "1fr",
                gap: "2rem",
              }}
            >
              <div
                className={styles.anecdotesList}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                {suggestedAnecdotes.map((anecdote) => (
                  <div
                    key={anecdote.IdSuggestedAnecdote}
                    className={`${styles.anecdoteItem} ${activeAnecdote?.IdSuggestedAnecdote === anecdote.IdSuggestedAnecdote ? styles.active : ""}`}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid #e2e8f0",
                      cursor: "pointer",
                      backgroundColor:
                        activeAnecdote?.IdSuggestedAnecdote === anecdote.IdSuggestedAnecdote ? "#ebf8ff" : "white",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => setActiveAnecdote(anecdote)}
                  >
                    <div style={{ fontSize: "0.875rem", color: "#4a5568", marginBottom: "0.5rem" }}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#2b6cb0",
                          marginRight: "0.5rem",
                        }}
                      >
                        {anecdote.AnecdoteType}
                      </span>
                      <span>👤 {anecdote.UserName}</span>
                      <span style={{ marginLeft: "0.5rem" }}>
                        📅 {new Date(anecdote.DateSuggested).toLocaleDateString()}
                      </span>
                    </div>

                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {anecdote.Text.substring(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>

              {activeAnecdote && (
                <div
                  className={styles.anecdoteDetails}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <h2 style={{ marginBottom: "1rem" }}>Просмотр анекдота</h2>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ marginBottom: "0.5rem", color: "#4a5568", fontSize: "0.875rem" }}>
                      <strong>Категория:</strong> {activeAnecdote.AnecdoteType}
                    </div>
                    <div style={{ marginBottom: "0.5rem", color: "#4a5568", fontSize: "0.875rem" }}>
                      <strong>Автор:</strong> {activeAnecdote.UserName}
                    </div>
                    <div style={{ marginBottom: "0.5rem", color: "#4a5568", fontSize: "0.875rem" }}>
                      <strong>Дата предложения:</strong> {new Date(activeAnecdote.DateSuggested).toLocaleDateString()}{" "}
                      {new Date(activeAnecdote.DateSuggested).toLocaleTimeString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f7fafc",
                      borderRadius: "0.5rem",
                      marginBottom: "1.5rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {activeAnecdote.Text}
                  </div>

                  {activeAnecdote.Comment && (
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "#fffaf0",
                        borderRadius: "0.5rem",
                        marginBottom: "1.5rem",
                        border: "1px solid #feebc8",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "0.5rem" }}>Комментарий пользователя:</strong>
                      {activeAnecdote.Comment}
                    </div>
                  )}

                  

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => handleReviewAnecdote("approve")}
                      disabled={actionInProgress}
                      className={styles.btnApprove}
                      style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        backgroundColor: "#38a169",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: actionInProgress ? "not-allowed" : "pointer",
                        opacity: actionInProgress ? 0.7 : 1,
                        transition: "all 0.2s",
                        fontWeight: 600,
                      }}
                    >
                      ✅ Опубликовать анекдот
                    </button>

                    <button
                      onClick={() => handleReviewAnecdote("reject")}
                      disabled={actionInProgress}
                      className={styles.btnReject}
                      style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        backgroundColor: "#e53e3e",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: actionInProgress ? "not-allowed" : "pointer",
                        opacity: actionInProgress ? 0.7 : 1,
                        transition: "all 0.2s",
                        fontWeight: 600,
                      }}
                    >
                      ❌ Отклонить
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveAnecdote(null)}
                    className={styles.cancelButton}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      marginTop: "1rem",
                      padding: "0.5rem",
                      backgroundColor: "transparent",
                      color: "#718096",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      color: 'white'
                    }}
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}