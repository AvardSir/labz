import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from './Header';

const AnecdoteGuessGame = () => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchQuestion = async () => {
    setSelected(null);
    setShowAnswer(false);
    const res = await axios.get('/api/guess-random');
    setQuestion(res.data);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleChoice = (choice) => {
    setSelected(choice);
    setShowAnswer(true);
  };

  if (!question) return <p>Загрузка...</p>;

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
        <Header/>
      <h2>Угадай концовку анекдота</h2>
      <p><strong>Начало:</strong> {question.beginning}</p>
      <ul>
        {question.options.map((opt, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <button
              onClick={() => handleChoice(opt)}
              disabled={showAnswer}
              style={{
                padding: '8px 12px',
                backgroundColor:
                  showAnswer && opt.isCorrect ? 'green' :
                  showAnswer && selected === opt ? 'red' : 'lightgray',
                color: showAnswer ? 'white' : 'black',
                width: '100%',
                textAlign: 'left',
              }}
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>

      {showAnswer && (
        <div style={{ marginTop: 20 }}>
          {selected?.isCorrect ? '🎉 Правильно!' : '❌ Неверно'}
          <br />
          <strong>Правильный ответ:</strong> {question.correct}
          <br />
          <button onClick={fetchQuestion} style={{ marginTop: 10 }}>▶️ Следующий анекдот</button>
        </div>
      )}
    </div>
  );
};

export default AnecdoteGuessGame;
