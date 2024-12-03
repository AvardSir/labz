//HomePage.jsx
import React from "react";
import { Header } from "../components/Header"; // Используем именованный импорт
import { Autification } from "../components/Autification"; // Используем именованный импорт
// import { SearchSection } from "../components/SearchSection"; // Используем именованный импорт
import { AddAnecdoteComponent } from "../components/AddAnecdote";
import "../css/HomePage.css"; // Простой импорт стилей

const AddAnecdotePage = ({ what = 'anecdote' }) => {
  return (
    <div className="main-container">
      <Header />
      <AddAnecdoteComponent />
      
    </div>
  );
};

export default AddAnecdotePage;
