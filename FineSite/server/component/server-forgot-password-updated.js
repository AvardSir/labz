const express = require("express")
const sql = require("mssql")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

const app = express()
const saltRounds = 10

// Настройка транспортера для отправки email (добавьте в начало server.js)
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true, // true для 465 порта, false для других портов
  auth: {
    user: "your-username@bk.ru", // ваш email на bk.ru
    pass: "your-password", // ваш пароль от почты
  },
})

// Создаем poolPromise для подключения к базе данных
const poolPromise = new sql.ConnectionPool({
  user: "your-db-username",
  password: "your-db-password",
  server: "your-db-server",
  database: "your-db-name",
}).connect()

// API endpoint для восстановления пароля (добавьте в server.js)
app.post("/api/ForgotPassword", async (req, res) => {
  try {
    const { email } = req.body
    const pool = await poolPromise // используем ваш существующий poolPromise

    // Проверяем, существует ли пользователь с таким email
    const userResult = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT [IdUser], [Name] FROM [dbo].[Пользователь] WHERE [Email] = @email")

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: "Пользователь с таким email не найден" })
    }

    const user = userResult.recordset[0]

    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 час

    // Сохраняем токен в базе данных
    await pool
      .request()
      .input("userId", sql.Int, user.IdUser)
      .input("token", sql.NVarChar, resetToken)
      .input("expiry", sql.DateTime, resetTokenExpiry)
      .query(`
        INSERT INTO [dbo].[PasswordResetTokens] ([UserId], [Token], [ExpiryDate], [CreatedAt])
        VALUES (@userId, @token, @expiry, GETDATE())
      `)

    // Формируем ссылку для сброса пароля
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`

    // Отправляем email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Восстановление пароля - FunnySite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Восстановление пароля</h2>
          <p>Здравствуйте, <strong>${user.Name}</strong>!</p>
          <p>Вы запросили восстановление пароля для вашего аккаунта на FunnySite.</p>
          <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Восстановить пароль
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Ссылка действительна в течение 1 часа.
          </p>
          <p style="color: #666; font-size: 14px;">
            Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            Это автоматическое письмо, не отвечайте на него.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    console.log(`Письмо для восстановления пароля отправлено на ${email}`)
    res.status(200).json({ message: "Инструкции отправлены на email" })
  } catch (error) {
    console.error("Ошибка восстановления пароля:", error)
    res.status(500).json({ message: "Ошибка сервера" })
  }
})

// API endpoint для сброса пароля (добавьте в server.js)
app.post("/api/ResetPassword", async (req, res) => {
  try {
    const { token, password } = req.body
    const pool = await poolPromise // используем ваш существующий poolPromise

    // Проверяем токен
    const tokenResult = await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query(`
        SELECT [UserId] FROM [dbo].[PasswordResetTokens] 
        WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
      `)

    if (tokenResult.recordset.length === 0) {
      return res.status(400).json({ message: "Недействительный или истекший токен" })
    }

    const userId = tokenResult.recordset[0].UserId

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Обновляем пароль пользователя
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("password", sql.NVarChar, hashedPassword)
      .query("UPDATE [dbo].[Пользователь] SET [Password] = @password WHERE [IdUser] = @userId")

    // Помечаем токен как использованный
    await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query("UPDATE [dbo].[PasswordResetTokens] SET [Used] = 1 WHERE [Token] = @token")

    // Удаляем все старые токены для этого пользователя
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("DELETE FROM [dbo].[PasswordResetTokens] WHERE [UserId] = @userId AND [Used] = 1")

    console.log(`Пароль успешно изменен для пользователя ID: ${userId}`)
    res.status(200).json({ message: "Пароль успешно изменен" })
  } catch (error) {
    console.error("Ошибка сброса пароля:", error)
    res.status(500).json({ message: "Ошибка сервера" })
  }
})

// API endpoint для проверки валидности токена (добавьте в server.js)
app.get("/api/ValidateResetToken", async (req, res) => {
  try {
    const { token } = req.query
    const pool = await poolPromise

    const tokenResult = await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query(`
        SELECT [UserId] FROM [dbo].[PasswordResetTokens] 
        WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
      `)

    if (tokenResult.recordset.length === 0) {
      return res.status(400).json({ valid: false, message: "Недействительный или истекший токен" })
    }

    res.status(200).json({ valid: true })
  } catch (error) {
    console.error("Ошибка проверки токена:", error)
    res.status(500).json({ valid: false, message: "Ошибка сервера" })
  }
})

console.log("Добавьте этот код в ваш server.js файл")
