import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Message} from "./messages.model";
import {UsersService} from "../users/users.service";
import {GetChatDto} from "./dto/get-chat-dto";
import {TypeOfMessageInChat} from "./dto/messages-type";

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Message) private messageRepository: typeof Message,
        private userService: UsersService
    ) {
    }


    async createMessage(param: {
        readonly witchId: number;
        readonly message: string;
        readonly type: string;
        readonly authorPicId: number;
        readonly authorName:string;
        userId: number })

    {
        const witch = await this.userRepository.findByPk(param.witchId)
        const dto =
            {userId: param.witchId,
            authorId:param.userId,
            message: param.message,
            authorPicId: param.authorPicId,
            authorName: param.authorName,
            type: param.type}

        const message = await this.messageRepository.create (dto)

        if (message&&witch){
            await witch.$add('message', message.id)
            return `создано сообщение в чате у гадалки ${param.witchId} от пользователя ${param.userId}`
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }

    async getChatDto(getChatDto: GetChatDto) {
        const witch = await this.userRepository.findByPk(getChatDto.witchId,{include:Message})

        const resArr:{
            messageId:number,
            text:string,
            user:string,
            userpic:number,
            messageType:string
        }[] = []


        if (witch){
                witch.messages.map(r=>resArr.push({
                messageId:r.id,
                text:r.message,
                user:r.authorName,
                userpic:r.authorPicId,
                messageType:r.type
            }))
            return resArr
        }
        throw new HttpException('Чат гадалки не найден', HttpStatus.NOT_FOUND)

    }
}
