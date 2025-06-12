const sql = require("mssql")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const saltRounds = 10

// Настройка транспортера для отправки email
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "funnysite@bk.ru", // замените на ваш email
    pass: "8zinich-yuNonka3-nemchura", // замените на ваш пароль
  },
})

// Функция для отправки письма восстановления пароля
const sendForgotPasswordEmail = async (poolPromise, email) => {
  const pool = await poolPromise

  // Проверяем, существует ли пользователь с таким email
  const userResult = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT [IdUser], [Name] FROM [dbo].[Пользователь] WHERE [Email] = @email")

  if (userResult.recordset.length === 0) {
    throw new Error("USER_NOT_FOUND")
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
    from: "your-username@bk.ru",
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
            Восстано��ить пароль
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Ссылка действительна в течение 1 часа.
        </p>
        <p style="color: #666; font-size: 14px;">
          Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
  console.log(`Письмо для восстановления пароля отправлено на ${email}`)

  return { success: true, message: "Инструкции отправлены на email" }
}

// Функция для сброса пароля
const resetPassword = async (poolPromise, token, password) => {
  const pool = await poolPromise

  // Проверяем токен
  const tokenResult = await pool
    .request()
    .input("token", sql.NVarChar, token)
    .query(`
      SELECT [UserId] FROM [dbo].[PasswordResetTokens] 
      WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
    `)

  if (tokenResult.recordset.length === 0) {
    throw new Error("INVALID_TOKEN")
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

  console.log(`Пароль успешно изменен для пользователя ID: ${userId}`)
  return { success: true, message: "Пароль успешно изменен" }
}

// Функция для проверки валидности токена
const validateResetToken = async (poolPromise, token) => {
  const pool = await poolPromise

  const tokenResult = await pool
    .request()
    .input("token", sql.NVarChar, token)
    .query(`
      SELECT [UserId] FROM [dbo].[PasswordResetTokens] 
      WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
    `)

  if (tokenResult.recordset.length === 0) {
    return { valid: false, message: "Недействительный или истекший токен" }
  }

  return { valid: true }
}

module.exports = {
  sendForgotPasswordEmail,
  resetPassword,
  validateResetToken,
}
