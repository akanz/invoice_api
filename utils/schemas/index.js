//* validators/index.js
const registerSchema = require('./register')
const loginSchema = require('./login')
const invoiceSchema = require('./invoice')

module.exports = {
  registerSchema,
  loginSchema,
  invoiceSchema
}
