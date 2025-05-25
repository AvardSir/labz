import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Header } from './Header';
import { AuthContext } from './context/AuthContext';

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
        AuthorId: 1, // TODO: заменить на текущего пользователя
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
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <Header />
      <h2>Угадай концовку анекдота</h2>

      {question ? (
        <>
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
              <button onClick={fetchQuestion} style={{ marginTop: 10, marginRight: 10 }}>
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
                >
                  🗑️ Удалить анекдот
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Загрузка...</p>
      )}

      <hr style={{ margin: '40px 0' }} />
      <h3>Добавить свой анекдот</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          placeholder="Начало анекдота"
          value={newBeginning}
          onChange={e => setNewBeginning(e.target.value)}
        />
        <textarea
          placeholder="Правильный конец"
          value={newCorrect}
          onChange={e => setNewCorrect(e.target.value)}
        />
        <textarea
          placeholder="Неверная концовка 1"
          value={newFake1}
          onChange={e => setNewFake1(e.target.value)}
        />
        <textarea
          placeholder="Неверная концовка 2"
          value={newFake2}
          onChange={e => setNewFake2(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSubmit}>➕ Добавить</button>
          <button
            onClick={() => {
              setNewBeginning('');
              setNewCorrect('');
              setNewFake1('');
              setNewFake2('');
              setSubmitMessage('');
            }}
            style={{ backgroundColor: '#f44336', color: 'white' }}
          >
            🗑 Очистить всё
          </button>
        </div>
        {submitMessage && <p>{submitMessage}</p>}
      </div>
    </div>
  );
};

export default AnecdoteGuessGame;
