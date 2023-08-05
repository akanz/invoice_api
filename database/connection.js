// database/connection.js
const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

// Database connection with dialect of postgres specifying the database we are using
// port for my database is 5433
// database name is discover
const sequelize = new Sequelize(process.env.db_name, process.env.db_user, process.env.db_password, {
  host: process.env.db_host,
  dialect: 'postgres'
})

module.exports = sequelize
