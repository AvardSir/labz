import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/Autification.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";
import { AnecdoteCommentsComponent } from "../components/anikComments/AnecdoteCommentsComponent.jsx";


const AnecdoteCommentsPage = () => {
  return (
    <div className="main-container">
      <HomePage/>
      <AnecdoteCommentsComponent  />
    </div>
  );
};

export default AnecdoteCommentsPage;
//