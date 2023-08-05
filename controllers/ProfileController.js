const db = require('../models')

// Assigning users to the variable User
const User = db.users

const getProfile = async (req, res) => {
  try {
    const { id } = req.user
    const user = await User.findByPk(id)

    if (!user) {
      res.status(400).json({ error: 'User not found' })
    }
    res.status(200).json({
      status: 200,
      user
    })
  } catch (error) {
    console.error('Error getting user profile:', error)
    res.status(500).json({ error: 'Failed to get user profile' })
  }
}

const updateProfile = async (req, res) => {
  const { id } = req.user

  try {
    const user = await User.findByPk(id)
    if (!user) {
      res.status(400).json({ error: 'User not found' })
    }
    user.update(req.body)

    await user.save()
    res.status(200).json({ message: 'Profile updated successfully', data: user })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Failed to update user profile' })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    await user.destroy()

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting user account:', error)
    res.status(500).json({ error: 'Failed to delete user account' })
  }
}

module.exports = {
  getProfile, updateProfile, deleteAccount
}
