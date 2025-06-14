
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