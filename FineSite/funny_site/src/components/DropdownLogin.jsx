"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "./context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useDropdown } from "./context/DropdownContext"

export const DropdownLogin = () => {
  const { isLoggedIn, login, logout, loginData } = useContext(AuthContext)
  const { isOpen, toggleDropdown } = useDropdown()
  const dropdownName = "login"

  const [credentials, setCredentials] = useState({ login: "", password: "" })
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Сбрасываем состояние при смене isLoggedIn (логин/логаут)
  useEffect(() => {
    toggleDropdown(null) // Закрываем dropdown
    setError("")
    setCredentials({ login: "", password: "" })
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
    setForgotPasswordMessage("")
  }, [isLoggedIn])

  const handleToggle = () => {
    toggleDropdown(dropdownName)
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
      toggleDropdown(null) // Закрываем dropdown
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
    toggleDropdown(null) // Закрываем dropdown
  }

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword)
    setError("")
    setForgotPasswordMessage("")
    setForgotPasswordEmail("")
  }

  const handleLinkClick = () => {
    toggleDropdown(null) // Закрываем dropdown при клике на ссылку
  }

  // Пункты меню для авторизованного пользователя
  const userMenuItems = [
    {
      name: "Профиль",
      path: "/personal_cabinet",
      icon: "👤",
      description: "Личный кабинет",
    },
    {
      name: "Избранное",
      path: "/FavoriteAnecdotesList",
      icon: "❤️",
      description: "Любимые анекдоты",
    },
    ...(Number.parseInt(loginData?.IdRights) === 2
      ? [
          {
            name: "Аналитика",
            path: "/analytics",
            icon: "📊",
            description: "Статистика сайта",
          },
          {
            name: "Предложенные анекдоты",
            path: "/suggested-anecdotes-admin",
            icon: "📝",
            description: "Модерация анекдотов",
          },
        ]
      : []),
  ]

  return (
    <div className="dropdown-login dropdown-container" style={{ textShadow: "none" }}>
      {isLoggedIn ? (
        <>
          <button onClick={handleToggle} className="dropdown-toggle nav-link">
            👤 {loginData.login} ▼
          </button>
          {isOpen(dropdownName) && (
            <div
              className="dropdown-menu login-menu"
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                minWidth: "280px",
                zIndex: 1000,
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                className="login-header"
                style={{
                  padding: "12px 16px 8px 16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <h4
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  👋 Привет, {loginData.login}!
                </h4>
              </div>

              <div className="user-menu-list">
                {userMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={handleLinkClick}
                    className="user-menu-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      textDecoration: "none",
                      color: "#333",
                      borderBottom: index < userMenuItems.length - 1 ? "1px solid #f0f0f0" : "none",
                      transition: "all 0.2s ease",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9ff"
                      e.currentTarget.style.borderLeft = "4px solid #667eea"
                      e.currentTarget.style.paddingLeft = "12px"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.borderLeft = "none"
                      e.currentTarget.style.paddingLeft = "16px"
                    }}
                  >
                    <span
                      className="menu-icon"
                      style={{
                        fontSize: "18px",
                        marginRight: "12px",
                        minWidth: "24px",
                        textAlign: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    <div className="menu-info">
                      <div
                        className="menu-name"
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          marginBottom: "2px",
                          color: "#2d3748",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="menu-description"
                        style={{
                          fontSize: "11px",
                          color: "#718096",
                          lineHeight: "1.3",
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div
                className="logout-section"
                style={{
                  padding: "8px",
                  borderTop: "1px solid #f0f0f0",
                  background: "#fafbfc",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-1px)"
                    e.target.style.boxShadow = "0 4px 12px rgba(255, 107, 107, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  🚪 Выйти
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button onClick={handleToggle} className="dropdown-toggle nav-link">
            🔐 Войти ▼
          </button>
          {isOpen(dropdownName) && (
            <div
              className="dropdown-menu login-form-menu"
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                minWidth: "300px",
                zIndex: 1000,
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                className="login-form-header"
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {showForgotPassword ? "🔑 Восстановление пароля" : "🔐 Вход в аккаунт"}
                </h4>
              </div>

              <div style={{ padding: "20px" }}>
                {!showForgotPassword ? (
                  <>
                    <form onSubmit={handleSubmit} style={{ marginBottom: "16px" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <input
                          type="text"
                          name="login"
                          placeholder="Логин"
                          value={credentials.login}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            transition: "border-color 0.2s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#667eea"
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0"
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: "16px" }}>
                        <input
                          type="password"
                          name="password"
                          placeholder="Пароль"
                          value={credentials.password}
                          onChange={handleChange}
                          required
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            transition: "border-color 0.2s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#667eea"
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0"
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-1px)"
                          e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        Войти
                      </button>
                    </form>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        paddingTop: "12px",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <Link
                        to="/registration"
                        onClick={handleLinkClick}
                        style={{
                          color: "#667eea",
                          textDecoration: "none",
                          fontSize: "13px",
                          textAlign: "center",
                          padding: "4px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none"
                        }}
                      >
                        📝 Регистрация
                      </Link>
                      <button
                        type="button"
                        onClick={toggleForgotPassword}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#718096",
                          fontSize: "12px",
                          cursor: "pointer",
                          textAlign: "center",
                          padding: "4px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#667eea"
                          e.target.style.textDecoration = "underline"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#718096"
                          e.target.style.textDecoration = "none"
                        }}
                      >
                        🔑 Забыли пароль?
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleForgotPassword} style={{ marginBottom: "16px" }}>
                      <div style={{ marginBottom: "16px" }}>
                        <input
                          type="email"
                          placeholder="Введите ваш email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "14px",
                            transition: "border-color 0.2s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#667eea"
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0"
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: isLoading ? "#cbd5e0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isLoading ? "⏳ Отправка..." : "📧 Отправить"}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={toggleForgotPassword}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#718096",
                        fontSize: "12px",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "center",
                        padding: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#667eea"
                        e.target.style.textDecoration = "underline"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#718096"
                        e.target.style.textDecoration = "none"
                      }}
                    >
                      ← Назад к входу
                    </button>
                  </>
                )}

                {error && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      background: "#fed7d7",
                      border: "1px solid #feb2b2",
                      borderRadius: "4px",
                      color: "#c53030",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    ❌ {error}
                  </div>
                )}

                {forgotPasswordMessage && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "8px 12px",
                      background: "#c6f6d5",
                      border: "1px solid #9ae6b4",
                      borderRadius: "4px",
                      color: "#2f855a",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    ✅ {forgotPasswordMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
