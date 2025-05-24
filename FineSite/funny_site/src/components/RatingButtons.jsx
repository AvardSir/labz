import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

export const RatingButtons = ({ anecdoteId, initialRating, initialUserRating }) => {
  const { loginData } = useContext(AuthContext);
  const [rating, setRating] = useState(initialRating);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [isLoading, setIsLoading] = useState(false);

  const handleRate = async (isPlus) => {
    if (!loginData?.IdUser) {
      alert('Для оценки необходимо авторизоваться');
      return;
    }

    setIsLoading(true);
    
    try {
      const isSameRating = userRating === isPlus;
      const newUserRating = isSameRating ? null : isPlus;

      const response = await axios.post('/api/anecdotes/rate', {
        IdUser: loginData.IdUser,
        IdAnecdote: anecdoteId,
        IsPlus: isPlus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setRating(response.data.newRating);
        setUserRating(newUserRating);
      }
    } catch (error) {
      console.error('Ошибка при оценке:', error);
      alert('Не удалось сохранить оценку');
    } finally {
      setIsLoading(false);
    }
  };

  if (!loginData?.IdRights || (loginData.IdRights !== '1' && loginData.IdRights !== '2')) {
    return null;
  }

  return (
    <div className="rating-buttons">
      <button
        onClick={() => handleRate(true)}
        disabled={isLoading}
        className={`rate-btn plus-btn ${userRating === true ? 'active' : ''}`}
        title="Понравилось"
      >
        {isLoading && userRating === true ? '⌛' : '+'}
      </button>
      
      <button
        onClick={() => handleRate(false)}
        disabled={isLoading}
        className={`rate-btn minus-btn ${userRating === false ? 'active' : ''}`}
        title="Не понравилось"
      >
        {isLoading && userRating === false ? '⌛' : '–'}
      </button>
      
      <span className="rating-value">⭐ {rating || 0}</span>
    </div>
  );
};