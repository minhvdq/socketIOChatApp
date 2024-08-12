const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

userRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})
userRouter.post('/', async (request, response) => {
    const body = request.body
    const salt = 10
    const passwordHash = await bcrypt.hash(body.password, salt)

    const newUser = new User({
        createdAt: Date.now(),
        username: body.username,
        passwordHash: passwordHash,
        chatRooms: [],
        messages: [],
        email: body.email
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

userRouter.post('/addRoom/:id', async (req, res) => {
    const userId = req.params.id;
    const { roomId } = req.body;

    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // If rooms is an array, push the new roomId; adjust logic if different structure
    user.chatRooms.push(roomId);
        
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
})


userRouter.post('/addMsg/:id', async (req, res) => {
    const userId = req.params.id;
    const { msgId } = req.body;

    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.messages.push(msgId);
        
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
})

userRouter.delete('/', async (req, res) => {
    await User.deleteMany({});
    res.status(200).send("all users deleted")
})


userRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser)
})

module.exports = userRouter