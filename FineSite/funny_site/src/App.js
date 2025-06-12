import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { AuthProvider } from "./components/context/AuthContext"
import AddAnecdotePage from "./pages/AddAnecdotePage"
import { AddEventPage } from "./pages/AddEventPage"
import AnecdoteCommentsPage from "./pages/AnecdoteCommentsPage"
import AnecdotesPage from "./pages/AnecdotesPage"
import { EditAnecdotePage } from "./pages/EditAnecdotePage"
import EditEventPage from "./pages/EditEventPage"
import EventCommentsPage from "./pages/EventCommentsPage"
import EventsPage from "./pages/EventsPage"
import PersonalCabinetPage from "./pages/PersonalCabinetPage"
import RegistrationPage from "./pages/RegistrationPage"
import AnalyticsPage from "./components/Analutics/main/AnalyticsPage"
import Anecdoteator from "./components/Anecdoteator"
import AnecdoteGuessGame from "./components/AnecdoteGuessGame"
import { FavoriteAnecdotesList } from "./components/FavoriteAnecdotesList"
import { ResetPasswordPage } from "./components/ResetPasswordPage"
import { DropdownProvider } from "./components/context/DropdownContext"
import { ClickOutsideHandler } from "./components/ClickOutsideHandler"

function App() {
  return (
    <AuthProvider>
      <Router>
        <DropdownProvider>
          <ClickOutsideHandler>
            <Routes>
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
              <Route path="/AnecdoteGuessGame" element={<AnecdoteGuessGame />} />
              <Route path="/FavoriteAnecdotesList" element={<FavoriteAnecdotesList />} />
            </Routes>
          </ClickOutsideHandler>
        </DropdownProvider>
      </Router>
    </AuthProvider>
  )
}

export default App
