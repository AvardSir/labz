import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import HomePage from "./pages/HomePage";
import AnecdotesPage from "./pages/AnecdotesPage";
import EventsPage from "./pages/EventsPage";
import RegistrationPage from "./pages/RegistrationPage";
import PersonalCabinet from "./pages/PersonalCabinet";
import AnecdoteCommentsPage from "./pages/AnecdoteCommentsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AnecdotesPage />} />
          <Route path="/anecdotes" element={<AnecdotesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/personal_cabinet" element={<PersonalCabinet />} />
          <Route path="/anecdote-comments/:anecdoteId" element={<AnecdoteCommentsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
