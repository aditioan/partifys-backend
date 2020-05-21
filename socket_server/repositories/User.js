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

    return user
    // return userDb
  }

  async joinAsCreator(userId, partyId, connectionId) {
    this._users[userId].partyId = partyId
    this._users[userId].connectionId = connectionId
    this._users[userId].role = 'host'

    try {
      await User.updateOne(
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

    return true;
  }

  async joinParty(userId, partyId, connectionId) {
    this._users[userId].partyId = partyId
    this._users[userId].connectionId = connectionId
    this._users[userId].role = 'guest'

    try {
      await User.updateOne(
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

    return true;
  }

  async findById(id) {
    let userDb
    try {
      userDb = await User.findOne({ id })
    } catch (err) {
      console.error(err.message)
    }

    return this._users[id]
    // return userDb
  }

  findByPartyId(partyId) {

    return Object.values(this._users).filter((x) => x.partyId === partyId)
  }

  async findDBByPartyId(partyId) {
    let userDb
    try {
      userDb = await User.find({ partyId: partyId })
    } catch (err) {
      console.error(err.message)
    }

    return userDb
  }

  async findByConnectionId(connectionId) {
    let userDb
    try {
      userDb = await User.findOne({ connectionId })
    } catch (err) {
      console.error(err.message)
    }

    return (
      Object.values(this._users).find((x) => x.connectionId === connectionId) ||
      null
    )
    // return userDb
  }

  async leaveParty(userId) {
    try {
      await User.findOneAndDelete({ id: userId })
    } catch (err) {
      console.error(err.message)
    }

    delete this._users[userId].partyId
    delete this._users[userId].connectionId
    
    return userId;
  }

  async deleteParty(partyId) {
    try {
      await User.deleteMany({ partyId })
    } catch (err) {
      console.error(err.message)
    }
    
    return partyId;
  }
}
