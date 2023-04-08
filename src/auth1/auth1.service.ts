import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user-dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/user.model";

@Injectable()
export class Auth1Service {

    constructor(
        private usersService:UsersService,
        private jwtService:JwtService) {}

    async login(userDto:CreateUserDto){
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto:CreateUserDto){
        const candidate = await this.usersService.getUserByEmail(userDto.email)
        console.log(candidate)
        if (candidate){
            throw new HttpException('Пользователь с таким  email существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password,5)
        const user = await this.usersService.CreateUser({...userDto,password:hashPassword})
        return this.generateToken(user)
    }

    async generateToken(user: User){
        const payload = {email:user.email, id:user.id, roles:user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    async validateUser(userDto:CreateUserDto){
        const user = await this.usersService.getUserByEmail(userDto.email)
        const passwordEquals = await bcrypt.compare(userDto.password, user.password)

        if (user&&passwordEquals){
            return user
        }
        throw new UnauthorizedException({message:'Некорректный емейл или пароль'})
    }

}
