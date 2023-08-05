const db = require('./models')

const dropTable = async () => {
  try {
    const res = await db.invoices.drop()
    console.log(res)
  } catch (error) {
    console.log(`Error ${error} occurred`)
  }
}

dropTable()
