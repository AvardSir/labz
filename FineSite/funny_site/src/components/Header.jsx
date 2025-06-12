"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import { DropdownProvider } from "./context/DropdownContext"
import { DropdownLogin } from "./DropdownLogin"
import { GamesDropdown } from "./GamesDropdown"

export const Header = () => {
  const { loginData, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout() // Выход через AuthContext
    navigate("/") // Переход на главную
  }

  return (
    <DropdownProvider>
      <header className="header">
        <Link to="/" className="logo-link">
          <h1 className="logo">FunnySite</h1>
        </Link>
        <nav className="navigation">
          <Link to="/" className="nav-link">
            Главная
          </Link>
          <Link to="/anecdotes" className="nav-link">
            Анекдоты
          </Link>
          <Link to="/events" className="nav-link">
            Мероприятия
          </Link>
          <GamesDropdown />
          <DropdownLogin />
        </nav>
      </header>
    </DropdownProvider>
  )
}
