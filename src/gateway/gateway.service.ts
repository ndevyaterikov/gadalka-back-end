import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {v4} from 'uuid'
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Message} from "../messages/messages.model";
import {UsersService} from "../users/users.service";
import {TypeOfMessageInChat} from "../messages/dto/messages-type";
import {MessagesService} from "../messages/messages.service";

interface IRoomParams{
    roomId:string,
    peerId:string
}

const rooms: Record<string, string[]>= {}

@WebSocketGateway(3003,
    {  cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },})

@Injectable()
export class GatewayService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Message) private messageRepository: typeof Message,
        private userService: UsersService,
        private messagesService: MessagesService
    ) {
    }

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
            this.server.socketsJoin(roomId)
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
            console.log('inside leaveRoom', peerId)
            rooms[roomId] = rooms[roomId].filter(id => id !== peerId)
            this.server.to(roomId).emit('user-disconnected', peerId)
        }
    }

    onUserDisconnect(client:Socket){
        console.log('disconnected')
        if (this.peersVsSocketsMap[client.id]) {
            const {roomId, peerId} = this.peersVsSocketsMap[client.id]
            console.log(`Disconnected`, {roomId, peerId})
            this.leaveRoom({roomId, peerId})
        }
    }

    async onSendMessage(param: {
        readonly witchId: number;
        readonly message: string;
        readonly type: string;
        readonly authorPicId: number;
        readonly authorName:string;
        userId: number })
    {
        await this.messagesService.createMessage(param)
        this.server.emit('MessageCreated')
    }

    async onWitchChat(witchId: number) {
        const witch = await this.userRepository.findByPk(witchId,{include:Message})

        const resArr:{
            messageId:number,
            text:string,
            user:string,
            userpic:number,
            messageType:TypeOfMessageInChat
        }[] = []


        if (witch){
            witch.messages.map(r=>resArr.push({
                messageId:r.id,
                text:r.message,
                user:r.authorName,
                userpic:r.authorPicId,
                messageType:TypeOfMessageInChat.general
            }))

            this.server.emit('SendingWitchChat',{resArr})
        }
        this.server.emit('error','chat not found')


    }
}
