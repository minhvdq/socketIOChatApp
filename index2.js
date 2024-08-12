import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
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
    console.log(`User ${socket.id} connected`)

    socket.emit('message', buildMsg(ADMIN, 'Welcome to chat app'))
 
    socket.on('enterRoom', ({ name, room }) => {
        //leave previous room
        const prevRoom = getUser(socket.id)?.room
        console.log('prev', prevRoom)
        if(prevRoom){
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `User ${name} has left the room`))
        }
        const user = activateUser(socket.id, name, room )

        if(prevRoom){
            io.to(prevRoom).emit('userList', {
                users: getUserInRoom(prevRoom)
            })
        }
        socket.join(user.room)

        //send Message to the current user who just joined
        socket.emit('message', buildMsg(ADMIN, `You have joined ${user.room}`))

        //send Message to other users about this appearance
        socket.broadcast.emit('message', buildMsg(ADMIN, `User ${user.name} has joined the room!`))

        //update the list of user for the current user's room
        io.to(user.room).emit('userList', {
            users: getUserInRoom(user.room)
        })

        //Update room list for everyone
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })
    })

    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeaveApp(socket.id)
        
        if( user ){
            io.to(user.room).emit('message', buildMsg(ADMIN, `User ${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUserInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    socket.on('message', ({text, name}) => {
        const room = getUser(socket.id)?.room
        if( room ){
            io.emit('message', buildMsg(name, text))
        }
    })

    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if( room ){
            socket.broadcast.to(room).emit('activity', name)
        }
    })

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
function activateUser(id, name, room) {
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