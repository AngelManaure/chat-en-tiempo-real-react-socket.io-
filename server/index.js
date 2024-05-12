 import express from 'express'
import morgan from 'morgan';
import { Server as socketServer } from "socket.io";
import http from 'http'
import cors from 'cors'

 import { PORT, FRONTEND } from "./config.js";

const app = express()
const server = http.createServer(app)
const io = new socketServer(server, {
    cors: {
        origin: FRONTEND
    }
})

app.use(cors())
app.use(morgan('dev'))

io.on('connection', (socket) => {
    console.log(socket.id);
    
    socket.on('message', (message) => {
        socket.broadcast.emit('message', {
            body: message,
            from: socket.id,
        })
    })
})

 server.listen(PORT, () => {
    console.log('Server running on port', PORT);
 })