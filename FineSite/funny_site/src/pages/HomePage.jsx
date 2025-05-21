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
      <Autification />

      {/* Flex-контейнер для двух блоков */}
      <div className="ads-row">
        <AdBlock />
        <ContactForAds />
      </div>

    </div>
  );
};

export default HomePage;
