import React from "react";
import TelegramIcon from "./TelegramIcon";
import vkIcon from "../../image/vk_ico.png";

const ShareButtons = ({ anecdote }) => {
  const handleShareClick = (platform) => {
    const text = encodeURIComponent(anecdote.Text);
    const url = encodeURIComponent(window.location.origin + `/anecdote-comments/${anecdote.IdAnecdote}`);
    const shareUrl = platform === "telegram"
      ? `https://t.me/share/url?url=${url}&text=${text}`
      : `https://vk.com/share.php?url=${url}&title=${text}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <span
        className="share-icon telegram"
        title="Поделиться в Telegram"
        onClick={() => handleShareClick("telegram")}
      >
        <TelegramIcon />
      </span>
      <span
        className="share-icon vk"
        title="Поделиться в VK"
        onClick={() => handleShareClick("vk")}
      >
        <img src={vkIcon} alt="VK" width={16} height={16} style={{ cursor: "pointer" }} />
      </span>
    </>
  );
};

export default ShareButtons;
