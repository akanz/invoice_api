// importing modules
const bcrypt = require('bcrypt')
const db = require('../models')
const jwt = require('jsonwebtoken')

// Assigning users to the variable User
const User = db.users

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.secret_key, {
    expiresIn: '1d'
  })
  return token
}
// signing a user up
// hashing users password before its saved to the database with bcrypt
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const data = {
      username,
      email,
      password: await bcrypt.hash(password, 10)
    }
    const findUser = await User.findAll({ where: { username } })
    console.log(findUser)
    if (findUser.length > 0) {
      return res.status(400).json({ status: 400, error: 'username taken' })
    }
    // saving the user
    const user = await User.create(data)

    // if user details is captured
    // generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      const token = generateToken(user)
      console.log(token)
      // send users details
      return res.status(201).json({ user, token })
    } else {
      return res.status(409).send('Details are not correct')
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: 'Failed to register user' })
  }
}

// login authentication
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // find a user by their email
    const user = await User.findOne({
      where: {
        email
      }

    })

    // if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password)

      // if password is the same
      // generate token with the user's id and the secretKey in the env file

      if (isSame) {
        const token = generateToken(user)
        console.log(token)
        // send user data
        return res.status(200).send({
          status: 200,
          message: 'Login successful',
          data: user,
          token
        })
      } else {
        return res.status(401).send({
          status: 400,
          message: 'Invalid email or password'
        })
      }
    } else {
      return res.status(401).send({
        status: 400,
        message: 'User does not exist'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Failed to login'
    })
  }
}

// reset password
const resetPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = User.findOne({ where: { email } })
    if (!user) {
      res.status(400).json({
        error: 'User not found'
      })
    }
    const resetToken = jwt.sign({ id: user.id }, process.env.secret_key, {
      expiresIn: '1h'
    })
    const resetTokenExpiration = new Date(
      Date.now() + 3600000 // 1 hour
    )
    // Update user with reset token and expiration
    user.resetToken = resetToken
    user.resetTokenExpiration = resetTokenExpiration
    await user.save()
    res.status(200).json({ message: 'Password reset token generated' })
  } catch (error) {
    console.error('Error generating reset token:', error)
    res.status(500).json({ error: 'Failed to generate reset token' })
  }
}

// update password
const updatePassword = async (req, res) => {
  const { resetToken, password } = req.body
  try {
    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpiration: { $gt: new Date() }
      }
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid or expired reset token' })
      return
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetToken = null
    user.resetTokenExpiration = null
    await user.save()

    res.status(200).json({ status: 200, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).json({ status: 500, error: 'Failed to update password' })
  }
}

module.exports = {
  register,
  login,
  resetPassword,
  updatePassword
}
