let io

const getSocket = (id) => {
    return io.sockets.sockets.get(id)
}

const socketConnection = (server) => {
    io = require('socket.io')(server)

    io.on('connection', (socket) => {
        console.log('client connected', socket.id)
    })

}

const sendToRoom = (id, room, type, message, fromServer = false) => {
    if (fromServer) io.to(room).emit(type, message)
    else getSocket(id).broadcast.to(room).emit(type, message)
}

const joinRoom = (id, room) => {
    getSocket(id).join(room)
}

const leaveRoom = (id, room) => {
    getSocket(id).leave(room)
}

const addListener = (id, type, handler) => {
    getSocket(id).on(type, handler)
}

const removeListener = (id, type) => {
    getSocket(id).removeListener(type)
}

module.exports = {
    socketConnection,
    sendToRoom,
    joinRoom,
    leaveRoom,
    addListener,
    removeListener
}