import {Body, Controller, Delete, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user-dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./user.model";
import {Roles} from "../auth1/roles-auth1.decorator";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import {RolesGuard} from "../auth/common/guards/roles.guard";
import {ChangeUserNameDto} from "./dto/change-user-name-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import ReturnChangeAvatarDto from "./dto/change-avatra-dto/return-change-avatar-dto";
import ReturnUserDto from "./dto/return-user-dto";
import {ChangeAvatarDto} from "./dto/change-avatra-dto/change-avatar-dto";
import {ChangePasswordDto} from "./dto/change-password-dto/change-password-dto";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {
    }

    @ApiOperation({summary:'Создание пользователя'})
    @ApiResponse({status:200, type:User})
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.userService.CreateUser(userDto)
    }


    @ApiOperation({summary:'Изменение имени пользователя'})
    @ApiResponse({status:200, type:ReturnUserDto})
    @UsePipes(ValidationPipe)
    @Post('/changeUserName')
    changeName(
        @Body() changeUserNameDto: ChangeUserNameDto,
        @GetCurrentUserId() userId: number
        ){
         return this.userService.ChangeUserName(changeUserNameDto, userId)
    }


    @ApiOperation({summary:'Изменение пароля пользователя'})
    @ApiResponse({status:200, type:ReturnUserDto})
    @UsePipes(ValidationPipe)
    @Post('/changeUserPassword')
    changePasspord(
        @Body() changePasswordDto: ChangePasswordDto,
        @GetCurrentUserId() userId: number
    ){
        return this.userService.changePasspord(changePasswordDto, userId)
    }

    @ApiOperation({summary:'Изменение аватарки пользователя'})
    @ApiResponse({status:200, type:ReturnChangeAvatarDto})
    @UsePipes(ValidationPipe)
    @Post('/changeAccountPicNumber')
    changeAccountPicNumber(
        @Body() changeAvatarDto: ChangeAvatarDto,
        @GetCurrentUserId() userId: number
    ){
        return this.userService.changeAccountPicNumber(changeAvatarDto, userId)
    }


    @ApiOperation({summary:'Изменение статуса: первый раз после активации почты'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/changeIsFirstTimeAfterActivation')
    changeIsFirstTimeAfterActivation(
        @GetCurrentUserId() userId: number
    ){
        return this.userService.changeIsFirstTimeAfterActivation(userId)
    }


    @ApiOperation({summary:'Удалить аккаунт'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Delete('/deleteAccount')
    deleteAccount(
        @GetCurrentUserId() userId: number
    ){
        return this.userService.deleteAccount(userId)
    }

    @ApiOperation({summary:'Получение всех пользователя'})
    @ApiResponse({status:200, type:[User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.userService.getAllUsers()
    }


    @ApiOperation({summary:'Выдача ролей'})
    @ApiResponse({status:200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto:AddRoleDto){
        return this.userService.addRole(dto)
    }

    @ApiOperation({summary:'История транзакций алмазов'})
    @ApiResponse({status:200})
    @Get('/diamonds_transactions')
    getDiamonds(@GetCurrentUserId() userId: number){
        return this.userService.getDiamonds(userId)
    }


    @ApiOperation({summary:'Забанить пользователя'})
    @ApiResponse({status:200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto:BanUserDto){
        return this.userService.ban(dto)
    }




}
