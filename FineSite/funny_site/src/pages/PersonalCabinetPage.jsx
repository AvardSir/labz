import React from "react";
import { Header } from "../components/Header.jsx";
import { RegistrationForm } from "../components/Autification.jsx";
import { SearchSection } from "../components/SearchSection.jsx";
import { FoundAnecdotes } from "../components/FoundAnecdotes.jsx";
import HomePage from "./HomePage.jsx";

import PersonalCabinet from "./PersonalCabinet.jsx";

import "../css/HomePage.css";

const PersonalCabinetPage = () => {
  return (
    <div className="main-container">
      <Header/>
      <PersonalCabinet  />
    </div>
  );
};

export default PersonalCabinetPage;
