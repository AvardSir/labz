import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { AuthContext } from './context/AuthContext';
// import './AnecdoteGuessGame.css';

const AnecdoteGuessGame = () => {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { loginData } = useContext(AuthContext);

  // Для формы добавления анекдота
  const [newBeginning, setNewBeginning] = useState('');
  const [newCorrect, setNewCorrect] = useState('');
  const [newFake1, setNewFake1] = useState('');
  const [newFake2, setNewFake2] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchQuestion = async () => {
    setSelected(null);
    setShowAnswer(false);
    try {
      const res = await axios.get('/api/guess-random');
      setQuestion(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке вопроса', err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleChoice = (choice) => {
    setSelected(choice);
    setShowAnswer(true);
  };

  const handleSubmit = async () => {
    if (!newBeginning || !newCorrect || !newFake1.trim() || !newFake2.trim()) {
      setSubmitMessage('Заполни все поля!');
      return;
    }
    try {
      const res = await axios.post('/api/guess-add', {
        Beginning: newBeginning,
        RealEnding: newCorrect,
        Fake1: newFake1.trim(),
        Fake2: newFake2.trim(),
        AuthorId: loginData?.IdUser || 1,
      });
      setSubmitMessage(res.data.message);
      setNewBeginning('');
      setNewCorrect('');
      setNewFake1('');
      setNewFake2('');
    } catch (err) {
      console.error(err);
      setSubmitMessage('Ошибка при добавлении');
    }
  };

  return (
    <div className="anecdote-guess-container">
      <Header />
      <div className="anecdote-guess-form">
        <h2 className="anecdote-guess-title">Угадай концовку анекдота</h2>

        {question ? (
          <>
            <div className="anecdote-guess-question">
              <p><strong>Начало:</strong> {question.beginning}</p>
            </div>
            <ul className="anecdote-guess-option-list">
              {question.options.map((opt, i) => (
                <li key={i} className="anecdote-guess-option-item">
                  <button
                    onClick={() => handleChoice(opt)}
                    disabled={showAnswer}
                    className={`anecdote-guess-option-button ${
                      showAnswer && opt.isCorrect ? 'anecdote-guess-green-button' :
                      showAnswer && selected === opt ? 'anecdote-guess-red-button' : ''
                    }`}
                  >
                    {opt.text}
                  </button>
                </li>
              ))}
            </ul>

            {showAnswer && (
              <div>
                <p>{selected?.isCorrect ? '🎉 Правильно!' : '❌ Неверно'}</p>
                <p><strong>Правильный ответ:</strong> {question.correct}</p>
                <div className="anecdote-guess-button-group">
                  <button 
                    onClick={fetchQuestion} 
                    className="anecdote-guess-button"
                  >
                    ▶️ Следующий анекдот
                  </button>
                  {loginData?.IdRights == 2 && (
                    <button
                      onClick={async () => {
                        if (window.confirm('Удалить этот анекдот?')) {
                          try {
                            await axios.delete(`/api/guess-delete/${question.id}`);
                            fetchQuestion();
                          } catch (err) {
                            alert('Ошибка при удалении');
                            console.error(err);
                          }
                        }
                      }}
                      className="anecdote-guess-button anecdote-guess-danger-button"
                    >
                      🗑️ Удалить анекдот
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Загрузка...</p>
        )}

        <hr className="anecdote-guess-divider" />
        <h3 className="anecdote-guess-title">Добавить свой анекдот</h3>
        <div>
          <textarea
            placeholder="Начало анекдота"
            value={newBeginning}
            onChange={e => setNewBeginning(e.target.value)}
            className="anecdote-guess-textarea"
          />
          <textarea
            placeholder="Правильный конец"
            value={newCorrect}
            onChange={e => setNewCorrect(e.target.value)}
            className="anecdote-guess-textarea"
          />
          <textarea
            placeholder="Неверная концовка 1"
            value={newFake1}
            onChange={e => setNewFake1(e.target.value)}
            className="anecdote-guess-textarea"
          />
          <textarea
            placeholder="Неверная концовка 2"
            value={newFake2}
            onChange={e => setNewFake2(e.target.value)}
            className="anecdote-guess-textarea"
          />
          <div className="anecdote-guess-button-group">
            <button 
              onClick={handleSubmit}
              className="anecdote-guess-button"
            >
              ➕ Добавить
            </button>
            <button
              onClick={() => {
                setNewBeginning('');
                setNewCorrect('');
                setNewFake1('');
                setNewFake2('');
                setSubmitMessage('');
              }}
              className="anecdote-guess-button anecdote-guess-danger-button"
            >
              🗑 Очистить всё
            </button>
          </div>
          {submitMessage && (
            <div className={`anecdote-guess-message ${
              submitMessage.includes('Ошибка') ? 'anecdote-guess-error-message' : 'anecdote-guess-success-message'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnecdoteGuessGame;