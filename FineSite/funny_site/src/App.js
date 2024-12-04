import React from "react";
import { BrowserRouter as Router, Routes, Route, Switch} from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import HomePage from "./pages/HomePage";
import AnecdotesPage from "./pages/AnecdotesPage";
import EventsPage from "./pages/EventsPage";
import RegistrationPage from "./pages/RegistrationPage";
import PersonalCabinet from "./pages/PersonalCabinet";
import AnecdoteCommentsPage from "./pages/AnecdoteCommentsPage";
import EventCommentsPage from "./pages/EventCommentsPage"; // Путь к странице комментариев
import PersonalCabinetPage from "./pages/PersonalCabinetPage";
import AddAnecdotePage from "./pages/AddAnecdotePage";
import { EditAnecdotePage } from "./pages/EditAnecdotePage";
import { AddEventPage } from "./pages/AddEventPage";
import EditEventPage from "./pages/EditEventPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AnecdotesPage />} />
          <Route path="/anecdotes" element={<AnecdotesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/personal_cabinet" element={<PersonalCabinetPage />} />
          <Route path="/anecdote-comments/:anecdoteId" element={<AnecdoteCommentsPage />} />
          <Route path="/event-comments/:eventId" element={<EventCommentsPage />} />
          <Route path="/add-anecdote" element={<AddAnecdotePage />} />

          <Route path="/edit-anecdote/:id" element={<EditAnecdotePage />} />

          <Route path="/add-event" element={<AddEventPage />} />
          <Route path="/edit-event/:id" element={<EditEventPage />} />

         

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
