const express = require('express');

const PartyRepository = require('../socket_server/repositories/Party')

let router = express.Router();

const partyRepository = new PartyRepository()

router.get('/', async function (req, res) {
  let parties = await partyRepository.findAll();
  res.render('../views/admin', { data: parties })
})

module.exports = router;