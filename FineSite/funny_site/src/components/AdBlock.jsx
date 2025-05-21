import React from "react";
import "../css/AdBlock.css";

const AdBlock = () => {
  return (
    <div className="contact-ads-block">
      <h2 className="contact-ads-title">Реклама</h2>
      
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGlzYXpta3l0bmkzaHNtdXQ2cHM1NjF2c295dXNsNHdxem8zZmh2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/el22eN2F2MkdIXwnWM/giphy.gif"
        alt="Ad example gif"
        className="ad-gif"
      />
      <p>Здесь могла бы быть ваша реклама!</p>
    </div>
  );
};

export default AdBlock;
