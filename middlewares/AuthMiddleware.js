// middleware/AuthMiddleware.js
const db = require('../models')
const jwt = require('jsonwebtoken')

// Assigning db.users to User variable
const User = db.users

// Function to check if username or email already exist in the database
// this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
  // search the database to see if user exist
  try {
    const username = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    // if username exist in the database respond with a status of 409
    if (username) {
      return res.status(409).send({
        status: 400,
        message: 'username already exists'
      })
    }

    // checking if email already exist
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    // if email exist in the database respond with a status of 409
    if (emailcheck) {
      return res.status(409).send({
        status: 400,
        message: 'email already exists'
      })
    }

    next()
  } catch (error) {
    console.log(error)
  }
}

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  jwt.verify(token, process.env.secret_key, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ error: err, message: 'Invalid token' })
      return
    }

    req.user = decodedToken
    next()
  })
}

// exporting module
module.exports = {
  saveUser,
  authenticateUser
}
