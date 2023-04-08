import {ForbiddenException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user-dto";

import {Tokens, ReturnObj} from "./types/tokens.type";
import {JwtService} from "@nestjs/jwt";
import {Op} from "sequelize";
import UserDto from "./dto/user-dto";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt'



@Injectable()
export class AuthService {
    constructor(

                //private userRepository: typeof User,
                private userService: UsersService,
                private jwtService: JwtService) {
    }



    async updateRtHash(userId, rt: string){
        await this.userService.updateRtHash(userId,rt)
    }

    async getTokens(user: User){
        const [at,rt] = await Promise.all(
            [
                this.jwtService.signAsync({
                    sub:user.id,
                    email:user.email,
                    roles:user.roles

                },{
                    secret:'at-secret',
                    expiresIn: 60*30
                }),

                this.jwtService.signAsync({
                    sub:user.id,
                    email:user.email,
                    roles:user.roles
                },{
                    secret:'rt-secret',
                    expiresIn: 60*60*24*20
                })]
        )
        return{
            access_token: at,
            refresh_token: rt
        }
    }

    async singupLocal(dto:CreateUserDto, response):Promise<ReturnObj> {
        const candidate = await this.userService.getUserByEmail(dto.email)
        if (candidate){
            throw new HttpException('Пользователь с таким  email существует', HttpStatus.BAD_REQUEST)
        }

        const hash = await this.userService.hashData(dto.password)
        const user = await this.userService.CreateUser({...dto, password:hash})

        const tokens = await this.getTokens(user)
        await this.updateRtHash(user.id,tokens.refresh_token)
        const userDTO = new UserDto(user)
        response.cookie('jwt-RT', tokens.refresh_token, {httpOnly:true})
        return {...tokens, userDTO}
    }


    async singinLocal(dto:CreateUserDto, response):Promise<ReturnObj>{
        const user = await this.userService.getUserByEmail(dto.email)
        if(!user)throw new HttpException('Пользователь с таким  email не существует', HttpStatus.BAD_REQUEST)

        const passwordMatches = await bcrypt.compare(dto.password, user.password)
        if(!passwordMatches)throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST)

        const tokens = await this.getTokens(user)
        await this.updateRtHash(user.id,tokens.refresh_token)
        const userDTO = new UserDto(user)

        response.cookie('jwt-RT', tokens.refresh_token, {httpOnly:true})
        return {...tokens, userDTO}

    }

    async logout(userId:number) {
        await this.userService.deleteHashedRT(userId)
    }

    async refreshTokens(userId:number, rt: string, response) {
        const user = await this.userService.getUserById(userId)
        if (!user || !user.hashedRt) throw new ForbiddenException('Доступ запрещён')
        const rtMatches = await bcrypt.compare(rt, user.hashedRt)
        if (!rtMatches) throw new ForbiddenException('Доступ запрещён')

        const tokens = await this.getTokens(user)
        await this.updateRtHash(user.id,tokens.refresh_token)

        const userDTO = new UserDto(user)
        response.cookie('jwt-RT', tokens.refresh_token, {httpOnly:true})
        return {...tokens, userDTO}

    }

    async checkAuth(userId: number):Promise<ReturnObj> {
        const user = await this.userService.getUserById(userId)
        if (!user || !user.hashedRt) throw new ForbiddenException('Доступ запрещён')

        const tokens = await this.getTokens(user)
        await this.updateRtHash(user.id,tokens.refresh_token)

        const userDTO = new UserDto(user)
        return {...tokens, userDTO}
    }
}
