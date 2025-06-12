"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export const GamesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const games = [
    {
      name: "Угадай концовку",
      path: "/AnecdoteGuessGame",
      description: "Попробуй угадать концовку анекдота",
      icon: "🎯",
    },
    {
      name: "Анекдотатор",
      path: "/anecdoteator",
      description: "Создавай свои анекдоты",
      icon: "✍️",
    },
    
  ]

  return (
    <div className="games-dropdown dropdown-container" style={{ textShadow: 'none' }}
>
      <button onClick={toggleDropdown} className="dropdown-toggle nav-link">
        🎮 Игры ▼
      </button>
      {isOpen && (
        <div
          className="dropdown-menu games-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
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
            className="games-header"
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
              🎮 Выберите игру
            </h4>
          </div>

          <div className="games-list">
            {games.map((game, index) => (
              <Link
                key={index}
                to={game.path}
                onClick={closeDropdown}
                className="game-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  textDecoration: "none",
                  color: "#333",
                  borderBottom: index < games.length - 1 ? "1px solid #f0f0f0" : "none",
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
                  className="game-icon"
                  style={{
                    fontSize: "22px",
                    marginRight: "12px",
                    minWidth: "28px",
                    textAlign: "center",
                  }}
                >
                  {game.icon}
                </span>
                <div className="game-info">
                  <div
                    className="game-name"
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "3px",
                      color: "#2d3748",
                    }}
                  >
                    {game.name}
                  </div>
                  <div
                    className="game-description"
                    style={{
                      fontSize: "12px",
                      color: "#718096",
                      lineHeight: "1.4",
                    }}
                  >
                    {game.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div
            className="games-footer"
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #f0f0f0",
              textAlign: "center",
              background: "#fafbfc",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#a0aec0",
                fontStyle: "italic",
              }}
            >
              ✨ Больше игр скоро!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
