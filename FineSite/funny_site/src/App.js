import React from "react";
import { Route, BrowserRouter as Router, Routes, Switch } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import AddAnecdotePage from "./pages/AddAnecdotePage";
import { AddEventPage } from "./pages/AddEventPage";
import AnecdoteCommentsPage from "./pages/AnecdoteCommentsPage";
import AnecdotesPage from "./pages/AnecdotesPage";
import { EditAnecdotePage } from "./pages/EditAnecdotePage";
import EditEventPage from "./pages/EditEventPage";
import EventCommentsPage from "./pages/EventCommentsPage"; // Путь к странице комментариев
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import PersonalCabinet from "./pages/PersonalCabinet";
import PersonalCabinetPage from "./pages/PersonalCabinetPage";
import RegistrationPage from "./pages/RegistrationPage";
// import { AnalyticsPage } from "./components/Analytics/AnalyticsPage";
// import { SimpleAnalyticsPage } from "./components/Analytics/SimpleAnalyticsPage";
// import { LighthouseButton } from "./components/Analytics/LighthouseButton";

// import AnecdotesRatingChart from "./components/Analutics2/AverageRatingChart";

// import { AnalyticsPage} from "./components/Analutics2/AnalyticsPage";
// import AnalyticsPage from "./components/Analutics/AnalyticsPage";
import AnalyticsPage from "./components/Analutics/main/AnalyticsPage";
import Anecdoteator from "./components/Anecdoteator";
import AnecdoteGuessGame from "./components/AnecdoteGuessGame";
// import FavoriteAnecdotesList from "./components/FavoriteAnecdotesList";
import { FavoriteAnecdotesList } from "./components/FavoriteAnecdotesList";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/anecdoteator" element={<Anecdoteator />} />
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

          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* <Route path="/LighthouseButton" element={<LighthouseButton />} /> */}
    
    <Route path="/AnecdoteGuessGame" element={<AnecdoteGuessGame />} />
    <Route path="/FavoriteAnecdotesList" element={<FavoriteAnecdotesList />} />



        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
