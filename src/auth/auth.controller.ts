import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {User} from "../users/user.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/create-user-dto";
import {Tokens} from "./types/tokens.type";
import {AuthGuard} from "@nestjs/passport";
import {Request, response} from "express";
import {AtGuard} from "./common/guards/at.guard";
import {RtGuard} from "./common/guards/rt.guard";
import {GetCurrentUserId} from "./common/decorators/get-current-user-id.decorator";
import {GetRT} from "./common/decorators/get-rt.decorator";
import {Public} from "./common/decorators/public.decorator";


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @ApiOperation({summary:'Создание пользователя 777'})
    @ApiResponse({status:200, type:User})
    @Public()
    @Post('/local/singup')
    @HttpCode(HttpStatus.CREATED)
    singupLocal(
        @Body() dto:CreateUserDto,
        @Res({ passthrough: true }) response
    ):Promise<Tokens>{
        return this.authService.singupLocal(dto, response)
    }

    @Public()
    @Post('/local/singin')
    @HttpCode(HttpStatus.OK)
    singinLocal(
        @Body() dto:CreateUserDto,
        @Req() request: Request,
        @Res({ passthrough: true }) response
    ):Promise<Tokens>{

        console.log(request.cookies)
        return this.authService.singinLocal(dto, response)
    }


    @Get('/checkAuth')
    @HttpCode(HttpStatus.OK)
    checkAuth(@GetCurrentUserId() userId:number):Promise<Tokens>{
        return this.authService.checkAuth(userId)
    }


    @Public()
    @UseGuards(RtGuard)
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId:number){
        return this.authService.logout(userId)
    }

    @Public()
    @UseGuards(RtGuard)
    @Get('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId:number,
        @GetRT() refreshToken:number,
        @Res({ passthrough: true }) response
    )
    {
        return this.authService.refreshTokens(userId, refreshToken.toString(), response)
    }

}