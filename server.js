const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require("cors");
const db = require('./models');
const { userRoutes, invoiceRoutes, profileRoutes } = require('./routes');
const { items: Item, invoices: Invoice, users: User, accounts: Account } = db

const PORT = process.env.PORT || 8000

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

Invoice.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Invoice.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
// Invoice.hasMany(Item, { foreignKey: 'invoiceId', as: 'items' });
// Item.belongsTo(Invoice, { foreignKey: 'invoiceId' });
User.hasOne(Account, { foreignKey: 'userId', as: 'account' });
Account.belongsTo(User, { foreignKey: 'userId' });

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})

app.get('/', (req, res) => {
    console.log('API server reached')
    res.status(200).send('API server reached')
})

//routes for the auth API
app.use('/auth', userRoutes)

//routes for the invoice API
app.use('/invoice', invoiceRoutes)

app.use('/profile', profileRoutes)


//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))