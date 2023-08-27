// routes/invoiceRoutes.js
const express = require('express')
const router = express.Router()
const InvoiceController = require('../controllers/InvoiceController')
const { authenticateUser } = require('../middlewares/AuthMiddleware')
const validationMiddleware = require('../middlewares/validationMiddleware')
const { invoiceSchema } = require('../utils/schemas')

// Create a new invoice
router.post('/', validationMiddleware(invoiceSchema), authenticateUser, InvoiceController.createInvoice)

// Update an existing invoice
router.patch('/:id', authenticateUser, InvoiceController.updateInvoice)

// Get details of a specific invoice
router.get('/:id', authenticateUser, InvoiceController.getInvoice)

// Delete an existing invoice
router.delete('/:id', authenticateUser, InvoiceController.deleteInvoice)

// Get all invoice transactions
router.get('/', InvoiceController.getAllInvoices)

router.post('/generate', authenticateUser, InvoiceController.generateInvoice)

module.exports = router
