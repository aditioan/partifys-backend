const uuid = require('uuid')
const Party = require('../../models/Party')

module.exports = class PartyRepository {
  constructor() {
    this._parties = []
  }

  findAll() {
    // let partiesDb
    // try {
    //   partiesDb = await Party.find()
    // } catch (err) {
    //   console.error(err.message)
    // }

    return this._parties
    //return partiesDb
  }

  findById(id) {
    // let partyDb
    // try {
    //   partyDb = await Party.findOne({ id })
    // } catch (err) {
    //   console.error(err.message)
    // }

    return this._parties.find((x) => x.id === id) || null
    //return partyDb
  }

  findByName(name) {
    // let partyDb
    // try {
    //   partyDb = await Party.findOne({ name })
    // } catch (err) {
    //   console.error(err.message)
    // }

    return this._parties.find((x) => x.name === name) || null
    //return partyDb
  }

  async create(name, code, hostId) {
    // this._parties = this._parties.filter(x => x.name !== name);

    const party = {
      id: uuid.v4(),
      name,
      code,
      hostId,
    }
    this._parties.push(party)

    let partyDb
    try {
      partyDb = new Party({
        id: party.id,
        name: party.name,
        code: party.code,
        hostId: party.hostId,
      })
      await partyDb.save()
    } catch (err) {
      console.error(err.message)
    }

    return party
  }

  async delete(id) {
    this._parties = this._parties.filter((x) => x.id !== id)

    try {
      await Party.findOneAndDelete({ id })
    } catch (err) {
      console.error(err.message)
    }
  }
}
