// controllers/InvoiceController.js
const db = require('../models')
const { generateInvoicePDF, sendInvoiceEmail } = require('../utils/functions/invoice')

const { invoices: Invoice, users: User } = db

async function saveInvoiceToDB({ description, scheduledDate, senderId, receiverEmail, items, country, address, zipcode }) {
  try {
    // Create a new invoice in the database
    const invoice = await Invoice.create({
      senderId,
      receiverEmail,
      items,
      description,
      receiverAddress: {
        country, address, zipcode
      },
      scheduledDate,
      status: 'pending' // Set initial status as 'pending'
    })

    return invoice // Return the invoice ID
  } catch (error) {
    console.error('Error saving invoice to database:', error)
    throw error
  }
}

async function sendInvoiceAsEmail(id) {
  try {
    // Fetch the invoice details from the database using the invoice ID
    const { senderId, receiverEmail, items, description, scheduledDate } = await Invoice.findByPk(id)

    const sender = await User.findByPk(senderId)
    console.log(sender)

    // Generate the PDF invoice and save it to a temporary location
    generateInvoicePDF(sender, receiverEmail, items, description, scheduledDate, (err, pdfFilePath) => {
      if (err) {
        console.error('Error generating invoice PDF:', err)
        throw err
      }

      // Send the email with the PDF attachment
      sendInvoiceEmail(receiverEmail, pdfFilePath)
        .then(() => {
          console.log('Invoice sent successfully')
        })
        .catch((err) => {
          console.error('Error sending email:', err)
          throw err
        })
    })
  } catch (error) {
    console.error('Error sending invoice as email:', error)
    throw error
  }
}

const InvoiceController = {
  createInvoice: async (req, res) => {
    try {
      // Save the invoice to the database and get the invoice ID
      const invoice = await saveInvoiceToDB(req.body)

      if (invoice.status !== 'draft') {
        // Send the invoice as an email attachment
        await sendInvoiceAsEmail(invoice.id)
      }

      res.status(200).json({ message: 'Invoice created and sent successfully.', data: invoice })
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating and sending the invoice.', error })
    }
  },

  updateInvoice: async (req, res) => {
    const { id } = req.params
    const { description, scheduledDate, items, country, zipcode, address, status } = req.body

    try {
      const invoice = await Invoice.findByPk(id)

      if (!invoice) {
        res.status(404).json({ error: 'Invoice not found' })
        return
      }

      await invoice.update({ description, scheduledDate, items, status, receiverAddress: { country, zipcode, address } })

      res.status(200).json(invoice)
    } catch (error) {
      console.error('Error updating invoice:', error)
      res.status(500).json({ error: 'Failed to update invoice' })
    }
  },

  getInvoice: async (req, res) => {
    const { id } = req.params

    try {
      const invoice = await Invoice.findByPk(id)

      if (!invoice) {
        res.status(404).json({ error: 'Invoice not found' })
        return
      }

      res.status(200).json(invoice)
    } catch (error) {
      console.error('Error getting invoice:', error)
      res.status(500).json({ error: 'Failed to get invoice' })
    }
  },

  deleteInvoice: async (req, res) => {
    const { id } = req.params

    try {
      const invoice = await Invoice.findByPk(id)

      if (!invoice) {
        res.status(404).json({ error: 'Invoice not found' })
        return
      }

      await invoice.destroy()

      res.json({ message: 'Invoice deleted successfully' })
    } catch (error) {
      console.error('Error deleting invoice:', error)
      res.status(500).json({ error: 'Failed to delete invoice' })
    }
  },

  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.findAll()

      res.status(200).json(invoices)
    } catch (error) {
      console.error('Error getting all invoices:', error)
      res.status(500).json({ error: 'Failed to get all invoices' })
    }
  },

  generateInvoice: async (req, res) => {
    // Get invoice data from the request body
    const { senderId, receiverEmail, items, description, scheduledDate } = req.body
    const sender = await User.findByPk(senderId)

    if (!sender) {
      return res.status(400).json({ error: 'User not found' })
    }

    // Generate the PDF invoice and save it to a temporary location
    generateInvoicePDF(sender, receiverEmail, items, description, scheduledDate, (err, pdfFilePath) => {
      if (err) {
        return res.status(500).json({ error: err, message: 'Failed to generate the invoice PDF.' })
      }

      // Send the email with the PDF attachment
      sendInvoiceEmail(receiverEmail, pdfFilePath)
        .then(() => {
          return res.json({ message: 'Invoice sent successfully.' })
        })
        .catch((err) => {
          console.error('Error sending email:', err)
          return res.status(500).json({ error: 'Failed to send the invoice email.' })
        })
    })
  }

}

module.exports = InvoiceController
