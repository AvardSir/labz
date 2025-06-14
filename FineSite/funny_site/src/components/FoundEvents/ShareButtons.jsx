import React from "react";
import TelegramIcon from "../TelegramIcon";
import vkIcon from '../../image/vk_ico.png';


export const ShareButtons = ({ event }) => {
  const handleShareClick = (platform) => {
    let url;
    if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(event.Name)}`;
    } else if (platform === "vk") {
      url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(event.Name)}`;
    }
    window.open(url, "_blank");
  };

  return (
    <>
      <span
        className="share-icon telegram"
        title="Поделиться в Telegram"
        onClick={() => handleShareClick("telegram")}
      >
        <TelegramIcon style={{ width: 16, height: 16, cursor: "pointer" }} />
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
