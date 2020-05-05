const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  ownername: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  spotify_id: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Date,
  },
});

module.exports = mongoose.model("room", RoomSchema);
