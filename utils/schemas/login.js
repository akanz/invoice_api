//* validators/login.validator.js
const Joi = require('joi')

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
})

module.exports = loginSchema
