import {Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {v4} from 'uuid'

interface IRoomParams{
    roomId:string,
    peerId:string
}

const rooms: Record<string, string[]>= {}

@WebSocketGateway(3003,
    {  cors: {
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST'],
        },})

@Injectable()
export class GatewayService {
    peersVsSocketsMap: Map<string, IRoomParams> = new Map()

    @WebSocketServer()
    server: Server

    onJoinRoom({roomId, peerId}:IRoomParams, client:Socket){
        console.log('socket connected', client.id)
        this.peersVsSocketsMap[client.id] = {roomId, peerId}
        if (rooms[roomId])
        {
            console.log(`user join the room ${roomId} peerId ${peerId}`)
            rooms[roomId].push(peerId)
            this.server.to(roomId).emit('user-joined', {peerId})
            this.server.emit('get-users',{
                roomId,
                participants:rooms[roomId]}
            )
            console.log(`participants ${rooms[roomId]}`)


        }

    }

    leaveRoom({roomId, peerId}:IRoomParams){
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(id => id !== peerId)
            this.server.to(roomId).emit('user-disconnected', peerId)
        }
    }

    onUserDisconnect(client:Socket){
        if (this.peersVsSocketsMap[client.id]) {
            const {roomId, peerId} = this.peersVsSocketsMap[client.id]
            console.log(`Disconnected`, {roomId, peerId})
            this.leaveRoom({roomId, peerId})
        }
    }

    onCreateRoom(){
        const roomId = v4()
        rooms[roomId] = []
        this.server.emit('room-created',{roomId})
        console.log(`user create the room ${roomId}`)
    }

}
