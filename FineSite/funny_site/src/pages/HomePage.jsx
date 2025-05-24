import React from "react";
import { Header } from "../components/Header";
import { Autification } from "../components/Autification";
import AdBlock from "../components/AdBlock";
import ContactForAds from "../components/ContactForAds";

import "../css/HomePage.css";
import "../css/AdBlock.css";
import "../css/ContactForAds.css";

const HomePage = ({ what = 'anecdote' }) => {
  return (
    <div className="main-container">
  <Header />
  
  {/* Основной контейнер с flex-расположением */}
  <div className="content-wrapper">
    {/* Блок рекламы (горизонтальный) */}
    <div className="ads-block">
      <AdBlock />
    </div>

    {/* Боковой блок с вертикальным расположением элементов */}
    <div className="side-block">
      <Autification />
      <ContactForAds />
    </div>
  </div>
</div>
  );
};

export default HomePage;
