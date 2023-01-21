import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import {Server, Socket} from "socket.io";
import {OnModuleInit} from "@nestjs/common";
import {GatewayService} from "./gateway.service";


interface IRoomParams{
    roomId:string,
    peerId:string
}


@WebSocketGateway(3003,
    {  cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },})
export class MyGateWay implements OnModuleInit, OnGatewayDisconnect{
    constructor(private readonly gateWayService: GatewayService) {}


    @WebSocketServer()
    server: Server

    onModuleInit(): any {
        this.server.on('connection', socket=> {
            console.log('User connected')})
        }


    handleDisconnect(@ConnectedSocket() client:Socket) {
        this.gateWayService.onUserDisconnect(client)
    }

    @SubscribeMessage('join-room')
    onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody(){roomId, peerId}:IRoomParams){
        this.gateWayService.onJoinRoom({roomId, peerId}, client)
    }

    @SubscribeMessage('create-room')
    onCreateRoom(){
        this.gateWayService.onCreateRoom()
    }

}
