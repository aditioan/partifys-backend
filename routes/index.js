const express = require('express')

const UserRepository = require('../socket_server/repositories/User')
const PartyRepository = require('../socket_server/repositories/Party')
const Party = require('../models/Party')

let router = express.Router()

const partyRepository = new PartyRepository()
const userRepository = new UserRepository()

router.get('/', async function (req, res) {
    
    let parties = await partyRepository.findAll();

    for await (let party of parties) {
        let users = await userRepository.findDBByPartyId(party.id)
        party.users = users
    }
  res.render('../views/admin', { data: parties })
})

module.exports = router
