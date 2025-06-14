"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Header } from "../../Header"
import { useNavigate } from "react-router-dom"

import styles from "../../css/suggestedAnecdotesAdmin.module.css"

import { AnecdotesList } from "./AnecdotesList"
import { AnecdoteDetails } from "./AnecdoteDetails"
import { Notification } from "./Notification"

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

  useEffect(() => {
    if (!loginData || Number.parseInt(loginData.IdRights) !== 2) {
      navigate("/")
    }
  }, [loginData, navigate])

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

  const handleReviewAnecdote = async (action) => {
    if (!activeAnecdote || !loginData) return

    try {
      setActionInProgress(true)

      const response = await fetch("/api/review-suggested-anecdote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      setSuggestedAnecdotes((prev) =>
        prev.filter((a) => a.IdSuggestedAnecdote !== activeAnecdote.IdSuggestedAnecdote)
      )

      setSuccessMessage(
        action === "approve"
          ? `Анекдот успешно опубликован! ID нового анекдота: ${result.IdAnecdote}`
          : "Анекдот отклонен"
      )

      setActiveAnecdote(null)
      setReviewComment("")

      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      console.error("Ошибка модерации анекдота:", err)
      setError(`Ошибка при ${action === "approve" ? "публикации" : "отклонении"} анекдота`)
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
          <Notification type="success" message={successMessage} />
        )}

        {error && (
          <Notification type="error" message={error} />
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
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
            <p style={{ fontSize: "1.25rem" }}>
              🎉 Все анекдоты проверены! Нет предложенных анекдотов на модерацию.
            </p>
          </div>
        ) : (
          <div
            className={styles.anecdotesContainer}
            style={{
              display: "grid",
              gridTemplateColumns: activeAnecdote ? "1fr 1fr" : "1fr",
              gap: "2rem",
            }}
          >
            <AnecdotesList
              anecdotes={suggestedAnecdotes}
              activeId={activeAnecdote?.IdSuggestedAnecdote}
              onSelect={setActiveAnecdote}
            />
            {activeAnecdote && (
              <AnecdoteDetails
                anecdote={activeAnecdote}
                reviewComment={reviewComment}
                setReviewComment={setReviewComment}
                onApprove={() => handleReviewAnecdote("approve")}
                onReject={() => handleReviewAnecdote("reject")}
                actionInProgress={actionInProgress}
                onCancel={() => setActiveAnecdote(null)}
              />
            )}
          </div>
        )}
      </div>
    </>
  )
}
