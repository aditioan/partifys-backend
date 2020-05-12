import express from 'express';
import bodyParser from 'body-parser';
import index from './routes/index';
import path from 'path';
import fs from 'file-system';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import Io from 'socket.io';

const TokenService = require('./socket_server/services/Token')
const UserRepository = require('./socket_server/repositories/User')
const PartyRepository = require('./socket_server/repositories/Party')
const createEventBus = require('./socket_server/createEventBus')
const createCommandBus = require('./socket_server/createCommandBus')

const CreatePartyCommand = require('./socket_server/Commands/CreateParty/Command')
const DeletePartyCommand = require('./socket_server/Commands/DeleteParty/Command')
const JoinPartyCommand = require('./socket_server/Commands/JoinParty/Command')
const LeavePartyCommand = require('./socket_server/Commands/LeaveParty/Command')
const SendSignalingOfferCommand = require('./socket_server/Commands/SendSignalingOffer/Command')
const SendSignalingAnswerCommand = require('./socket_server/Commands/SendSignalingAnswer/Command')
const SendSignalingCandidateCommand = require('./socket_server/Commands/SendSignalingCandidate/Command')

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Setup Express
const app = express();
const port = process.env.PORT || 8080;
app.set('view engine', 'ejs');

const tokenService = new TokenService(process.env.JWT_SECRET)
const partyRepository = new PartyRepository()
const userRepository = new UserRepository()

// Setup body-parser
app.use(bodyParser.json({ extended: false }));

//connect to mongodb
// mongoose.connect('mongodb://localhost:27017/express_app', function() {
//         console.log('Connection has been made');
//     })
//     .catch(err => {
//         console.error('App starting error:', err.stack);
//         process.exit(1);
//     });

// Setup our routes. These will be served as first priority.
// Any request to /api will go through these routes.
app.use("/", index);

// fs.readdirSync('routes'+process.env.EXPRESS_API_VERSION).forEach(function (file) {
//     if(file.substr(-3) == '.js') {
//         const route = require('./routes'+ process.env.EXPRESS_API_VERSION + '/' + file)
//         route.controller(app)
//     }
// })


// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, "public")));

const server = http.Server(app)

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
server.listen(port, () => console.log(`App server listening on port ${port}!`));

const io = Io(server)

const container = {
    tokenService,
    partyRepository,
    userRepository,
    io
  }

const eventBus = createEventBus(container)
const commandBus = createCommandBus(Object.assign({}, container, { eventBus }))

//start listening on socket
io.on('connection', socket => {
    socket.__data = {}
  
    socket.on('party/create', async ({ party, code }, ack) => {
      const response = await commandBus.dispatch(
        new CreatePartyCommand(party, code, socket.id)
      )
  
      if (response.error) {
        ack(response.error.message)
      } else {
        socket.__data.role = 'host'
        socket.__data.partyId = response.value
  
        ack()
      }
    })
  
    socket.on('party/join', async ({ party, code, accessToken }, ack) => {
      const response = await commandBus.dispatch(
        new JoinPartyCommand(party, code, accessToken, socket.id)
      )
  
      if (response.error) {
        ack(response.error.message)
      } else {
        socket.__data.role = 'guest'
  
        ack(null, { accessToken: response.value })
      }
    })
  
    socket.on('signaling/offer', async ({ remoteId, description }) => {
      await commandBus.dispatch(
        new SendSignalingOfferCommand(socket.id, remoteId, description)
      )
    })
  
    socket.on('signaling/answer', async ({ remoteId, description }) => {
      await commandBus.dispatch(
        new SendSignalingAnswerCommand(socket.id, remoteId, description)
      )
    })
  
    socket.on('signaling/candidate', async ({ remoteId, candidate }) => {
      await commandBus.dispatch(
        new SendSignalingCandidateCommand(socket.id, remoteId, candidate)
      )
    })
  
    socket.on('disconnect', async () => {
      if (socket.__data.role === 'host') {
        await commandBus.dispatch(new DeletePartyCommand(socket.__data.partyId))
      } else if (socket.__data.role === 'guest') {
        await commandBus.dispatch(new LeavePartyCommand(socket.id))
      }
    })
  })
  
  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error)
  })