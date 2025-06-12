const express = require("express")
const { sendForgotPasswordEmail, resetPassword, validateResetToken } = require("./forgotPasswordModule")

const router = express.Router()

// API endpoint для восстановления пароля
router.post("/ForgotPassword", async (req, res) => {
  try {
    const { email } = req.body

    // Получаем пул из Promise
    const pool = await req.app.locals.pool

    const result = await sendForgotPasswordEmail(pool, email)
    res.status(200).json(result)
  } catch (error) {
    console.error("Ошибка восстановления пароля:", error)

    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Пользователь с таким email не найден" })
    }

    res.status(500).json({ message: "Ошибка сервера" })
  }
})

// API endpoint для сброса пароля
router.post("/ResetPassword", async (req, res) => {
  try {
    const { token, password } = req.body

    // Получаем пул из Promise
    const pool = await req.app.locals.pool

    const result = await resetPassword(pool, token, password)
    res.status(200).json(result)
  } catch (error) {
    console.error("Ошибка сброса пароля:", error)

    if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({ message: "Недействительный или истекший токен" })
    }

    res.status(500).json({ message: "Ошибка сервера" })
  }
})

// API endpoint для проверки валидности токена
router.get("/ValidateResetToken", async (req, res) => {
  try {
    const { token } = req.query

    // Получаем пул из Promise
    const pool = await req.app.locals.pool

    const result = await validateResetToken(pool, token)
    res.status(200).json(result)
  } catch (error) {
    console.error("Ошибка проверки токена:", error)
    res.status(500).json({ valid: false, message: "Ошибка сервера" })
  }
})

module.exports = router
