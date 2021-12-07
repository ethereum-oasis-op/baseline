import io from 'socket.io-client'

export const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001')