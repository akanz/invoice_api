// routes/invoiceRoutes.js
const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, deleteAccount } = require('../controllers/ProfileController')
const { authenticateUser } = require('../middlewares/AuthMiddleware')
const validationMiddleware = require('../middlewares/validationMiddleware')

router.get('/', authenticateUser, getProfile)
router.patch('/update', authenticateUser, updateProfile)
router.delete('/delete', authenticateUser, deleteAccount)

module.exports = router
