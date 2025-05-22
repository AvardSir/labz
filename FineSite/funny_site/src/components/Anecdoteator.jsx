import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Anecdoteator = () => {
  const [chainList, setChainList] = useState([]);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [parts, setParts] = useState([]);
  const [continueText, setContinueText] = useState('');

  useEffect(() => {
  const fetchChainList = async () => {
    try {
      const res = await axios.get('/api/chain/list');
      console.log('res::: ', res);
      console.log('🧪 chainList от сервера:', res.data);
      setChainList(res.data);
    } catch (e) {
      console.error('❌ Ошибка загрузки цепочек', e);
    }
  };
  fetchChainList();

}, []);


  // Получить части выбранной цепочки
  useEffect(() => {
    if (!selectedChainId) return;
    const fetchParts = async () => {
      try {
        const res = await axios.get(`/api/chain/${selectedChainId}/parts`);
        setParts(res.data);
      } catch (e) {
        console.error('Ошибка загрузки частей цепочки', e);
      }
    };
    fetchParts();
  }, [selectedChainId]);

  // Добавить продолжение
  const addContinue = async () => {
  if (!selectedChainId) return alert('Выберите цепочку!');
  try {
    const lastPartId = parts.length ? parts[parts.length - 1].IdPart : null;
    await axios.post('/api/chain/continue', {
  ChainId: selectedChainId,
  ParentId: lastPartId,
  Text: continueText,  // обязательно с заглавной T, как в APIconsole.log('::: ', );
});

    setContinueText('');
    const res = await axios.get(`/api/chain/${selectedChainId}/parts`);
    setParts(res.data);
  } catch (e) {
    console.error('Ошибка добавления продолжения', e);
  }
};

  return (
    <div>
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

      {selectedChainId && (
        <>
          <h3>Части анекдота</h3>
          <div>
            {parts.map(p => (
              <p key={p.IdPart}>{p.Text}</p>
            ))}
          </div>

          <textarea
            placeholder="Продолжить анекдот..."
            value={continueText}
            onChange={e => setContinueText(e.target.value)}
          />
          <button onClick={addContinue}>Добавить продолжение</button>
        </>
      )}
    </div>
  );
};

export default Anecdoteator;
