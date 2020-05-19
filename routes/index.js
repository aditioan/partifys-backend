const express = require('express')

const UserRepository = require('../socket_server/repositories/User')
const PartyRepository = require('../socket_server/repositories/Party')

let router = express.Router()

const partyRepository = new PartyRepository()
const userRepository = new UserRepository()

const parties = partyRepository.findAll()

const data = parties.map((party) => ({
  party: party,
  users: userRepository.findByPartyId(party.id),
}))

router.get('/', function (req, res) {
  res.render('../views/admin', { data: data })
})

module.exports = router
