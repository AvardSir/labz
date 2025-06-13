"use client"

import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import axios from "axios"

import vkIcon from "../image/vk_ico.png" // путь относительно файла компонента
import { AnecdoteTypeTag } from "./foundAnekdot/AnecdoteTypeTag"
import AnecdoteAudioButton from "./AnecdoteAudioButton"
import FavoriteButton from "./FavoriteButton"
import { RatingButtons } from "./RatingButtons"
import { Footer } from "./Footer"
export const FoundAnecdotes = ({ anecdotes, setFoundAnecdotes, fetchAnecdotes }) => {
  const navigate = useNavigate()
  const { loginData } = useContext(AuthContext)
  const [localAnecdotes, setLocalAnecdotes] = useState([])
  const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M21.426 2.143a1.356 1.356 0 0 0-1.616-.48L2.78 9.356c-.707.263-.71 1.26 0 1.52l4.786 1.494 1.833 5.516c.12.345.441.552.806.552a.932.932 0 0 0 .52-.157l2.684-2.003 4.498 3.312c.334.237.781.048.855-.337l3.527-16.17c.095-.437-.35-.82-.963-.972zM9.877 14.87l-1.57-4.707 8.283-4.744-6.713 9.451z" />
    </svg>
  )

  const handleShareClick = (platform, anecdote) => {
    const text = encodeURIComponent(anecdote.Text)
    const url = encodeURIComponent(window.location.origin + `/anecdote-comments/${anecdote.IdAnecdote}`)

    let shareUrl = ""

    if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === "vk") {
      shareUrl = `https://vk.com/share.php?url=${url}&title=${text}`
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    const fetchRatedAnecdotes = async () => {
      try {
        const res = await fetch(`/api/rated-anecdotes?IdUser=${loginData.IdUser}`)
        const rated = await res.json() // Массив объектов: { IdAnecdote, IsPlus }

        const ratedMap = new Map(rated.map((r) => [r.IdAnecdote, r.IsPlus]))

        const updatedAnecdotes = anecdotes.map((a) => ({
          ...a,
          UserRating: ratedMap.has(a.IdAnecdote) ? ratedMap.get(a.IdAnecdote) : null,
        }))

        setLocalAnecdotes(updatedAnecdotes)
      } catch (error) {
        console.error("Ошибка при загрузке рейтингов:", error)
        setLocalAnecdotes(anecdotes) // хотя бы покажем анекдоты
      }
    }

    if (loginData?.IdUser && anecdotes.length > 0) {
      fetchRatedAnecdotes()
    } else {
      setLocalAnecdotes(anecdotes)
    }
  }, [anecdotes, loginData])

  const handleDelete = async (idAnecdote) => {
    try {
      const res = await axios.delete("/api/delete_anecdote", {
        data: { idAnecdote },
      })
      alert(res.data.message)
      window.location.reload()
    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error)
      alert("Произошла ошибка при удалении анекдота")
    }
  }

  const showRatingButtons = () => {
    const rights = Number.parseInt(loginData.IdRights)
    return rights === 1 || rights === 2
  }

  return (
    <div className="found-anecdotes">
      <button onClick={fetchAnecdotes} className="action-btn">
        Сбросить поиск по типам
      </button>
      {Number.parseInt(loginData.IdRights) === 2 && (
        <button onClick={() => navigate("/add-anecdote")} className="action-btn add-btn">
          ✚ Добавить анекдот
        </button>
      )}

      {/* Добавляем кнопку "Предложить анекдот" для всех авторизованных пользователей */}
      {loginData?.IdUser && (
        <button onClick={() => navigate("/suggest-anecdote")} className="action-btn suggest-btn">
          💡 Предложить анекдот
        </button>
      )}

      <h3 className="section-title">Найденные анекдоты (💡 Нажмите на анекдот, чтобы скопировать его текст)</h3>
      <p className="text-sm text-gray-600 bg-gray-100 bg-opacity-75 rounded px-3 py-2 mb-4 w-fit"></p>
      {localAnecdotes.length === 0 ? (
        <p className="empty-message">Ничего не найдено</p>
      ) : (
        <ul className="anecdotes-list">
          {localAnecdotes.map((anecdote) => (
            <li key={anecdote.IdAnecdote} className="card">
              <div
                className="card-content cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                title="Нажмите, чтобы скопировать"
                onClick={() => {
                  navigator.clipboard
                    .writeText(anecdote.Text)
                    .then(() => alert("Текст скопирован в буфер обмена"))
                    .catch((err) => console.error("Ошибка копирования:", err))
                }}
              >
                <p>
                  {anecdote.Text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < anecdote.Text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="card-meta">
                {showRatingButtons() && (
                  <RatingButtons
                    anecdoteId={anecdote.IdAnecdote}
                    initialRating={anecdote.Rate}
                    initialUserRating={anecdote.UserRating}
                  />
                )}

                {/* {console.log(anecdote)} */}
                {/* {console.log(setFoundAnecdotes)} */}
                <AnecdoteTypeTag
                  type={anecdote.AnecdoteType}
                  typeId={anecdote.IdTypeAnecdote}
                  setFoundAnecdotes={setFoundAnecdotes}
                />

                <span>👤 {anecdote.UserName}</span>
                <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>

                <span
                  className="share-icon telegram"
                  title="Поделиться в Telegram"
                  onClick={() => handleShareClick("telegram", anecdote)}
                >
                  <TelegramIcon style={{ width: 16, height: 16, cursor: "pointer" }} />
                </span>

                <span
                  className="share-icon vk"
                  title="Поделиться в VK"
                  onClick={() => handleShareClick("vk", anecdote)}
                >
                  <img
                    src={vkIcon || "/placeholder.svg"}
                    alt="VK"
                    width={16}
                    height={16}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              </div>

              <div className="action-buttons">
                <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>💬 Комментарии</button>
                <AnecdoteAudioButton idAnecdote={anecdote.IdAnecdote} />

                {(Number.parseInt(loginData.IdRights) === 2 || Number.parseInt(loginData.IdRights) == 1) && (
                  <FavoriteButton userId={loginData.IdUser} anecdoteId={anecdote.IdAnecdote} />
                )}

                {Number.parseInt(loginData.IdRights) === 2 && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)}
                      className="action-btn edit-btn"
                    >
                      ✏️ Изменить
                    </button>
                    <button onClick={() => handleDelete(anecdote.IdAnecdote)} className="action-btn delete-btn">
                      🗑️ Удалить
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Footer/>
    </div>
  )
}
