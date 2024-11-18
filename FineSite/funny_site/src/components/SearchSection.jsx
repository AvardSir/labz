// SearchSection.jsx
import React, { useState, useEffect } from "react";
import "../css/SearchSection.css";
import { FoundAnecdotes } from "./FoundAnecdotes";
import { FoundEvents } from "./FoundEvents";
import { AnecdoteSearch } from "./AnecdoteSearch";
import { EventSearch } from "./EventSearch";

export const SearchSection = ({ what ='anecdote'}) => {
  const [searchData, setSearchData] = useState({
    anecdote: "", // id типа анекдота
    event: "",
  });

  const [foundAnecdotes, setFoundAnecdotes] = useState([]);
  const [foundEvents, setFoundEvents] = useState([]);
  const [showAnecdotes, setShowAnecdotes] = useState(true); // По умолчанию не показываем анекдоты
  const [showEvents, setShowEvents] = useState(false); // По умолчанию не показываем мероприятия

  // Функция для загрузки анекдотов
  const fetchAnecdotes = async () => {
    try {
      const response = await fetch(`/api/anecdotes`);
      const result = await response.json();
      setFoundAnecdotes(Array.isArray(result) ? result : []); // Обновляем найденные анекдоты
      // handleSearchAnecdotes(); // Вызываем handleSearchAnecdotes для отображения анекдотов
    } catch (error) {
      console.error("Ошибка при поиске анекдотов:", error);
      setFoundAnecdotes([]); // Если ошибка, очищаем результаты
    }
  };

  // Функция для загрузки мероприятий
  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/events`);
      const result = await response.json();
      setFoundEvents(Array.isArray(result) ? result : []); // Обновляем найденные мероприятия
    } catch (error) {
      console.error("Ошибка при поиске мероприятий:", error);
      setFoundEvents([]); // Если ошибка, очищаем результаты
    }
  };

  // Обработчик для поиска анекдотов
  const handleSearchAnecdotes = () => {
    setShowAnecdotes(true);  // Показываем анекдоты
    setShowEvents(false);  // Скрываем мероприятия
  };

  // Обработчик для поиска мероприятий
  const handleSearchEvents = () => {
    setShowAnecdotes(false);  // Скрываем анекдоты
    setShowEvents(true);  // Показываем мероприятия
  };

  // Выполняем запросы при загрузке компонента, с учетом параметра what
  useEffect(() => {
    
    // {console.log(showEvents)}
    if (what === "events") {
      
      handleSearchEvents();
      fetchEvents();
      
    } else if (what === "anecdote") {
      // Если передан параметр what == "anecdote", выполняем запрос на анекдоты
      fetchAnecdotes();
      // setShowAnecdotes(true); // Показываем анекдоты
    }
  }, [what]) ; // Зависимость от what для динамического обновления

  
  return (
    <section className="search">
      <h2>Поиск</h2>
      <div className="search-options">
        <AnecdoteSearch
          searchData={searchData}
          setSearchData={setSearchData}
          setFoundAnecdotes={setFoundAnecdotes}
          handleSearchAnecdotes={handleSearchAnecdotes}  // Передаем handleSearchAnecdotes
        />
        
        {/*  TODO: перекинь этот див ниже ивентов после уборки с ивентами */}
        <EventSearch
          searchData={searchData}
          setSearchData={setSearchData}
          setFoundEvents={setFoundEvents}
          handleSearchEvents={handleSearchEvents}  // Передаем handleSearchEvents
        />
      
      </div>
{/* Отображение найденных мероприятий */}
{showEvents && <FoundEvents events={foundEvents} />}
      {/* Отображение найденных анекдотов */}
      {showAnecdotes && <FoundAnecdotes anecdotes={foundAnecdotes} />}

      
    </section>
  );
};
