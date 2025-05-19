fetch('/api/anecdotes')
  .then(async (res) => {
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      setAnecdotes(foundAnecdote);
    } catch (err) {
      console.error("Ошибка при парсинге JSON:", text);
    }
  })
  .catch(err => {
    console.error("Ошибка сети или сервера:", err);
  });
