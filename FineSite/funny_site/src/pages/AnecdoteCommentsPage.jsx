import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/Autification.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";
import { AnecdoteCommentsСomponent } from "../components/AnecdoteCommentsСomponent.jsx";


const AnecdoteCommentsPage = () => {
  return (
    <div className="main-container">
      <HomePage/>
      <AnecdoteCommentsСomponent  />
    </div>
  );
};

export default AnecdoteCommentsPage;
//