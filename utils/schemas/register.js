//* validators/register.validator.js
const Joi = require('joi')

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().min(1).required(),
  password: Joi.string().min(6).required()
})

module.exports = registerSchema
