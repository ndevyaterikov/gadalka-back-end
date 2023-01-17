import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from "socket.io";
import {OnModuleInit} from "@nestjs/common";
import {GatewayService} from "./gateway.service";
const {version, validate, v4} = require('uuid')

@WebSocketGateway(3003,
    {  cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },})

export class MyGateWay implements OnModuleInit{
    constructor(private readonly gateWayService: GatewayService) {}

    @WebSocketServer()
    server: Server


    onModuleInit(): any {
        this.server.on('connection', socket=> {
            console.log('User connected')
        })
        }


    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body:any){
        console.log(body)
        this.server.emit('onMessage', {
            msg: 'New message',
            content: body
        })
    }

    @SubscribeMessage('join-room')
    onJoinRoom(@MessageBody() body){
        this.gateWayService.onJoinRoom(body)
    }

    @SubscribeMessage('create-room')
    onCreateRoom(){
        this.gateWayService.onCreateRoom()
    }
}
