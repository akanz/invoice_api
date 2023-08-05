// importing modules
const express = require('express')
const AuthController = require('../controllers/AuthController')
const { register, login } = AuthController
const AuthMiddleware = require('../middlewares/AuthMiddleware')
const validationMiddleware = require('../middlewares/validationMiddleware')
const { loginSchema, registerSchema } = require('../utils/schemas')

const router = express.Router()

// register endpoint
// passing the middleware function to the register
router.post('/register', validationMiddleware(registerSchema), AuthMiddleware.saveUser, register)

// login route
router.post('/login', validationMiddleware(loginSchema), login)

module.exports = router
