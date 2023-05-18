import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import {Server, Socket} from "socket.io";
import {Injectable, OnModuleInit, UseFilters, UseGuards} from "@nestjs/common";
import {GatewayService} from "./gateway.service";
import {WsGetCurrentUserId} from "../auth/common/decorators/ws-get-current-user-id.decorator";
import {WsAtGuard} from "../auth/common/guards/ws-at.guard";
import {AllWSExceptionsFilter} from "../exceptions/ws.exeption";
import {CreateMessageDto} from "../messages/dto/create-message-dto";
import {WsValidationPipe} from "../pipes/ws-validation.pipe";
import {GetChatDto} from "../messages/dto/get-chat-dto";
import {CoinGiftDto} from "./dto/coin-gift-dto";
import {JoinRoomDto} from "./dto/join-room-dto";
import {RoleCheckDto} from "./dto/role-check-dto";
import {Public} from "../auth/common/decorators/public.decorator";



@Injectable()
@WebSocketGateway(3003,
    {  cors: {
        origin: `${process.env.CORS_HOST}`,
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

    handleConnection(@ConnectedSocket() socket: Socket) {
        socket.emit('authCheck')
    }

    handleDisconnect(@ConnectedSocket() client:Socket) {
        this.gateWayService.onUserDisconnect(client, this.server)
    }


    @Public()
    @SubscribeMessage('JoinRoom')
    onJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody(WsValidationPipe) dto:JoinRoomDto){
        this.gateWayService.onJoinRoom(dto, client, this.server)
    }


    @SubscribeMessage('RoleCheck')
    onRoleCheck(
        @ConnectedSocket() client: Socket,
        @MessageBody(WsValidationPipe) dto:RoleCheckDto){

        this.gateWayService.onRoleCheck(dto.witchId, client, this.server)
    }



    @UseGuards(WsAtGuard)
    @SubscribeMessage('sendMessage')
    @UseFilters(new AllWSExceptionsFilter())
    onSendMessage(
       @WsGetCurrentUserId() userId:number,
       @MessageBody(WsValidationPipe) data:CreateMessageDto,
       @ConnectedSocket() client: Socket
    ){

        this.gateWayService.onSendMessage({...data,userId:userId, server:this.server, client:client})
    }


    @Public()
    @UseGuards(WsAtGuard)
    @SubscribeMessage('onLeftRoom')
    @UseFilters(new AllWSExceptionsFilter())
    onLeftRoom(
        @ConnectedSocket() client: Socket
    ){
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
        this.gateWayService.onLeftRoom({server:this.server, client:client})
    }



    @UseGuards(WsAtGuard)
    //@UsePipes(WsValidationPipe)
    @SubscribeMessage('sendMessagePaidButNotPrivate')
    @UseFilters(new AllWSExceptionsFilter())
    onSendMessagePaidButNotPrivate(
        @WsGetCurrentUserId() userId:number,
        @MessageBody(WsValidationPipe) data:CreateMessageDto,
        @ConnectedSocket() client:Socket
    ){

        this.gateWayService.onSendMessagePaidButNotPrivate({...data,userId:userId, server:this.server, client:client})
    }



    @UseGuards(WsAtGuard)
    //@UsePipes(WsValidationPipe)
    @SubscribeMessage('sendMessagePrivate')
    @UseFilters(new AllWSExceptionsFilter())
    onSendMessagePrivate(
        @WsGetCurrentUserId() userId:number,
        @MessageBody(WsValidationPipe) data:CreateMessageDto,
        @ConnectedSocket() client: Socket
    ){
        this.gateWayService.onSendMessagePrivate({...data,userId:userId, server:this.server, client:client})
    }



    @UseGuards(WsAtGuard)
    //@UsePipes(WsValidationPipe)
    @SubscribeMessage('sendCoins')
    @UseFilters(new AllWSExceptionsFilter())
    onSendCoins(
        @ConnectedSocket() client:Socket,
        @WsGetCurrentUserId() userId:number,
        @MessageBody(WsValidationPipe) data:CoinGiftDto,
    ){
          this.gateWayService.onSendCoins({...data,userId:userId, server:this.server, client:client})
    }



    @UseGuards(WsAtGuard)
    @SubscribeMessage('witchTaskCompleated')
    @UseFilters(new AllWSExceptionsFilter())
    onWitchTaskCompleated(
        @ConnectedSocket() client:Socket,
        @MessageBody(WsValidationPipe) dto:{taskId:number} ,
    ){
        this.gateWayService.onWitchTaskCompleated({...dto, server:this.server, client:client})
    }


    @Public()
    @SubscribeMessage('gettingWitchChatIndividual')
    onWitchChatIndividual(
        @ConnectedSocket() client:Socket,
        @MessageBody(WsValidationPipe) {witchId}:GetChatDto)
        {
            this.gateWayService.onWitchChatIndividual(witchId, this.server, client)
        }




    @SubscribeMessage('coinsUpdated')
    onCoinsUpdated(
        @MessageBody(WsValidationPipe) dto:{userId:number},
    ){
        this.gateWayService.onCoinsUpdated(dto.userId, 23)
    }
}
