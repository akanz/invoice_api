const Joi = require('joi')

const itemSchema = Joi.object({
  description: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required()
})

const invoiceSchema = Joi.object({
  description: Joi.string().required(),
  scheduledDate: Joi.date().required(),
  senderId: Joi.string().guid().required(),
  receiverEmail: Joi.string().required(),
  status: Joi.string().required(),
  address: Joi.string().required(),
  zipcode: Joi.string().required(),
  country: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required()
})

module.exports = invoiceSchema
