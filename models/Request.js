const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const reqSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
    },
    fromUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
})

reqSchema.plugin(uniqueValidator)

mongoose.set('toJSON', {
    transform: (doc,ret)=> {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('Request', reqSchema)