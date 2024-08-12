const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const middlewares = require('./utils/middlewares')
const userRouter = require('./controllers/user')
const roomRouter = require('./controllers/room')
const msgRouter = require('./controllers/message')
const requestRouter = require('./controllers/request')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()


mongoose.set('strictQuery', false)

logger.infor(`connecting to MongoDB`)

mongoose.connect(config.MONGODB_URI).then(result => {
    logger.infor(`connected to MongoDB`,config.MONGODB_URI)
}).catch(error => next(logger.infor(error.message)))

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)
app.use('/api/message', msgRouter)
app.use('/api/request', requestRouter)

app.use(middlewares.requestLogger)
app.use(middlewares.tokenExtractor)

module.exports = app
