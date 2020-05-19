const uuid = require('uuid')
const User = require('../../models/User')

module.exports = class UserRepository {
  constructor() {
    this._users = {}
  }

  async create() {
    const user = {
      id: uuid.v4(),
    }

    this._users[user.id] = user

    let userDb
    try {
      userDb = new User({
        id: user.id,
      })
      await userDb.save()
    } catch (err) {
      console.error(err.message)
    }

    //return user
    return userDb
  }

  async joinAsCreator(userId, partyId, connectionId) {
    this._users[userId].partyId = partyId
    this._users[userId].connectionId = connectionId
    this._users[userId].role = 'host'

    try {
      await User.update(
        { id: userId },
        {
          $set: {
            partyId,
            connectionId,
            role: 'host',
          },
        }
      )
    } catch (err) {
      console.error(err.message)
    }
  }

  async joinParty(userId, partyId, connectionId) {
    this._users[userId].partyId = partyId
    this._users[userId].connectionId = connectionId
    this._users[userId].role = 'guest'

    try {
      await User.update(
        { id: userId },
        {
          $set: {
            partyId,
            connectionId,
            role: 'guest',
          },
        }
      )
    } catch (err) {
      console.error(err.message)
    }
  }

  async findById(id) {
    let userDb
    try {
      userDb = await User.findOne({ id })
    } catch (err) {
      console.error(err.message)
    }

    //return this._users[id]
    return userDb
  }

  async findByPartyId(partyId) {
    let userDbs
    try {
      userDbs = await User.find({ partyId })
    } catch (err) {
      console.error(err.message)
    }

    //return Object.values(this._users).filter((x) => x.partyId === partyId)
    return userDbs
  }

  async findByConnectionId(connectionId) {
    let userDb
    try {
      userDb = await User.findOne({ connectionId })
    } catch (err) {
      console.error(err.message)
    }

    // return (
    //   Object.values(this._users).find((x) => x.connectionId === connectionId) ||
    //   null
    // )
    return userDb
  }

  async leaveParty(userId) {
    try {
      await User.update(
        { id: userId },
        {
          $unset: {
            partyId: 1,
            connectionId: 1,
          },
        }
      )
    } catch (err) {
      console.error(err.message)
    }

    delete this._users[userId].partyId
    delete this._users[userId].connectionId
  }
}
