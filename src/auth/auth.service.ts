import {ForbiddenException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user-dto";
import {ReturnObj} from "./types/tokens.type";
import {JwtService} from "@nestjs/jwt";
import UserDto from "./dto/user-dto";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt'
import {CreateWitchDto} from "../witch/dto/create-witch-dto";
import {WitchService} from "../witch/witch.service";
import {MailService} from "../mail/mail.service";
import {v4} from "uuid"
import {CoinsService} from "../coins/coins.service";
import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Length} from "class-validator";


@Injectable()
export class AuthService {
    constructor(
                private userService: UsersService,
                private witchService: WitchService,
                private jwtService: JwtService,
                private mailService: MailService,
                private coinsService: CoinsService
                ) {
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
                    expiresIn: 60*60*5
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
            throw new HttpException('Пользователь с таким  email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hash = await this.userService.hashData(dto.password)
        const activationLink = v4()
        const user = await this.userService.CreateUser({...dto, password:hash, activationLink:activationLink})

        const tokens = await this.getTokens(user)
        await this.updateRtHash(user.id,tokens.refresh_token)
        const userDTO = new UserDto(user)
        response.cookie('jwt-RT', tokens.refresh_token, {httpOnly:true})
        await this.mailService.sendActivationMail(dto.email,`${process.env.BACKEND_HOST}/auth/emailActivation/${activationLink}`)

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

    async singupWitch(dto: CreateWitchDto, response) {

        const candidate = await this.userService.getUserByEmail(dto.email)
        if (candidate){
            throw new HttpException('Пользователь с таким  email уже существует', HttpStatus.BAD_REQUEST)
        }

        const candidate1 = await this.userService.getUserByName(dto.userName)
        if (candidate1){
            throw new HttpException('Пользователь с таким  именем уже существует', HttpStatus.BAD_REQUEST)
        }

        const hash = await this.userService.hashData(dto.password)
        const witch = await this.witchService.CreateWitch({...dto, password:hash})
        const tokens = await this.getTokens(witch)
        await this.updateRtHash(witch.id,tokens.refresh_token)
        const userDTO = new UserDto(witch)
        response.cookie('jwt-RT', tokens.refresh_token, {httpOnly:true})
        return {...tokens, userDTO}

    }


    async emailActivation( value: string, res) {

        const user = await this.userService.getUserByActivationLink(value)
        if(!user){
            res.redirect(`${process.env.FRONT_URL}/random`)
           }else {
            if(user.isEmailActivated===false)this.coinsService.transaction({ userId: user.id, transaction:30,cause:'активация email'})
            user.isEmailActivated = true
            user.isFirstTimeAfterActivation = true
            await user.save()
            res.redirect(`${process.env.FRONT_URL}/`)
        }
    }
}
