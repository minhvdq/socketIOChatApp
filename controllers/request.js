const requestRouter= require('express').Router()
const Request = require('../models/Request')

requestRouter.get('/',  async (req, res ) => {
    const requests = await Request.find({})

    res.status(200).json(requests)
})


// Post a new Request
requestRouter.post('/', async ( req, res ) => {
    const body = req.body
    const fromUser = body.fromUser
    const toUser = body.User
    const room = body.room

    if( !fromUser || !toUser || !room ){
        res.status(404).json({message: "Not enough information"})
    }

    const savedRequest = await new Request({
        createdAt: Date.now(),
        fromUser: fromUser,
        toUser: toUser,
        room: room
    })
    res.status(200).json(savedRequest)
})

// Delete all requests
requestRouter.delete('/', async ( req, res ) => {
    await Request.deleteMany({})
    res.status(200).send("all requests deleted")
})

// Delete a specific request
requestRouter.delete('/:id', async ( req, res ) => {
    const id = req.params.id
    const deletedRequest = await Request.findByIdAndDelete(id)
    res.status(200).json(deletedRequest)
})


module.exports =  requestRouter