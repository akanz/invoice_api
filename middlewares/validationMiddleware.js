const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)

    if (error) {
      // Handle validation error
      console.log(error.message)

      res.status(400).json({ errors: error.details[0] })
    } else {
      // Data is valid, proceed to the next middleware
      next()
    }
  }
}

module.exports = validationMiddleware
