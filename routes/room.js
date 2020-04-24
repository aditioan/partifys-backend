const express = require('express')
const router = express.Router()
//const request = require('request')
const qs = require('querystring')

const Room = require('../models/Room')

const axios = require('axios')

var client_id = '132372e0dac54dbba8fcc9204e3d24ff' // Your client id
var client_secret = 'bf6346f4d4c54012b380480a2aa1dc21' // Your secret
var redirect_uri = 'http://localhost:3000/callback/' // Your redirect uri

const generateRandomNumber = (length) => {
  let text = ''
  const possible =
    //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    '0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const updateToken = async (refresh_token) => {
  // requesting access token from refresh token
  console.log('in the update token function...')
  const res = await axios({
    method: 'post',
    url: `https://accounts.spotify.com/api/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  })
  console.log('new token')
  console.log(res.data.access_token)
  return res.data.access_token
}

router.get('/tracks', async (req, res) => {
  const room = req.query.room

  const room_find = await Room.findOne({ number: room })

  res.send(room_find.tracks)
})

// @route   post /room
// @desc    create a new party room
// @access  public
router.post('/', async (req, res) => {
  const { access_token, refresh_token } = req.body

  //generate a random room number
  //with 4 digital
  let roomNumber
  let unique = false
  while (!unique) {
    roomNumber = generateRandomNumber(4)
    let exist = await Room.findOne({ number: roomNumber })
    if (!exist) {
      unique = true
    }
  }

  console.log('room number is ' + roomNumber)

  const partyHost = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  })

  const playlist = await axios({
    method: 'post',
    url: `https://api.spotify.com/v1/users/${partyHost.data.id}/playlists`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data: {
      //playlist name
      //can be changed by user later in an option/setting part
      name: 'my party playlist',
    },
  })

  const room = new Room({
    number: roomNumber,
    access_token,
    refresh_token,
    playlist_id: playlist.data.id,
  })

  await room.save()

  res.json({
    roomNumber: roomNumber,
    //playlist_id: playlist.data.id,
  })
})

// @route   post /room/join
// @desc    join an existed party room
// @access  public
router.post('/join', async (req, res) => {
  const { room } = req.body
  const exist = await Room.findOne({ number: room })

  if (exist) {
    res.json({
      //access_token: exist.access_token,
      //refresh_token: exist.refresh_token,
      roomNumber: exist.number,
      //playlistId: exist.playlist_id,
    })
  } else {
    res.json({
      error: 'invalid party code',
    })
  }
})

router.post('/add_track', async (req, res) => {
  const { room, uri, name, image } = req.body
  try {
    //because the tracks are the same in the database and actual playlist
    //we check the database to tell if it is a redundant track
    let track = await Room.findOne({ number: room, 'tracks.uri': uri })
    if (track) {
      return res.status(400).json({ msg: 'track already exists' })
    }

    //token validation
    let room_find = await Room.findOne({ number: room })
    let access_token = room_find.access_token
    const now = Date.now()

    if (now - room_find.expire_date >= 0) {
      access_token = await updateToken(room_find.refresh_token)

      await Room.findOneAndUpdate(
        { number: room },
        { access_token, expire_date: Date.now() + 45 * 60 * 1000 }
      )
    }

    //update party list
    room_find = await Room.findOne({ number: room })
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${room_find.playlist_id}/tracks`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + room_find.access_token,
      },
      data: {
        uris: [uri],
      },
    })

    //update database tracks so it is the same as tracks in the shared playlist

    room_find.tracks.push({
      uri: uri,
      name,
      image,
      votes: 0,
    })

    await Room.findOneAndUpdate({ number: room }, { tracks: room_find.tracks })

    res.json({ msg: 'track added' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
