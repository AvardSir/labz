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
    pass: "QVywDI3M6hnHnb8eUdNt", // замените на ваш пароль
  },
})

// Функция для отправки письма восстановления пароля
const sendForgotPasswordEmail = async (pool, email) => {
  console.log(`🔍 Поиск пользователя с email: ${email}`)

  // Проверяем, существует ли пользователь с таким email
  const userResult = await pool
    .request()
    .input("email", sql.NVarChar, email)
    .query("SELECT [IdUser], [Name] FROM [dbo].[Пользователь] WHERE [Email] = @email")

  if (userResult.recordset.length === 0) {
    throw new Error("USER_NOT_FOUND")
  }

  const user = userResult.recordset[0]
  console.log(`👤 Найден пользователь: ID=${user.IdUser}, Name=${user.Name}`)

  // Генерируем токен для сброса пароля
  const resetToken = crypto.randomBytes(32).toString("hex")
  console.log(`🔑 Сгенерирован токен: ${resetToken}`)

  try {
    // АВТОМАТИЗАЦИЯ: Используем только SQL для всех временных вычислений
    // Это гарантирует единую временную зону
    const insertResult = await pool
      .request()
      .input("userId", sql.Int, user.IdUser)
      .input("token", sql.NVarChar, resetToken)
      .query(`
        INSERT INTO [dbo].[PasswordResetTokens] ([UserId], [Token], [ExpiryDate], [CreatedAt])
        VALUES (@userId, @token, DATEADD(HOUR, 1, GETDATE()), GETDATE())
      `)

    console.log(`💾 Токен сохранен в БД. Затронуто строк: ${insertResult.rowsAffected[0]}`)

    // Получаем созданную запись для подтверждения
    const verifyResult = await pool
      .request()
      .input("checkToken", sql.NVarChar, resetToken)
      .query(`
        SELECT 
          [ExpiryDate], 
          [CreatedAt],
          DATEDIFF(MINUTE, [CreatedAt], [ExpiryDate]) as DurationMinutes,
          DATEDIFF(MINUTE, GETDATE(), [ExpiryDate]) as MinutesLeft
        FROM [dbo].[PasswordResetTokens] 
        WHERE [Token] = @checkToken
      `)

    if (verifyResult.recordset.length > 0) {
      const tokenInfo = verifyResult.recordset[0]
      console.log(`✅ Токен создан успешно:`)
      console.log(`   Создан: ${tokenInfo.CreatedAt}`)
      console.log(`   Истекает: ${tokenInfo.ExpiryDate}`)
      console.log(`   Длительность: ${tokenInfo.DurationMinutes} минут`)
      console.log(`   Осталось: ${tokenInfo.MinutesLeft} минут`)
    }
  } catch (dbError) {
    console.error("❌ Ошибка сохранения токена в БД:", dbError)
    throw dbError
  }

  // Формируем ссылку для сброса пароля
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`

  // Отправляем email
  const mailOptions = {
    from: 'funnysite@bk.ru',
    to: email,
    subject: "🔐 Восстановление пароля - FunnySite",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Восстановление пароля</h2>
        <p>Здравствуйте, <strong>${user.Name}</strong>!</p>
        <p>Вы запросили восстановление пароля для вашего аккаунта на FunnySite.</p>
        <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; display: inline-block;
                    font-weight: bold; font-size: 16px;">
            🔐 Восстановить пароль
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
  console.log(`✅ Письмо отправлено на ${email}`)

  return { success: true, message: "Инструкции отправлены на email" }
}

// Функция для автоматической очистки истекших токенов
const cleanupExpiredTokens = async (pool) => {
  try {
    const cleanupResult = await pool.request().query(`
      DELETE FROM [dbo].[PasswordResetTokens] 
      WHERE [ExpiryDate] < GETDATE() OR [Used] = 1
    `)

    const deletedCount = cleanupResult.rowsAffected[0]
    if (deletedCount > 0) {
      console.log(`🧹 Очищено ${deletedCount} истекших/использованных токенов`)
    }

    return deletedCount
  } catch (error) {
    console.error("❌ Ошибка очистки токенов:", error)
    return 0
  }
}

// Функция для проверки валидности токена
const validateResetToken = async (pool, token) => {
  console.log(`🔍 Проверка токена: ${token}`)

  // Автоматически очищаем истекшие токены перед проверкой
  await cleanupExpiredTokens(pool)

  const tokenResult = await pool
    .request()
    .input("token", sql.NVarChar, token)
    .query(`
      SELECT 
        [UserId], 
        [ExpiryDate], 
        [Used], 
        [CreatedAt],
        DATEDIFF(MINUTE, GETDATE(), [ExpiryDate]) as MinutesLeft
      FROM [dbo].[PasswordResetTokens] 
      WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
    `)

  console.log(`🔍 Поиск активного токена: найдено ${tokenResult.recordset.length} записей`)

  if (tokenResult.recordset.length === 0) {
    console.log(`❌ Токен не найден, истек или уже использован`)
    return { valid: false, message: "Недействительный или истекший токен" }
  }

  const tokenData = tokenResult.recordset[0]
  console.log(`✅ Токен валиден. Осталось ${tokenData.MinutesLeft} минут`)

  return { valid: true }
}

// Функция для сброса пароля
const resetPassword = async (pool, token, password) => {
  console.log(`🔄 Сброс пароля для токена: ${token}`)

  // Проверяем токен и получаем UserId одним запросом
  const tokenResult = await pool
    .request()
    .input("token", sql.NVarChar, token)
    .query(`
      SELECT [UserId] FROM [dbo].[PasswordResetTokens] 
      WHERE [Token] = @token AND [ExpiryDate] > GETDATE() AND [Used] = 0
    `)

  if (tokenResult.recordset.length === 0) {
    console.log(`❌ Токен не валиден или истек`)
    throw new Error("INVALID_TOKEN")
  }

  const userId = tokenResult.recordset[0].UserId
  console.log(`👤 Сброс пароля для пользователя ID: ${userId}`)

  // Хешируем новый пароль
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Обновляем пароль пользователя
  const updateResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("password", sql.NVarChar, hashedPassword)
    .query("UPDATE [dbo].[Пользователь] SET [Password] = @password WHERE [IdUser] = @userId")

  console.log(`💾 Пароль обновлен. Затронуто строк: ${updateResult.rowsAffected[0]}`)

  // Помечаем токен как использованный
  const markUsedResult = await pool
    .request()
    .input("token", sql.NVarChar, token)
    .query("UPDATE [dbo].[PasswordResetTokens] SET [Used] = 1 WHERE [Token] = @token")

  console.log(`🔒 Токен помечен как использованный. Затронуто строк: ${markUsedResult.rowsAffected[0]}`)

  // Автоматически очищаем старые токены после успешного сброса
  await cleanupExpiredTokens(pool)

  return { success: true, message: "Пароль успешно изменен" }
}

module.exports = {
  sendForgotPasswordEmail,
  resetPassword,
  validateResetToken,
  cleanupExpiredTokens, // экспортируем для ручного вызова если нужно
}
