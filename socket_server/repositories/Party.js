const uuid = require('uuid')
const Party = require('../../models/Party')

module.exports = class PartyRepository {
  constructor () {
    this._parties = []
  }

  findAll () {
    return this._parties
  }

  findById (id) {
    return this._parties.find(x => x.id === id) || null
  }

  findByName (name) {
    return this._parties.find(x => x.name === name) || null
  }

  create (name, code, hostId) {
    // this._parties = this._parties.filter(x => x.name !== name);

    const party = {
      id: uuid.v4(),
      name,
      code,
      hostId
    }
    this._parties.push(party)

    return party
  }

  delete (id) {
    this._parties = this._parties.filter(x => x.id !== id)
  }
}
