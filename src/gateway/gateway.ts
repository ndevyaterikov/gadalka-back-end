import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";

import {Server, Socket} from "socket.io";
import {Injectable, OnModuleInit, Req, UseFilters, UseGuards, UsePipes} from "@nestjs/common";
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
import {CoinGiftDto} from "./dto/coin-gift-dto";
import {CreateGadanieRequestDto} from "./dto/create-gadanie-request-dto";
import {JoinRoomDto} from "./dto/join-room-dto";
import {RoleCheckDto} from "./dto/role-check-dto";


interface IRoomParams{
    roomId:string,
    peerId:string
}

@Injectable()
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

    handleConnection(@ConnectedSocket() socket: Socket) {
        socket.emit('authCheck')
    }

    handleDisconnect(@ConnectedSocket() client:Socket) {
        this.gateWayService.onUserDisconnect(client, this.server)
    }

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


   // @Public()
    @UseGuards(WsAtGuard)
   // @UsePipes(WsValidationPipe)
    @SubscribeMessage('sendMessage')
    @UseFilters(new AllWSExceptionsFilter())
    onSendMessage(
       @WsGetCurrentUserId() userId:number,
       @MessageBody(WsValidationPipe) data:CreateMessageDto,
       @ConnectedSocket() client: Socket
    ){

        this.gateWayService.onSendMessage({...data,userId:userId, server:this.server, client:client})
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


    //@UsePipes(WsValidationPipe)
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
