const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name : {
    type :String,
    required :true
  },
  isHost:{
      type:Boolean,
      default : false
  },
  rooms:[{
    room:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'room'
    }
  }]
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
