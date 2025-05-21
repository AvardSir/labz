import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

import vkIcon from '../image/vk_ico.png'; // путь относительно файла компонента


export const FoundAnecdotes = ({ anecdotes }) => {
  const navigate = useNavigate();
  const { loginData } = useContext(AuthContext);
  const [localAnecdotes, setLocalAnecdotes] = useState([]);
  const TelegramIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
    >
      <path d="M21.426 2.143a1.356 1.356 0 0 0-1.616-.48L2.78 9.356c-.707.263-.71 1.26 0 1.52l4.786 1.494 1.833 5.516c.12.345.441.552.806.552a.932.932 0 0 0 .52-.157l2.684-2.003 4.498 3.312c.334.237.781.048.855-.337l3.527-16.17c.095-.437-.35-.82-.963-.972zM9.877 14.87l-1.57-4.707 8.283-4.744-6.713 9.451z" />
    </svg>
  );

  //   const VkIcon = () => (
  //   <svg
  //     width="20"
  //     height="20"
  //     viewBox="0 0 24 24"
  //     xmlns="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Fru%2Ffree-icon%2Fvk_145813&psig=AOvVaw1duJw5USDC5ACvRhZB-lMG&ust=1747919611896000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKDi347StI0DFQAAAAAdAAAAABAE"
  //   >
  //     <rect width="24" height="24" rx="4" fill="#4680C2" />
  //     <path
  //       fill="white"
  //       d="M7.978 8.872c-.118-.08-.26-.11-.393-.093-.08.012-.153.06-.202.126-.367.506-.71 1.03-1.02 1.572-.3.522-.576 1.06-.8 1.61-.023.058-.01.126.034.17.022.022.05.034.08.034h2.022c.13 0 .246-.082.287-.205.14-.445.338-.858.58-1.224.178-.267.372-.513.58-.74.057-.056.05-.152-.014-.202l-1.37-1.176zm6.902 2.89c-.053-.067-.115-.11-.178-.11-.186 0-.512.16-.89.498-.41.376-.69.727-.837.99-.025.05-.002.114.06.146.314.168.635.257.934.257.29 0 .51-.117.668-.354.103-.162.147-.362.125-.6-.012-.15-.053-.303-.112-.426zm1.323-3.092h-2.064c-.135 0-.253.094-.283.225-.154.626-.46 1.376-.932 2.243-.184.361-.405.686-.648.965-.04.045-.05.113-.027.166.06.124.15.243.264.34.348.276.79.418 1.295.418.54 0 1.02-.187 1.36-.518.136-.128.268-.33.38-.59.13-.296.222-.65.272-1.038.012-.095-.057-.18-.154-.18h-1.31c-.165 0-.29-.135-.29-.3 0-.156.116-.29.26-.29h1.715c.107 0 .183-.11.155-.212-.13-.557-.43-1.44-.82-2.056-.03-.058-.08-.08-.142-.08z"
  //     />
  //   </svg>
  // );




  const handleShareClick = (platform, anecdote) => {
    const text = encodeURIComponent(anecdote.Text);
    const url = encodeURIComponent(window.location.origin + `/anecdote-comments/${anecdote.IdAnecdote}`);

    let shareUrl = "";

    if (platform === "telegram") {
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    } else if (platform === "vk") {
      shareUrl = `https://vk.com/share.php?url=${url}&title=${text}`;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };


  useEffect(() => {
    const fetchRatedAnecdotes = async () => {
      try {
        const res = await fetch(`/api/rated-anecdotes?IdUser=${loginData.IdUser}`);
        const rated = await res.json(); // Массив объектов: { IdAnecdote, IsPlus }

        const ratedMap = new Map(
          rated.map((r) => [r.IdAnecdote, r.IsPlus])
        );

        const updatedAnecdotes = anecdotes.map((a) => ({
          ...a,
          UserRating: ratedMap.has(a.IdAnecdote) ? ratedMap.get(a.IdAnecdote) : null,
        }));

        setLocalAnecdotes(updatedAnecdotes);
      } catch (error) {
        console.error("Ошибка при загрузке рейтингов:", error);
        setLocalAnecdotes(anecdotes); // хотя бы покажем анекдоты
      }
    };

    if (loginData?.IdUser && anecdotes.length > 0) {
      fetchRatedAnecdotes();
    } else {
      setLocalAnecdotes(anecdotes);
    }
  }, [anecdotes, loginData]);

  const handleRate = async (idAnecdote, isPlus) => {
    try {
      const current = localAnecdotes.find((a) => a.IdAnecdote === idAnecdote);
      const isSameRating = current.UserRating === isPlus;

      const res = await fetch("/api/anecdotes/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          IdUser: loginData.IdUser,
          IdAnecdote: idAnecdote,
          IsPlus: isPlus,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updated = localAnecdotes.map((a) =>
          a.IdAnecdote === idAnecdote
            ? {
              ...a,
              Rate: data.newRating,
              UserRating: isSameRating ? null : isPlus,
            }
            : a
        );
        setLocalAnecdotes(updated);
      }
    } catch (error) {
      console.error("Ошибка при оценке:", error);
    }
  };

  const handleDelete = async (idAnecdote) => {
    try {
      const res = await axios.delete("/api/delete_anecdote", {
        data: { idAnecdote },
      });
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении анекдота:", error);
      alert("Произошла ошибка при удалении анекдота");
    }
  };

  const showRatingButtons = () => {
    const rights = parseInt(loginData.IdRights);
    return rights === 1 || rights === 2;
  };

  return (
    <div className="found-anecdotes">
      {parseInt(loginData.IdRights) === 2 && (
        <button onClick={() => navigate("/add-anecdote")} className="action-btn add-btn">
          ✚ Добавить анекдот
        </button>
      )}

      <h3 className="section-title">Найденные анекдоты</h3>
      <p className="text-sm text-gray-600 bg-gray-100 bg-opacity-75 rounded px-3 py-2 mb-4 w-fit">
        💡 Нажмите на анекдот, чтобы скопировать его текст
      </p>
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
                  navigator.clipboard.writeText(anecdote.Text)
                    .then(() => alert('Текст скопирован в буфер обмена'))
                    .catch(err => console.error('Ошибка копирования:', err));
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
  <span>🏷️ {anecdote.AnecdoteType.trim()}</span>
  <span>⭐ {anecdote.Rate || 0}</span>
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
    <img src={vkIcon} alt="VK" width={16} height={16} style={{ cursor: "pointer" }} />
  </span>
</div>


              {showRatingButtons() && (
                <div className="rating-buttons">
                  <button
                    onClick={() => handleRate(anecdote.IdAnecdote, true)}
                    className={`rate-btn plus-btn ${anecdote.UserRating === true ? 'active' : ''}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRate(anecdote.IdAnecdote, false)}
                    className={`rate-btn minus-btn ${anecdote.UserRating === false ? 'active' : ''}`}
                  >
                    –
                  </button>
                </div>
              )}

              <div className="action-buttons">



                <button onClick={() => navigate(`/anecdote-comments/${anecdote.IdAnecdote}`)}>
                  💬 Комментарии
                </button>

                {parseInt(loginData.IdRights) === 2 && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-anecdote/${anecdote.IdAnecdote}`)}
                      className="action-btn edit-btn"
                    >
                      ✏️ Изменить
                    </button>
                    <button
                      onClick={() => handleDelete(anecdote.IdAnecdote)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Удалить
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
