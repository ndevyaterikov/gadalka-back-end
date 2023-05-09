import {Injectable} from '@nestjs/common';
import {WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Message} from "../messages/messages.model";
import {UsersService} from "../users/users.service";
import {TypeOfMessageInChat} from "../messages/dto/messages-type";
import {MessagesService} from "../messages/messages.service";
import {CoinsService} from "../coins/coins.service";
import {v4} from "uuid"
import {WitchTasksService} from "../witch-tasks/witch-tasks.service";
import {WitchService} from "../witch/witch.service";

interface IRoomParams{
    roomId:string,
    peerId:string
}


@Injectable()
export class GatewayService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Message) private messageRepository: typeof Message,
        private userService: UsersService,
        private messagesService: MessagesService,
        private coinsService: CoinsService,
        private witchTasksService:WitchTasksService,
        private witchService:WitchService
    ) {
    }

    webSockets = []

    onJoinRoom(dto, client:Socket, server: Server){

        const clientId = v4()
            if (typeof dto.userId==='undefined'){dto.userId="guest"}
            client.join(String(dto.witchId))
            this.webSockets.push({roomId:dto.witchId, userId:dto.userId, socket: client, clientId: clientId})

            let viewers:number = 0
            this.webSockets.forEach(w=>{
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                console.log('RoomId: '+ w.roomId + ' userId: '+ w.userId)
            })

            server.to(String(dto.witchId)).emit(
                'user-joined-room',
                {
                    witchId:dto.witchId,
                    userId:dto.userId,
                    clientId: clientId,
                    viewers: this.webSockets.filter(ws=>ws.roomId==dto.witchId).length
                })
            client.emit('RequestOfChatIndividual',{witchId:dto.witchId, userId:dto.userId})
            this.witchService.upDateViewersOnWitch(dto.witchId,viewers)

        }




    onUserDisconnect(client:Socket, server:Server){

        const socketLeft =this.webSockets.filter(w=>w.socket===client)[0]
        this.webSockets = this.webSockets.filter(w=>w.socket!==client)
        let viewers:number = 0
        if (socketLeft){
        this.webSockets.forEach(w=>{
            if(w.roomId === socketLeft.roomId){viewers++}
        })


        server.to(String(socketLeft.roomId)).emit('user-left-the-room',
            {
                witchId:socketLeft.roomId,
                userId:socketLeft.userId,
                clientId: socketLeft.clientId,
                viewers:viewers
            })}
        }


    async onSendMessage(param: {
        readonly witchId: number;
        readonly message: string;
        readonly type: string;
        readonly authorPicId: number;
        readonly authorName:string;
        userId: number,
        server: Server,
        client: Socket
    })
    {
            try {
                const user = await this.userService.getUserById(param.userId)
                if (user)
                {
                    await this.messagesService.createMessage(
                        {
                            witchId:param.witchId,
                            authorName:user.userName,
                            userId:user.id,
                            authorPicId:user.accountPicNumber,
                            type:'general',
                            message: param.message
                        })
                    this.onWitchChat(param.witchId, param.server, param.client)
                    param.client.emit('MessageCreated')
                }else
                    param.client.emit('error','user not found')

            }catch (e){
                param.client.emit('exception', 'ошибка отправки сообщения')

            }

    }

    async onWitchChat(witchId: number, server:Server, client: Socket) {
        try {
        const witch = await this.userRepository.findByPk(witchId,
            {
                include: [{
                    model: Message,
                    limit:20,
                    order: [['createdAt', 'DESC']]
                }]
            })

        const resArr:{
            messageId:number,
            text:string,
            user:string,
            userpic:number,
            messageType:TypeOfMessageInChat
        }[] = []

        if (witch){
            witch.messages.map(r=>
                {
                let mess: string
                let type:TypeOfMessageInChat
                    switch(r.type) {
                        case 'general':
                            type=TypeOfMessageInChat.general
                            mess=r.message
                            break
                        case 'CoinsGift':
                            type=TypeOfMessageInChat.coinsGift
                            mess = r.message
                            break
                        case 'paidButNotPrivate':
                            type=TypeOfMessageInChat.paidButNotPrivate
                            mess = 'Запрос на гадание от '+ r.authorName
                            break
                        case 'private':
                            type=TypeOfMessageInChat.private
                            mess = 'Запрос на индивидуальное гадание от '+ r.authorName
                            break
                        default:
                            type=TypeOfMessageInChat.general
                    }
                resArr.push({
                messageId:r.id,
                text:mess,
                user:r.authorName,
                userpic:r.authorPicId,
                messageType:type})}
            )
              server.to(String(witchId)).emit('SendingWitchChat',{resArr})
        }else {
            client.emit('error','chat not found')
        }

        }catch (e) {
            client.emit('error','chat error')
        }

    }

    async onWitchChatIndividual(witchId: number, server:Server, client:Socket) {
        try {
            const witch = await this.userRepository.findByPk(witchId,
                {
                    include: [{
                        model: Message,
                        limit:20,
                        order: [['createdAt', 'DESC']]
                    }]
                })

            const resArr:{
                messageId:number,
                text:string,
                user:string,
                userpic:number,
                messageType:TypeOfMessageInChat
            }[] = []

            if (witch){
                witch.messages.map(r=>
                    {
                        let mess: string
                        let type:TypeOfMessageInChat
                        switch(r.type) {
                            case 'general':
                                type=TypeOfMessageInChat.general
                                mess=r.message
                                break
                            case 'CoinsGift':
                                type=TypeOfMessageInChat.coinsGift
                                mess = r.message
                                break
                            case 'paidButNotPrivate':
                                type=TypeOfMessageInChat.paidButNotPrivate
                                mess = 'Запрос на гадание от '+ r.authorName
                                break
                            case 'private':
                                type=TypeOfMessageInChat.private
                                mess = 'Запрос на индивидуальное гадание от '+ r.authorName
                                break
                            default:
                                type=TypeOfMessageInChat.general
                        }
                        resArr.push({
                            messageId:r.id,
                            text:mess,
                            user:r.authorName,
                            userpic:r.authorPicId,
                            messageType:type})}
                )
                client.emit('SendingWitchChat',{resArr})
            }else {
                client.emit('error','chat not found')
            }

        }catch (e) {
            client.emit('error','chat error')
        }

    }

    async onSendCoins(param: { readonly witchId: number; userId: number; readonly transaction: number, server: Server, client: Socket}) {
        const witch = await this.userService.getUserById(param.witchId)

        if(witch){
            try {
                const giftTransaction = await this.coinsService.transaction({userId:param.userId, transaction:-param.transaction, cause:'Gift to:'+ witch.userName})
                const user = await this.userService.getUserById(param.userId)
                if (giftTransaction&&user)
                {
                    const recivedtransaction = await this.coinsService.transaction({userId:param.witchId, transaction:param.transaction, cause:'Gift from: '+user.userName})
                    if (!recivedtransaction)await this.coinsService.transaction({userId:param.userId, transaction:-param.transaction, cause:'Returned'})

                    await this.messagesService.createMessage(
                        {
                            witchId:param.witchId,
                            authorName:user.userName,
                            userId:user.id,
                            authorPicId:user.accountPicNumber,
                            type:'CoinsGift',
                            message: 'Подарок '+ param.transaction + ' монет, от ' + user.userName
                        })
                    this.onWitchChat(param.witchId, param.server, param.client)

                }else
                    param.client.emit('error','transaction failed')

            }catch (e){
                param.client.emit('exception', 'недостаточно монет')

            }


    }
    }

    async onSendMessagePaidButNotPrivate(param:
                                             {
                                                 readonly witchId: number;
                                                 readonly authorPicId: number;
                                                 readonly authorName: string;
                                                 readonly message: string;
                                                 readonly type: string;
                                                 userId: number;
                                                 server: Server,
                                                 client: Socket
                                             }) {
        const witch = await this.userService.getUserById(param.witchId)

        if(witch){
            try {
                const giftTransaction = await this.coinsService.transaction({userId:param.userId, transaction:-50, cause:'Гадание у:'+ witch.userName})
                const user = await this.userService.getUserById(param.userId)
                if (giftTransaction&&user)
                {
                    const recivedtransaction = await this.coinsService.transaction({userId:param.witchId, transaction:50, cause:'Оплата за гадание '+user.userName})
                    if (!recivedtransaction)await this.coinsService.transaction({userId:param.userId, transaction:-50, cause:'Returned'})

                    await this.messagesService.createMessage(
                        {
                            witchId:param.witchId,
                            authorName:user.userName,
                            userId:user.id,
                            authorPicId:user.accountPicNumber,
                            type:'paidButNotPrivate',
                            message: 'Оплата гадания 50 монет от'+ user.userName
                        })
                    await this.onWitchChat(param.witchId, param.server, param.client)
                    await this.witchTasksService.createWitchTask({witchId:param.witchId, authorName:param.authorName, task:param.message, userId:param.userId, authorPicId:param.authorPicId, type:'paidNotPrivate'})
                    const witchUpdatedWhithTasks = await this.userService.getUserById(param.witchId)
                    this.sendWitchTasks(witchUpdatedWhithTasks, 'NewTask')
                }else
                    param.client.emit('error','transaction failed')

            }catch (e){
                param.client.emit('exception', 'недостаточно монет')
            }

        }

    }

    async onSendMessagePrivate(param:
                                   {
                                       readonly witchId: number;
                                       readonly authorPicId: number;
                                       readonly authorName: string;
                                       readonly message: string;
                                       readonly type: string;
                                       userId: number;
                                       server: Server,
                                       client: Socket
                                   }) {
        const witch = await this.userService.getUserById(param.witchId)

        if(witch){
            try {
                const giftTransaction = await this.coinsService.transaction({userId:param.userId, transaction:-80, cause:'Индивидуальное гадание у:'+ witch.userName})
                const user = await this.userService.getUserById(param.userId)
                if (giftTransaction&&user)
                {
                    const recivedtransaction = await this.coinsService.transaction({userId:param.witchId, transaction:80, cause:'Оплата индивидуального гадания: '+user.userName})
                    if (!recivedtransaction)await this.coinsService.transaction({userId:param.userId, transaction:-80, cause:'Returned'})

                    await this.messagesService.createMessage(
                        {
                            witchId:param.witchId,
                            authorName:user.userName,
                            userId:user.id,
                            authorPicId:user.accountPicNumber,
                            type:'private',
                            message: 'Оплата индивидуального гадания 80 монет от'+ user.userName
                        })

                    await this.onWitchChat(param.witchId, param.server, param.client)
                    await this.witchTasksService.createWitchTask({witchId:param.witchId, authorName:param.authorName, task:param.message, userId:param.userId, authorPicId:param.authorPicId, type:'private'})
                    const witchUpdatedWhithTasks = await this.userService.getUserById(param.witchId)
                    this.sendWitchTasks(witchUpdatedWhithTasks, 'NewTask')

                }else
                    param.client.emit('error','transaction failed')

            }catch (e){

                param.client.emit('exception', 'недостаточно монет')
            }

        }
    }

    async onCoinsUpdated(userId: number, coinsOnAccaunt:number) {
        //const coinsOnAccaunt= await this.coinsService.getCoinsCount(userId)
        const usedSocket = this.webSockets.filter(w=>w.userId===userId)

        usedSocket.forEach(w=>{
            w.socket.emit('coinsOnAccount', {coins:coinsOnAccaunt})
        })
    }

    async onRoleCheck(witchId: number, client: Socket, server: Server) {

        const user= await this.userService.getUserById(witchId)
        let isWitch:boolean

        if(!user)return
        if(user.roles.find(role=>role.value==='WITCH')){isWitch=true}else {isWitch=false}

        if(isWitch){
            this.sendWitchTasks(user, 'initialLoading')
        }
    }

    sendWitchTasks(witch:User, typeOfRequest:string){
        const usedSocket = this.webSockets.filter(w=>w.userId===witch.id)
        usedSocket.forEach(w=>{
            w.socket.emit('witchTasks'+typeOfRequest, {tasks:witch.tasks.filter((v,i,a)=>v.isTaskCompleated===false)})
        })

    }

    async onWitchTaskCompleated(param: { server: Server; client: Socket; taskId: number }) {
        try {
            const task = await this.witchTasksService.setWitchTaskCompleated(param.taskId)
            const witch = await this.userService.getUserById(task.userId)
            this.sendWitchTasks(witch, 'initialLoading')
        }catch (e){

        }
    }


    onLeftRoom(param: { server: Server; client: Socket; userId: number }) {

        const socketLeft =this.webSockets.filter(w=>w.socket===param.client)[0]
        param.client.leave(String(socketLeft.roomId))
        this.webSockets = this.webSockets.filter(w=>w.socket!==param.client)


        let viewers:number = 0
        if (socketLeft){
            this.webSockets.forEach(w=>{
                if(w.roomId === socketLeft.roomId){viewers++}
            })

            param.server.to(String(socketLeft.roomId)).emit('user-left-the-room',
                {
                    witchId:socketLeft.roomId,
                    userId:socketLeft.userId,
                    clientId: socketLeft.clientId,
                    viewers:viewers
                })}
    }
}
