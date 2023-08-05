// controllers/ItemController.js
const db = require('../models')

const { items: Item } = db

const ItemController = {
  createItem: async (req, res) => {
    const { description, price, quantity } = req.body

    try {
      const item = await Item.create({
        description,
        price,
        quantity
      })

      res.status(201).json(item)
    } catch (error) {
      console.error('Error creating item:', error)
      res.status(500).json({ error: 'Failed to create item' })
    }
  },

  updateItem: async (req, res) => {
    const { description, price, quantity, id } = req.body

    try {
      const item = await Item.findByPk(id)

      if (!item) {
        res.status(404).json({ error: 'item not found' })
        return
      }

      await item.update({ description, price, quantity })

      res.status(200).json(item)
    } catch (error) {
      console.error('Error updating invoice:', error)
      res.status(500).json({ error: 'Failed to update invoice' })
    }
  },

  deleteItem: async (req, res) => {
    const { id } = req.body

    try {
      const item = await Item.findByPk(id)

      if (!item) {
        res.status(404).json({ error: 'Item not found' })
        return
      }

      await item.destroy()

      res.json({ message: 'item deleted successfully' })
    } catch (error) {
      console.error('Error deleting item:', error)
      res.status(500).json({ error: 'Failed to delete item' })
    }
  }
}

module.exports = ItemController
