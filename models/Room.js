const mongoose = require('mongoose')

const trackSchema = mongoose.Schema({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
})

const RoomSchema = mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  playlist_id: {
    type: String,
    required: true,
  },
  tracks: [trackSchema],
  expire_date: {
    //spotify will expire the token after 60 minutes
    //we set a expire date of 45 minutes here
    type: Date,
    default: () => Date.now() + 45 * 60 * 1000,
  },
})

module.exports = mongoose.model('room', RoomSchema)
