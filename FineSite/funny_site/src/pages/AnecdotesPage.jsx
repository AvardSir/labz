//AnecdotesPage.jsx
import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/Autification.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";

import "../css/HomePage.css";

const EventsPage = () => {
  return (
    // <Header />
    // <div className="main-container horizontal-layout">
    //   <HomePage />
      
    //   <div className="main-container">
        
    //     <SearchSection />
    //   </div>
    // </div>

    <div className="main-container">
      <HomePage />
      <SearchSection />
    </div>
  );
};

export default EventsPage;
