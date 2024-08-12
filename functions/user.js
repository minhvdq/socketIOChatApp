const User = require('../models/User')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const getAll = async () => {
    const users = await User.find({})
    return users
}

const getById = async( id ) => {
    const user = await User.findById(id)
    return user
}

const create = async ({email, username, password}) => {
    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
        createdAt: Date.now(),
        username: username,
        passwordHash: passwordHash,
        chatRooms: [],
        messages: [],
        email: email
    })

    const savedUser = await newUser.save()
    return savedUser
}


const addRoom = async ({userId, roomId}) => {


    const user = await User.findById(userId).exec();
    if (!user) {
        throw new Error('User not found' );
    }

    // If rooms is an array, push the new roomId; adjust logic if different structure
    user.chatRooms.push(roomId);
        
    const updatedUser = await user.save();

    return updatedUser
}


const addMsg = async ({userId, msgId}) => {


    const user = await User.findById(userId).exec();
    if (!user) {
        throw new Error('User not found' )
    }

    user.messages.push(msgId);
        
    const updatedUser = await user.save();

    return updatedUser;
}

const deleteAll = async () => {
    await User.deleteMany({});
}


const deleteById = async (Id) => {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser)
}

module.exports = {getAll, getById, create, addRoom, addMsg, deleteAll, deleteById }