"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "./context/AuthContext"
import { useNavigate, Link } from "react-router-dom"

export const DropdownLogin = () => {
  const { isLoggedIn, login, logout, loginData } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [credentials, setCredentials] = useState({ login: "", password: "" })
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Сбрасываем dropdown при смене isLoggedIn (логин/логаут)
  useEffect(() => {
    setIsOpen(false)
    setError("")
    setCredentials({ login: "", password: "" })
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
    setForgotPasswordMessage("")
  }, [isLoggedIn])

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
    setError("")
    setShowForgotPassword(false)
    setForgotPasswordMessage("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/GetUserDetailsByNameAndPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Неверный логин или пароль")
        } else {
          setError("Ошибка сервера")
        }
        return
      }

      const user = await response.json()
      login(credentials.login, credentials.password, user.IdRights)
      navigate("/")
      setIsOpen(false)
    } catch (err) {
      console.error("Ошибка авторизации:", err)
      setError("Ошибка связи с сервером")
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setForgotPasswordMessage("")
    setError("")

    try {
      const response = await fetch("/api/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("Пользователь с таким email не найден")
        } else {
          setError("Ошибка сервера")
        }
        return
      }

      setForgotPasswordMessage("Инструкции по восстановлению пароля отправлены на ваш email")
      setForgotPasswordEmail("")
    } catch (err) {
      console.error("Ошибка восстановления пароля:", err)
      setError("Ошибка связи с сервером")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsOpen(false)
  }

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword)
    setError("")
    setForgotPasswordMessage("")
    setForgotPasswordEmail("")
  }

  return (
    <div className="dropdown-login dropdown-container">
      {isLoggedIn ? (
        <>
          <button onClick={toggleDropdown} className="dropdown-toggle">
            {loginData.login} ▼
          </button>
          {isOpen && (
            <div className="dropdown-menu">
              <Link to="/personal_cabinet" onClick={() => setIsOpen(false)} className="dropdown-item">
                Профиль
              </Link>
              <Link to="/FavoriteAnecdotesList" onClick={() => setIsOpen(false)} className="dropdown-item">
                Избранное
              </Link>
              {Number.parseInt(loginData.IdRights) === 2 && (
                <Link to="/analytics" onClick={() => setIsOpen(false)} className="dropdown-item">
                  Аналитика
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="dropdown-toggle"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  marginLeft: "1.5rem",
                  transition: "opacity 0.3s ease",
                }}
              >
                Выйти
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button onClick={toggleDropdown} className="dropdown-toggle">
            Войти ▼
          </button>
          {isOpen && (
            <div className="dropdown-menu">
              {!showForgotPassword ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="login"
                      placeholder="Логин"
                      value={credentials.login}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Пароль"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="submit" className="dropdown-button">
                      Войти
                    </button>
                  </form>
                  <div className="dropdown-links">
                    <p>
                      <a href="/registration">Регистрация</a>
                    </p>
                    <p>
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className="forgot-password-link"
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: 0,
                          font: "inherit",
                        }}
                      >
                        Забыли пароль?
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="forgot-password-form">
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Восстановление пароля</h4>
                    <form onSubmit={handleForgotPassword}>
                      <input
                        type="email"
                        placeholder="Введите ваш email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="dropdown-button" disabled={isLoading}>
                        {isLoading ? "Отправка..." : "Отправить"}
                      </button>
                    </form>
                    <p>
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        className="back-to-login-link"
                        style={{
                          background: "none",
                          border: "none",
                          color: "inherit",
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: 0,
                          font: "inherit",
                          fontSize: "12px",
                        }}
                      >
                        ← Назад к входу
                      </button>
                    </p>
                  </div>
                </>
              )}
              {error && (
                <p className="error-message" style={{ color: "red", fontSize: "12px" }}>
                  {error}
                </p>
              )}
              {forgotPasswordMessage && (
                <p className="success-message" style={{ color: "green", fontSize: "12px" }}>
                  {forgotPasswordMessage}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
