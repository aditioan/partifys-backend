const mongoose = require('mongoose')

const connectDB = (dbURI) => {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('mongoDB connected')
    })
    .catch((err) => {
      console.error(err.message)
      process.exit(1)
    })
}

module.exports = connectDB