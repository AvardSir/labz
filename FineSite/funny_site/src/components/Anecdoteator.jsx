import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { Header } from './Header';
// import './Anecdoteator.css';

const Anecdoteator = () => {
  const [chainList, setChainList] = useState([]);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [parts, setParts] = useState([]);
  const [continueText, setContinueText] = useState('');
  const [startText, setStartText] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const { loginData } = useContext(AuthContext);


  const fetchChainList = async () => {
    try {
      const res = await axios.get('/api/chain/list');
      setChainList(res.data);
    } catch (e) {
      console.error('Ошибка загрузки цепочек', e);
    }
  };

  const fetchChainStatus = async (id) => {
    try {
      const res = await axios.get(`/api/chain/${id}/status`);
      setIsClosed(res.data.isClosed);
    } catch (e) {
      console.error('Ошибка получения статуса цепочки', e);
    }
  };

  useEffect(() => {
    fetchChainList();
  }, []);

  useEffect(() => {
    if (!selectedChainId) return;
    const fetchParts = async () => {
      try {
        const res = await axios.get(`/api/chain/${selectedChainId}/parts`);
        setParts(res.data);
        fetchChainStatus(selectedChainId);
      } catch (e) {
        console.error('Ошибка загрузки частей цепочки', e);
      }
    };
    fetchParts();
  }, [selectedChainId]);

  const addContinue = async () => {
    if (!selectedChainId || isClosed) return;
    const lastPartId = parts.length ? parts[parts.length - 1].IdPart : null;
    try {
      await axios.post('/api/chain/continue', {
        ChainId: selectedChainId,
        ParentId: lastPartId,
        Text: continueText,
      });
      setContinueText('');
      const res = await axios.get(`/api/chain/${selectedChainId}/parts`);
      setParts(res.data);
    } catch (e) {
      console.error('Ошибка добавления продолжения', e);
    }
  };

  const deleteChain = async () => {
    if (!selectedChainId) return;
    if (!window.confirm('Вы точно хотите удалить эту цепочку? Это действие нельзя отменить.')) return;
    try {
      await axios.delete(`/api/chain/${selectedChainId}`);
      setSelectedChainId(null);
      await fetchChainList();
      setParts([]);
      setIsClosed(false);
    } catch (e) {
      console.error('Ошибка удаления цепочки', e);
    }
  };

  const createNewChain = async () => {
    if (!startText.trim()) return;
    try {
      const res = await axios.post('/api/chain/start', {
        Text: startText.trim(),
        AuthorId: loginData?.IdUser,
      });
      const newId = res.data.ChainId;
      setStartText('');
      await fetchChainList();
      setSelectedChainId(newId);
    } catch (e) {
      console.error('Ошибка создания новой цепочки', e);
    }
  };

  const closeChain = async () => {
    try {
      await axios.post(`/api/chain/${selectedChainId}/close`);
      await fetchChainStatus(selectedChainId);
    } catch (e) {
      console.error('Ошибка закрытия цепочки', e);
    }
  };

  const openChain = async () => {
    try {
      await axios.post(`/api/chain/${selectedChainId}/open`);
      await fetchChainStatus(selectedChainId);
    } catch (e) {
      console.error('Ошибка открытия цепочки', e);
    }
  };

  return (
    <div className="anecdoteator-container">
      <Header />
      <div className="anecdoteator-form">
        <h2 className="anecdoteator-title">
Анекдотатор
</h2>

        <div className="anecdoteator-section">
          <label className="anecdoteator-label">Выберите цепочку:</label>
          <select
            className="anecdoteator-select"
            value={selectedChainId || ''}
            onChange={e => setSelectedChainId(Number(e.target.value) || null)}
          >
            <option value="">-- Выберите цепочку --</option>
            {chainList.map(chain => (
              <option key={chain.ChainId} value={chain.ChainId}>
                #{chain.ChainId}: {chain.StartText}
              </option>
            ))}
          </select>
        </div>

        <div className="anecdoteator-section">
          <label className="anecdoteator-label">Начать новую цепочку:</label>
          <textarea
            value={startText}
            onChange={e => setStartText(e.target.value)}
            placeholder="Введите начало анекдота"
            className="anecdoteator-textarea"
          />
          <button className="anecdoteator-button" onClick={createNewChain}>Создать</button>
        </div>

        {selectedChainId && (
          <div className="anecdoteator-section">
            <h3 className="anecdoteator-title">Части анекдота</h3>
            {parts.map(p => (
              <div key={p.IdPart} className="anecdoteator-part">{p.Text}</div>
            ))}

            {isClosed ? (
              <>
                <p className="anecdoteator-closed-note">❌ Цепочка закрыта для продолжения</p>
                {loginData?.IdRights == 2 && (
                  <div className="anecdoteator-button-group">
                    <button
                      className="anecdoteator-button anecdoteator-danger-button"
                      onClick={deleteChain}
                    >
                      🗑️ Удалить цепочку
                    </button>
                    <button
                      className="anecdoteator-button anecdoteator-green-button"
                      onClick={openChain}
                    >
                      🔓 Открыть цепочку
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <label className="anecdoteator-label">Продолжить анекдот:</label>
                <textarea
                  value={continueText}
                  onChange={e => setContinueText(e.target.value)}
                  placeholder="Продолжите анекдот..."
                  className="anecdoteator-textarea"
                />
                <button className="anecdoteator-button" onClick={addContinue}>Добавить продолжение</button>

                {loginData?.IdRights == 2 && (
                  <div className="anecdoteator-button-group">
                    <button
                      className="anecdoteator-button anecdoteator-danger-button"
                      onClick={deleteChain}
                    >
                      🗑 Удалить цепочку
                    </button>
                    <button
                      className="anecdoteator-button anecdoteator-danger-button"
                      onClick={closeChain}
                    >
                      ❌ Закрыть анекдот
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Anecdoteator;
