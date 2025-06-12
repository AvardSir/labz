"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(null)
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Недействительная ссылка для сброса пароля")
      return
    }

    // Проверяем валидность токена
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/ValidateResetToken?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
          setError(data.message || "Недействительный токен")
        }
      } catch (err) {
        setTokenValid(false)
        setError("Ошибка проверки токена")
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/ResetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          setError("Недействительный или истекший токен")
        } else {
          setError("Ошибка сервера")
        }
        return
      }

      setSuccess("Пароль успешно изменен! Перенаправление на главную страницу...")
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      console.error("Ошибка сброса пароля:", err)
      setError("Ошибка связи с сервером")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Проверка токена...</p>
      </div>
    )
  }

  if (!token || tokenValid === false) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Ошибка</h2>
        <p>{error || "Недействительная ссылка для сброса пароля"}</p>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
          На главную
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Создание нового пароля</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Сохранение..." : "Сохранить пароль"}
        </button>
      </form>
      {error && <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{error}</p>}
      {success && <p style={{ color: "green", textAlign: "center", marginTop: "15px" }}>{success}</p>}
    </div>
  )
}
