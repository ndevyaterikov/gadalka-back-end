import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user-dto";
import {User} from "../users/user.model";
import {Auth1Service} from "./auth1.service";
import {Roles} from "./roles-auth1.decorator";
import {Roles1Guard} from "./roles1.guard";

@ApiTags('Авторизация')
@Controller('auth')
export class Auth1Controller {

    constructor(private authService:Auth1Service) {
    }

    @ApiOperation({summary:'Логирование'})
    @ApiResponse({status:200})
    @Post('/login')
    login(@Body() userDto:CreateUserDto){
        return this.authService.login(userDto)
    }

    @ApiOperation({summary:'Регистрация'})
    @ApiResponse({status:200})
    @Post('/registration')
    registration(@Body() userDto:CreateUserDto){
        return this.authService.registration(userDto)
    }

    @ApiOperation({summary:'Проверка авторизован ли пользователь'})
    @ApiResponse({status:200})
    @Roles('ADMIN')
    @UseGuards(Roles1Guard)
    @Get('/check')
    check(){
        return 'good'
    }
}
