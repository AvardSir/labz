import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// import { AuthContext } from '../context/AuthContext'; // путь подстрой под свой
import { AuthContext } from './context/AuthContext';
import { Header } from './Header';
const Anecdoteator = () => {
  const [chainList, setChainList] = useState([]);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [parts, setParts] = useState([]);
  const [continueText, setContinueText] = useState('');
  const [startText, setStartText] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  const { loginData } = useContext(AuthContext); // ← используется для прав доступа

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
        fetchChainStatus(selectedChainId); // обновим статус
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
        AuthorId: loginData?.IdUser, // ← передаём ID пользователя
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
      await fetchChainStatus(selectedChainId); // обновим флаг
    } catch (e) {
      console.error('Ошибка закрытия цепочки', e);
    }
  };
const openChain = async () => {
  try {
    await axios.post(`/api/chain/${selectedChainId}/open`);
    await fetchChainStatus(selectedChainId); // обновим флаг
  } catch (e) {
    console.error('Ошибка открытия цепочки', e);
  }
};

  return (
    <div>
      <Header />
      <h2>Выберите цепочку</h2>
      <select
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

      <h3>Начать новую цепочку</h3>
      <textarea
        value={startText}
        onChange={e => setStartText(e.target.value)}
        placeholder="Введите начало анекдота"
        style={{ width: '100%' }}
      />
      <button onClick={createNewChain}>Создать</button>

      {selectedChainId && (
        <>
          <h3>Части анекдота</h3>
          <div style={{ background: '#eee', padding: 10 }}>
            {parts.map(p => (
              <p key={p.IdPart}>{p.Text}</p>
            ))}
          </div>

          {isClosed ? (
  <div>
    {loginData?.IdRights == 2 && (
      <div style={{ marginTop: 20 }}>
        <button
          onClick={deleteChain}
          style={{ background: 'darkred', color: 'white', marginLeft: 10 }}
        >
          🗑 Удалить цепочку
        </button>
        <button
          onClick={openChain}
          style={{ background: 'green', color: 'white', marginLeft: 10 }}
        >
          🔓 Открыть цепочку
        </button>
      </div>
    )}

              <p style={{ color: 'red' }}>❌ Цепочка закрыта для продолжения</p>
            </div>
            
          ) : (
            <>
              <textarea
                placeholder="Продолжить анекдот..."
                value={continueText}
                onChange={e => setContinueText(e.target.value)}
                style={{ width: '100%', marginTop: 10 }}
              />
              <button onClick={addContinue}>Добавить продолжение</button>
            </>
          )}

          {loginData?.IdRights == 2 && !isClosed && (
            <div style={{ marginTop: 20 }}>
              <button
                onClick={deleteChain}
                style={{ background: 'darkred', color: 'white', marginLeft: 10 }}
              >
                🗑 Удалить цепочку
              </button>
              <button onClick={closeChain} style={{ background: 'darkred', color: 'white' }}>
                ❌ Закрыть анекдот
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Anecdoteator;
