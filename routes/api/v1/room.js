const express = require("express");
const router = express.Router();
const passport = require("passport");
const qs = require("querystring");
const Room = require("../../../models/Room");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const axios = require("axios");

const generateRandomNumber = (length) => {
  let text = "";
  const possible =
    //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    "0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: [
      "user-read-email",
      "playlist-modify-private",
      "playlist-modify-public",
    ],
    showDialog: true,
  }),
  function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);

router.post("/join",(req,res)=>{
  const {roomNumber} = req.body;
  console.log(roomNumber)

  Room.findOne({roomNumber:roomNumber}).then((room)=>{
    if(room){
      const details={
        owner:room.ownername,
        roomNumber:room.roomNumber
      }
     return res.status(200).json(details)
    }
    else{
      const errors={
        error: "No room available"
      }
      return res.status(404).json(errors)
    }
  })
  
})

router.post("/", async (req, res) => {
try {
  

  const { code, state } = req.body;
  
  //Get accesstoken
  const data = {
    code: code,
    redirect_uri: process.env.SPOTIFY_CLIENT_REDIRECT,
    grant_type: "authorization_code",
  };
  const url = "https://accounts.spotify.com/api/token";

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
  };
  let result = await fetchAccessToken(url, data, config);
  const meUrl = "https://api.spotify.com/v1/me";
  const userConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + result.data.access_token,
    },
  };

  let user = await getUser(meUrl, userConfig);
  

 await  Room.findOne({ spotify_id: user.id }).then((room) => {
    if (room) {
      let error = {};
      error.room = "Room already present";
      error.ownername = room.ownername;
      error.roomNumber = room.roomNumber;
      res.status(200).json(error);
      return;
    } else {
      const roomNumber = generateRandomNumber(4);
      let room = new Room({
        ownername: user.display_name,
        roomNumber: roomNumber,
        spotify_id: user.id,
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token,
        expires_in: Date.now(),
      });
      room.save();
      if (room.access_token !== "") {
        res.send(room);
      } else {
        res.json(result);
      }
    }
  });
} catch (error) {
  //console.log(error)
}
});

const fetchAccessToken = async (url, data, config) => {
  let result = await axios.post(url, qs.stringify(data), config);
  return result;
};

const refreshToken = async (url, refreshToken, config) => {
  const data = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  let result = await axios.post(url, qs.stringify(data), config);
  return result;
};

const getUser = async (url, config) => {
  let result = await axios.get(url, config);
  return result.data;
};



module.exports = router;
