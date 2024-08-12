const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const msgSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    fromUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    fromRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
})

msgSchema.plugin(uniqueValidator)

mongoose.set('toJSON', {
    transform: (doc,ret)=> {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})


module.exports = mongoose.model('Message', msgSchema)