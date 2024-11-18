import React from "react";
import { Header } from "./Header.jsx";
import { RegistrationForm } from "./RegistrationForm.jsx";
import { SearchSection } from "./SearchSection.jsx";
import { FoundAnecdotes } from "./FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";

import "../css/HomePage.css";

const EventsPage = () => {
  return (
    <div className="main-container">
      <HomePage />
    </div>
  );
};

export default EventsPage;
