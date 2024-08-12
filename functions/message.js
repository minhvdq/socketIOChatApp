const Message = require('../models/Message')


const getAll = async () => {
    const messages = await Message.find({})
    return messages
}

const getById = async ( id ) => {

    const foundMsg = await Message.findById(id)
    return foundMsg
}

const getByRoomId = async ( roomId ) => {
    const messages = await Message.find({fromRoom: roomId})

    return messages
}

const postMsg = async ({userId, roomId, content}) => {

    const savedMsg = await new Message({
        createdAt: Date.now(),
        fromUser: userId,
        fromRoom: roomId,
        content: content,
    }).save()

    return savedMsg
}

const deleteAll = async () => {
    await Message.deleteMany({})
}

const deleteById = async (id) => {
    const deletedMsg = await Message.findByIdAndDelete(id)
    return deletedMsg
}

module.exports = {getAll, getById, getByRoomId, postMsg, deleteAll, deleteById};