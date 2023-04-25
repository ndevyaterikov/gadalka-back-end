import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import {Server, Socket} from "socket.io";
import {OnModuleInit, Req, UseFilters, UseGuards, UsePipes} from "@nestjs/common";
import {GatewayService} from "./gateway.service";
import {WsAtStrategy} from "../auth/strategies/ws-at.strategy";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {WsGetCurrentUserId} from "../auth/common/decorators/ws-get-current-user-id.decorator";
import {Public} from "../auth/common/decorators/public.decorator";
import {WsAtGuard} from "../auth/common/guards/ws-at.guard";
import {RtGuard} from "../auth/common/guards/rt.guard";
import {use} from "passport";
import {AllWSExceptionsFilter} from "../exceptions/ws.exeption";
import {ValidationPipe} from "../pipes/validation.pipe";
import {CreateMessageDto} from "../messages/dto/create-message-dto";
import {WsValidationPipe} from "../pipes/ws-validation.pipe";

import {GetChatDto} from "../messages/dto/get-chat-dto";


interface IRoomParams{
    roomId:string,
    peerId:string
}




@WebSocketGateway(3003,
    {  cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },})

export class MyGateWay implements OnModuleInit, OnGatewayDisconnect{
    constructor(private readonly gateWayService: GatewayService) {}


    @WebSocketServer()
    server: Server


    onModuleInit() {
        this.server.on('connection', socket=> {
            socket.emit('connected')
        })
        }

    handleConnection(@ConnectedSocket() client: Socket) {
        client.emit('authCheck')
        console.log('authCheck authCheck authCheck authCheck authCheck authCheck authCheck')
    }

    handleDisconnect(@ConnectedSocket() client:Socket) {
        this.gateWayService.onUserDisconnect(client)
    }

    @SubscribeMessage('join-room')
    onJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody(){roomId, peerId}:IRoomParams){
        this.gateWayService.onJoinRoom({roomId, peerId}, client)
    }

   // @Public()

    @UseGuards(WsAtGuard)
    @UsePipes(WsValidationPipe)
    @SubscribeMessage('sendMessage')
    @UseFilters(new AllWSExceptionsFilter())
    onSendMessage(
       @WsGetCurrentUserId() userId:number,
       @MessageBody() data:CreateMessageDto,
    ){
        this.gateWayService.onSendMessage({...data,userId:userId})
    }



    @UsePipes(WsValidationPipe)
    @SubscribeMessage('witchChat')
    onWitchChat(
        @MessageBody() {witchId}:GetChatDto,
    ){
        this.gateWayService.onWitchChat(witchId)
    }


}
