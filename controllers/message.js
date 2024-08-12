const msgRouter = require('express').Router()
const Message = require('../models/Message')

// Get all the messages
msgRouter.get('/', async( req, res ) => {
    const messages = await Message.find({})
    res.status(200).json(messages)
})

// Get a specific message by its id
msgRouter.get('/:id', async( req, res ) => {
    const id = req.params.id
    const foundMsg = await Message.findById(id)

    res.status(200).json(foundMsg)
})

// Get all the message from a specific room
msgRouter.get('/fromRoom/:id', async( req, res ) => {
    const roomId = req.params.id

    const roomMsgs = await Message.find({fromRoom: roomId})
    res.status(200).json(roomMsgs)
})

// Post a new message of an user to a specific room
msgRouter.post('/', async(req, res ) => {
    const body = req.body
    const userId = body.userId
    const roomId = body.roomId
    const content = body.content ? body.content : ""

    if( !userId || !roomId){
        res.status(404).json({message: "User id or room id not found"})
    }

    const savedMsg = await new Message({
        createdAt: Date.now(),
        fromUser: userId,
        fromRoom: roomId,
        content: content,
    }).save()

    res.status(200).json(savedMsg)
})

// Delete all the messages
msgRouter.delete('/', async( req, res) => {
    await Message.deleteMany({})

    res.status(200).send("all messages deleted")
})

// Delete a specific message by its id
msgRouter.delete('/:id', async( req, res) => {
    const deletedMessage  = await Message.findByIdAndDelete(req.params.id)

    res.status(200).json(deletedMessage)
})

module.exports = msgRouter;