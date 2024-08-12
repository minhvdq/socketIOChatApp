const Room = require('../models/Room')

const getAll = async( req, res ) => {
    const rooms = await Room.find({})
    return rooms
}

// function to add a new room
const create = async( name ) => {

    const room = await new Room({
        createdAt: Date.now(),
        name: name,
        users: [],
        messages: [],
    }).save();

    const roomId = room.id
    console.log("room id is ", roomId)

    return room;
}

// Add a new user to the room
const addUser =  async( {roomId, userId} ) => {
    
    const room = await Room.findById(roomId)

    if( !room ){
        throw new Error("No room found")
    }

    console.log('room is', room)
    room.users.push(userId)

    const updatedRoom = await room.save()
    
    return updatedRoom
}

// Add a new message to the room
const addMsg =  async( {roomId, msgId} ) => {
    
    const room = await Room.findById(roomId)

    if( !room ){
        throw new Error("No room found")
    }

    console.log('room is', room)
    room.messages.push(msgId)

    const updatedRoom = await room.save()
    
    return updatedRoom
}

// Delete a specific room by id
const deleteById = async ( roomId ) => {

    await Room.findByIdAndDelete(roomId)

    res.status(200).send(`Deleted room ${roomId} successfully`)
}

const deleteAll =  async () => {
    await Room.deleteMany({});
}

module.exports = {getAll, create, addUser, addMsg, deleteAll, deleteById}