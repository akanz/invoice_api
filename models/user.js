// models/User.js
const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true, // checks for email format
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, { timestamps: true })
  return User
}
