const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const moment = require('moment')
const puppeteer = require('puppeteer')
const handlebars = require('handlebars')

function generateInvoicePDF (sender, receiverEmail, items, description, scheduledDate, callback) {
  const templateFilePath = path.join(__dirname, '../../view', 'invoice_template.hbs')
  const pdfFilePath = path.join(__dirname, 'temp', 'invoice.pdf')

  fs.readFile(templateFilePath, 'utf-8', (err, templateContent) => {
    if (err) {
      console.error('Error reading template file:', err)
      return callback(err)
    }

    // Compile the Handlebars template
    const template = handlebars.compile(templateContent)

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    console.log(sender)
    // Generate the HTML content using the compiled template and invoice data
    const htmlContent = template({
      sender,
      receiverEmail,
      items,
      description,
      scheduledDate: moment(scheduledDate).format('dddd, MMMM Do YYYY, h:mm:ss'),
      totalPrice: totalPrice.toFixed(2)
    });

    (async () => {
      try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({
          headless: false
        })
        const page = await browser.newPage()

        // Generate PDF from the HTML content
        await page.setContent(htmlContent)
        await page.pdf({ path: pdfFilePath, format: 'A4', printBackground: true })

        await browser.close()

        console.log('Invoice PDF generated successfully:', pdfFilePath)
        callback(null, pdfFilePath)
      } catch (error) {
        console.error('Error generating invoice PDF:', error)
        callback(error)
      }
    })()
  })
}

function sendInvoiceEmail (receiverEmail, pdfFilePath) {
  // Configure nodemailer with your email service credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'samuelakanz@gmail.com',
      pass: process.env.GMAIL_PASS
    }
  })

  // Define email content
  const mailOptions = {
    from: 'samuelakanz@gmail.com',
    to: receiverEmail,
    subject: 'Invoice',
    text: 'Please find the attached invoice.',
    attachments: [{ filename: 'invoice.pdf', path: pdfFilePath }]
  }

  // Send the email
  return transporter.sendMail(mailOptions)
}

module.exports = {
  generateInvoicePDF, sendInvoiceEmail
}
