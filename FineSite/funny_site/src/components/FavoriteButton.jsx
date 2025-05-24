import React, { useState } from 'react';
import axios from 'axios';

const FavoriteButton = ({ userId, anecdoteId }) => {
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState('❤️ Добавить в избранное');

  const checkFavoriteAndAdd = async () => {
    try {
      // Сначала проверяем, есть ли анекдот в избранном
      const res = await axios.get('/api/favorites/check', {
        params: { userId, anecdoteId }
      });

      if (res.data.exists) {
        // Если есть, просто меняем сообщение и блокируем кнопку
        setAdded(true);
        setMessage('Анекдот уже в избранном');
      } else {
        // Если нет — добавляем и меняем состояние
        await axios.post('/api/favorites/add', { userId, anecdoteId });
        setAdded(true);
        setMessage('Добавлено в избранное');
      }
    } catch (e) {
      // Ошибка при добавлении
      setMessage('Ошибка при добавлении в избранное');
      console.error(e);
    }
  };

  return (
    <button
      onClick={checkFavoriteAndAdd}
      disabled={added}
      style={{ padding: '6px 12px', cursor: added ? 'default' : 'pointer' }}
    >
      {message}
    </button>
  );
};

export default FavoriteButton;
