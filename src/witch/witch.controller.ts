import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {User} from "../users/user.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import {WitchService} from "./witch.service";
import {CreateWitchDto} from "./dto/create-witch-dto";
import {Public} from "../auth/common/decorators/public.decorator";
import {SetOnlineWitchStatusDto} from "./dto/set-online-witch-status-dto";

@Controller('witch')
export class WitchController {

    constructor(private witchService: WitchService) {
    }

    @ApiOperation({summary:'Создание гадалки'})
    @ApiResponse({status:200, type:User})
    @UsePipes(ValidationPipe)
    @Post()
    createWitch(@Body() witchDto: CreateWitchDto){
        return this.witchService.CreateWitch(witchDto)
    }


    @Public()
    @ApiOperation({summary:'Получение листа гадалок'})
    @ApiResponse({status:200, type:[User]})
    @UsePipes(ValidationPipe)
    @Get()
    getAllWitch(){
         return this.witchService.getAllWitch()
    }

    @ApiOperation({summary:'Поменять статус онлайн/не онлайн'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/setOnLineWitchStatus')
    setOnLineWitchStatus(@Body() setOnlineWitchStatusDto: SetOnlineWitchStatusDto){
        return this.witchService.setOnLineWitchStatus(setOnlineWitchStatusDto)
    }



}
