import React from "react"
import vkIcon from "../image/vk_ico.png"
import { AnecdoteTypeTag } from "./foundAnekdot/AnecdoteTypeTag"
import AnecdoteAudioButton from "./AnecdoteAudioButton"
import FavoriteButton from "./FavoriteButton"
import { RatingButtons } from "./RatingButtons"
import ShareButtons from "./ShareButtons"

const AnecdoteItem = ({ anecdote, showRatingButtons, handleDelete, setFoundAnecdotes, loginData, navigate }) => {
  const handleCopyText = () => {
    navigator.clipboard
      .writeText(anecdote.Text)
      .then(() => alert("Текст скопирован в буфер обмена"))
      .catch((err) => console.error("Ошибка копирования:", err))
  }

  return (
    <li key={anecdote.IdAnecdote} className="card">
      <div
        className="card-content cursor-pointer hover:bg-gray-100 p-2 rounded transition"
        title="Нажмите, чтобы скопировать"
        onClick={handleCopyText}
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
        {showRatingButtons && (
          <RatingButtons
            anecdoteId={anecdote.IdAnecdote}
            initialRating={anecdote.Rate}
            initialUserRating={anecdote.UserRating}
          />
        )}

        <AnecdoteTypeTag
          type={anecdote.AnecdoteType}
          typeId={anecdote.IdTypeAnecdote}
          setFoundAnecdotes={setFoundAnecdotes}
        />

        <span>👤 {anecdote.UserName}</span>
        <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>

        <ShareButtons anecdote={anecdote} />
      </div>

      <ActionButtons anecdote={anecdote} loginData={loginData} navigate={navigate} handleDelete={handleDelete} />
    </li>
  )
}

export default AnecdoteItem
