const sql = require("mssql");
const bcrypt = require("bcrypt");

const dbConfig = {
  server: 'DESKTOP-97TS327\\MSSQLSERVER2',
  database: 'FunnySite',
  user: 'sa',
  password: '1234',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function hashPasswords() {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`SELECT IdUser, Password FROM Пользователь`);

    for (let row of result.recordset) {
      const { IdUser, Password } = row;

      if (Password.length >= 60 && Password.startsWith("$2")) {
        console.log(`⏭ Пропущен IdUser=${IdUser}, уже хеширован`);
        continue;
      }

      const hashed = await bcrypt.hash(Password, 10);

      await pool.request()
        .input("hash", sql.NVarChar, hashed)
        .input("id", sql.Int, IdUser)
        .query(`UPDATE Пользователь SET Password = @hash WHERE IdUser = @id`);

      console.log(`✅ Захеширован IdUser=${IdUser}`);
    }

    console.log("Готово.");
    sql.close();
  } catch (err) {
    console.error("❌ Ошибка:", err);
    sql.close();
  }
}

hashPasswords();
