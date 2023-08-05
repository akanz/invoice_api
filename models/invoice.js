const { DataTypes } = require('sequelize')

// models/Invoice.js
module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    receiverEmail: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true, // checks for email format
      allowNull: false
    },
    // receiverId: {
    //   type: DataTypes,
    //   allowNull: true,
    //   references: {
    //     model: 'Users',
    //     key: 'id'
    //   }
    // },
    receiverAddress: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    items: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false
    }
  })
  // Invoice.associate = (models) => {
  //   Invoice.hasMany(models.Item, { as: 'items' })
  // }
  return Invoice
}
