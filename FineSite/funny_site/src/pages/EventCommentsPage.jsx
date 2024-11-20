import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/Autification.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";
import { EventCommentsComponent } from "../components/EventCommentsComponent.jsx";
import { useParams } from "react-router-dom";

const EventCommentsPage = () => {
    const { eventId } = useParams(); // Получаем параметр eventId из URL

  return (
    <div className="main-container">
      <HomePage />
      
      <EventCommentsComponent />
    </div>
  );
};

export default EventCommentsPage;
