import {Injectable} from '@nestjs/common';
import {MessageBody, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
const { v4} = require('uuid')


interface IRoomParams{
    roomId:string,
    peerId:string
}

@WebSocketGateway(3003,
    {  cors: {
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST'],
        },})
@Injectable()
export class GatewayService {
    @WebSocketServer()
    server: Server

    _rooms: Record<string, string[]>= {}

    onNewMessage(@MessageBody() body:any){
        console.log(body)
        this.server.emit('onMessage', {
            msg: 'New message',
            content: body
        })
    }

    onJoinRoom(@MessageBody() {roomId, peerId}:IRoomParams){
        console.log(`user join the room ${roomId} ${peerId}`)
        this.server.socketsJoin(roomId)
    }

    onCreateRoom(){
        const roomId = v4()
        this.server.emit('room-created',{roomId})
        console.log(`user create the room ${roomId}`)
    }

    setRooms({roomId}:{roomId:string}){
        this._rooms[roomId] = []
    }
}
