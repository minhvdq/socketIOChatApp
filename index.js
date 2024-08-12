const { Server } = require('socket.io')
const path = require('path')
const { fileURLToPath } = require('url')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')
const userFunc = require('./functions/user')
const msgFunc = require('./functions/message')
const roomFunc = require('./functions/room')
const requestFunc = require('./functions/request')


const ADMIN = "Admin"

const expressServer = app.listen(config.PORT, () => {
    console.log(`listening on port ${config.PORT}`)
})

//state
const UserState = {
    users: [],
    setUsers: function(newUserArray){
        this.users = newUserArray
    }
}

const io = new Server(expressServer, {
    cors:{
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {
    // Listen to someone create new Room 
    console.log(`user ${socket.id} joined app` )

    socket.on('active', ({socketId, username, userId}) => {
        socket.broadcast.except(socketId).emit('new user', {socketId, username, userId})
    })

    socket.on('new user', ({socketId, userId, username}) => {
        const newUser = {socketId, userId, username}
        const newUsers = {...UserState.users, newUser}
        UserState.setUsers(newUsers)
    })

    scoe
    socket.on('join-room', ({roomId}) => {
        socket.join(roomId)
    })

    socket.on('sendInvite', async ({fromUser, toUser, roomId}) => {
        const sentInvititation = await requestFunc.create({fromUser, toUser, roomId})

        io.emit('sendInvite', (sentInvititation.id))
    })

    socket.on('enterRoom', ({username, roomId}) => {
        
    })

    
    // socket.on( 'message' , ({ username, userId, content, roomId }) => {
    //     // Push to databse
    //     axios.post('/api/message/', { 
    //         userId, roomId, content  
    //     })

    //     // Response to frontend
    //     io.emit('message', buildMsg(username, text))
    // })

    // socket.on()
})

function buildMsg( name, text ){
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

//User functions
function activateUser(id, name, room ) {
    const user = {
        id, name, room
    }
    UserState.setUsers([
        ...UserState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeaveApp( id ){
    UserState.setUsers(
        UserState.users.filter(user => user.id !== id)
    )
}

function getUser( id ) {
    return UserState.users.find(user => user.id === id)
}

function getUserInRoom( room ) {
    console.log('users', UserState.users)
    return UserState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UserState.users.map( user => user.room )))
}