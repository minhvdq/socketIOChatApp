const Request = require('../models/Request')

const getAll =   async ( ) => {
    const requests = await Request.find({})

    return requests
}

const getById = async( id ) => {
    return await Request.findById(id)
}

// Post a new Request
const create = async ({fromUser, toUser, room } ) => {


    if( !fromUser || !toUser || !room ){
        throw new Error("Not enough information")
    }

    const savedRequest = await new Request({
        createdAt: Date.now(),
        fromUser: fromUser,
        toUser: toUser,
        room: room
    })
    return savedRequest
}

// Delete all requests
const deleteAll =  async (  ) => {
    await Request.deleteMany({})
}

// Delete a specific request
const deleteById = async ( id ) => {
    const deletedRequest = await Request.findByIdAndDelete(id)
}


module.exports =  {getAll, getById, create, deleteAll, deleteById}