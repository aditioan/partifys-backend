const express = require('express')
var request = require('request')
const connectDB = require('./config/db')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
var querystring = require('querystring')
const Room = require('./models/Room')
const axios = require('axios')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

var client_id = '132372e0dac54dbba8fcc9204e3d24ff' // Your client id
var client_secret = 'bf6346f4d4c54012b380480a2aa1dc21' // Your secret
var redirect_uri = 'http://localhost:3000/callback/' // Your redirect uri

app.use(cors())

//init middleware
app.use(
  express.json({
    extended: false,
  })
)

//connect database
connectDB()

//define routes
app.use('/room', require('./routes/room'))

io.on('connection', (socket) => {
  console.log('User connected')

  socket.on('changedList', () => {
    //console.log(playlistId)
    io.emit('refreshList')
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.post('/room_info', (req, res) => {
  console.log(req)
  res.json({ msg: 'server has got the room info' })
})

app.get('/', (req, res) => {
  res.json({
    msg: 'This is a test 732 test server.',
  })
})

app.get('/search/previous_page', async (req, res) => {
  //todo: token validation
  const room = req.query.room
  const previous_url = decodeURIComponent(req.query.previous)
  const roomFind = await Room.findOne({ number: room })

  const spotifyRes = await axios.get(previous_url, {
    headers: {
      Authorization: 'Bearer ' + roomFind.access_token,
    },
  })
  res.send(spotifyRes.data.tracks)
})

app.get('/search/next_page', async (req, res) => {
  //todo: token validation
  const room = req.query.room
  const next_url = decodeURIComponent(req.query.next)
  const roomFind = await Room.findOne({ number: room })

  const spotifyRes = await axios.get(next_url, {
    headers: {
      Authorization: 'Bearer ' + roomFind.access_token,
    },
  })
  res.send(spotifyRes.data.tracks)
})

app.get('/search', async (req, res) => {
  //todo: token validation
  const keyword = req.query.keyword
  const room = req.query.room
  console.log(room)
  console.log(keyword)
  const roomFind = await Room.findOne({ number: room })
  console.log(roomFind.access_token)

  const searchString = `https://api.spotify.com/v1/search?q=${keyword}&type=track&limit=20`
  const spotifyRes = await axios.get(searchString, {
    headers: {
      Authorization: 'Bearer ' + roomFind.access_token,
    },
  })

  res.send(spotifyRes.data.tracks)
})

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log('I am here')
  var code = req.query.code || null
  console.log(code)
  //var state = req.query.state || null
  //var storedState = req.cookies ? req.cookies[stateKey] : null

  // if (state === null || state !== storedState) {
  //   res.redirect(
  //     '/#' +
  //       querystring.stringify({
  //         error: 'state_mismatch',
  //       })
  //   )
  // } else

  {
    //res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    }

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        }

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        // res.redirect(
        //   redirect_uri +
        //     '?' +
        //     querystring.stringify({
        //       access_token: access_token,
        //       refresh_token: refresh_token,
        //     })
        res.json({
          access_token: access_token,
          refresh_token: refresh_token,
        })
      } else {
        // res.redirect(
        //   redirect_uri +
        //     '?' +
        //     querystring.stringify({
        //       error: 'invalid_token',
        //     })
        // )
        res.json({
          error: 'invalid_token',
        })
      }
    })
  }
})

const PORT = 3001 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
