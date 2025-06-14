const sql = require("mssql");
const fs = require("fs");

// Настройки подключения к БД
const config = {
  server: 'DESKTOP-97TS327\\MSSQLSERVER2',
  database: 'FunnySite',
  user: 'sa',
  password: '1234',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Возвращает случайное целое от min до max (включительно)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Возвращает дату между двумя датами, равномерно распределённую
function generateDistributedDates(startDate, endDate, count) {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const step = (end - start) / count;

  return Array.from({ length: count }, (_, i) => new Date(start + step * i));
}

async function insertAnecdotes() {
  try {
    const pool = await sql.connect(config);

    const fileContent = fs.readFileSync("anek_djvu.txt", "utf-8");

    const anecdotes = fileContent
      .split("<|startoftext|>")
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .slice(0, 40);

    const dates = generateDistributedDates(
      new Date("2025-01-01"),
      new Date("2025-03-03"),
      anecdotes.length
    );

    for (let i = 0; i < anecdotes.length; i++) {
      const text = anecdotes[i];
      const date = dates[i];
      const rate = randomInt(5, 15);
      const idUser = randomInt(1, 5);
      const idType = randomInt(1, 5);

      await pool.request()
        .input("Text", sql.NVarChar(sql.MAX), text)
        .input("Date", sql.DateTime, date)
        .input("Rate", sql.Int, rate)
        .input("IdUser", sql.Int, idUser)
        .input("IdTypeAnecdote", sql.Int, idType)
        .query(`
          INSERT INTO [Анекдот] ([Text], [Date], [Rate], [IdUser], [IdTypeAnecdote])
          VALUES (@Text, @Date, @Rate, @IdUser, @IdTypeAnecdote)
        `);
    }

    console.log("✅ Успешно добавлены 40 анекдотов с рандомизированными значениями.");
    sql.close();
  } catch (err) {
    console.error("❌ Ошибка при вставке:", err);
    sql.close();
  }
}

insertAnecdotes();
