import React from "react";
import { Header } from "./Header";
import { RegistrationForm } from "./RegistrationForm";
import { SearchSection } from "./SearchSection";
import { FoundAnecdotes } from "./FoundAnecdotes";
import HomePage from "./HomePage.jsx";

import "../css/HomePage.css";

const EventsPage = () => {
  return (
    <div className="main-container">
      <HomePage what='events'/>
    </div>
  );
};

export default EventsPage;
