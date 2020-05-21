const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  partyId: String,
  role: String,
  connectionId: String,
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', UserSchema, 'user')
