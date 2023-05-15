import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {MessagesService} from "./messages.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import ReturnUserDto from "../users/dto/return-user-dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import {ChangeUserNameDto} from "../users/dto/change-user-name-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {CreateMessageDto} from "./dto/create-message-dto";
import {GetChatDto} from "./dto/get-chat-dto";
import {Message} from "./messages.model";

@Controller('messages')
export class MessagesController {

    constructor(private messagesService: MessagesService) {
    }

    @ApiOperation({summary:'Создание сообщения'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/create')
    createMessage(
        @Body() createMessageDto: CreateMessageDto,
        @GetCurrentUserId() userId: number
    ){
        return this.messagesService.createMessage({...createMessageDto,userId:userId})
    }

    @ApiOperation({summary:'Создание сообщения'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/getchat')
    getChat(
        @Body() getChatDto: GetChatDto,
    ){
        return this.messagesService.getChatDto(getChatDto)
    }

}
