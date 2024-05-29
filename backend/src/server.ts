import env from "./utilities/validateEnv"
import mongoose from "mongoose"
import app from "./app"
import http from 'http'
import express from "express"
import { Server as SocketIOServer, Socket } from 'socket.io'

const socketApp=express()

const server=http.createServer(socketApp)
const io=new SocketIOServer(server,{
    cors:{
        origin:"*",
    }
})

socketApp.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

server.listen(env.SOCKET_PORT,()=>{
    console.log(`Socket Server is listening on port: `,env.SOCKET_PORT);
})

io.on('connection',(socket:Socket)=>{
    console.log('React client connected')
    socket.on('disconnect',()=>{
        console.log('React client disconnected')
    })
})

mongoose.connect(env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("Mongoose Connected");
    app.listen(env.PORT,()=>{
        console.log("Web Server started at port:",env.PORT);
    })
}).catch(console.error)

export default io