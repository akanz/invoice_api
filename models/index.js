// model/Index.js
const { Sequelize } = require('sequelize')
const sequelize = require('../database/connection')

// checking if connection is done
const runSequel = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

runSequel()
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// connecting to model
db.users = require('./user')(sequelize)
db.invoices = require('./invoice')(sequelize)
// db.items = require('./item')(sequelize)
db.accounts = require('./account')(sequelize)

// exporting the module
module.exports = db
