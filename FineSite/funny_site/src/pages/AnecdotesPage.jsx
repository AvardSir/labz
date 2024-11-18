import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/RegistrationForm.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
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
