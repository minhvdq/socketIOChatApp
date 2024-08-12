const roomRouter = require('express').Router()
const Room = require('../models/Room')
const axios = require('axios')
const mainUrl = "http://localhost:3500"

roomRouter.get('/', async( req, res ) => {
    const rooms = await Room.find({})
    res.status(200).json(rooms)
})

// function to add a new room
roomRouter.post('/', async( req, res ) => {
    const body = req.body

    const room = await new Room({
        createdAt: Date.now(),
        name: body.name,
        users: [],
        messages: [],
    }).save();

    const roomId = room.id
    console.log("room id is ", roomId)

    res.status(200).json(room);
})

// Add a new user to the room
roomRouter.post('/addUser/:id', async( req, res ) => {
    const body = req.body
    const roomId = req.params.id
    const userId = body.userId
    
    const room = await Room.findById(roomId)

    if( !room ){
        res.status(404).json({message: "Room not found"})
    }

    console.log('room is', room)
    room.users.push(userId)

    const updatedRoom = await room.save()
    
    res.status(200).json(updatedRoom)
})

// Add a new message to the room
roomRouter.post('/addMsg/:id', async( req, res ) => {
    const body = req.body
    const roomId = req.params.id
    const msgId = body.msgId
    
    const room = await Room.findById(roomId)

    if( !room ){
        res.status(404).json({message: "Room not found"})
    }

    console.log('room is', room)
    room.messages.push(msgId)

    const updatedRoom = await room.save()
    
    res.status(200).json(updatedRoom)
})

// Delete a specific room by id
roomRouter.delete('/:id', async (req, res ) => {
    const roomId = req.params.id
    await Room.findByIdAndDelete(roomId)

    res.status(200).send(`Deleted room ${roomId} successfully`)
})

roomRouter.delete('/', async (req, res) => {
    await Room.deleteMany({});
    res.status(200).send("all rooms deleted")
})

module.exports = roomRouter;