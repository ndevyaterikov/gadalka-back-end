import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./user.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user-dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import * as bcrypt from 'bcrypt'
import {Op} from "sequelize";
import {ChangeUserNameDto} from "./dto/change-user-name-dto";
import ReturnUserDto from "./dto/return-user-dto";
import {ChangeAvatarDto} from "./dto/change-avatra-dto/change-avatar-dto";
import ReturnChangeAvatarDto from "./dto/change-avatra-dto/return-change-avatar-dto";
import {ChangePasswordDto} from "./dto/change-password-dto/change-password-dto";
import {Witch} from "../witch/witch.model";

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(Witch) private witchRepository: typeof Witch,
        private roleServive: RolesService
    ) {
    }


    async CreateUser(dto:CreateUserDto){
        const userNameFromEmail:string = dto.email.split('@')[0]
        const dtoWithUserName = {...dto, userName:userNameFromEmail}
        const user = await this.userRepository.create(dtoWithUserName)
        const role = await this.roleServive.getRoleByValue('USER')
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include:{all:true}})
        return users
    }

    async getUserByEmail(email:string){
        const user = await this.userRepository.findOne({where:{email}, include:{all:true}})
        return user
    }

    async getUserById(userId:number){
        const user = await this.userRepository.findOne({where:{id:userId}, include:{all:true}})
        return user
    }

    async getUserByName(userName:string){
        const user = await this.userRepository.findOne({where:{userName:userName}, include:{all:true}})
        return user
    }

    hashData(data:String){
        return bcrypt.hash(data, 10)
    }

    async updateRtHash(userId, rt: string){
        const hash = await this.hashData(rt)
        await this.userRepository.update({hashedRt:hash}, {where:{id:userId}})
    }

    async addRole(dto:AddRoleDto){
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleServive.getRoleByValue(dto.value)

        if (role&&user){
            await user.$add('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }

    async deleteHashedRT(userId:number) {
        await this.userRepository.update({hashedRt:null},
            {where:{id:userId,
                    hashedRt:{[Op.ne]: null}}})
    }

    async ban(dto:BanUserDto){
        const user = await this.userRepository.findByPk(dto.userId)
        if(!user){
           throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        user.banned = true
        user.banReason = dto.banReason
        await user.save()
        return user
    }

    async ChangeUserName(changeUserNameDto: ChangeUserNameDto, userId: number) {
        const user = await this.getUserById(userId)
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        const candidate = await this.getUserByName(changeUserNameDto.userName)
        if(candidate){
            console.log(candidate)
            throw new HttpException('Имя занято, придумайте другое', HttpStatus.FORBIDDEN)
        }

        await this.userRepository.update({userName:changeUserNameDto.userName},
            {where:{id:userId}}
        )
        const userUpdated = await this.userRepository.findByPk(userId)
        const userDTO = new ReturnUserDto(userUpdated)
        return userDTO
    }

    async changeAccountPicNumber(changeAvatarDto: ChangeAvatarDto, userId: number) {
        const user = await this.getUserById(userId)
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }

        await this.userRepository.update({accountPicNumber:changeAvatarDto.accountPicNumber},
            {where:{id:userId}}
        )
        const userUpdated = await this.userRepository.findByPk(userId)
        const userDTO = new ReturnChangeAvatarDto(userUpdated)
        return userDTO
    }

    async changePasspord(changePasswordDto: ChangePasswordDto, userId: number) {
        const user = await this.getUserById(userId)
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }

        const passwordMatches = await bcrypt.compare(changePasswordDto.password, user.password)
        if(!passwordMatches)throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST)
        if(changePasswordDto.newPassword1!==changePasswordDto.newPassword2)throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST)
        const hash = await this.hashData(changePasswordDto.newPassword1)

        await this.userRepository.update({password:hash},
            {where:{id:userId}}
        )
        const userUpdated = await this.userRepository.findByPk(userId)
        const userDTO = new ReturnUserDto(userUpdated)
        return userDTO
    }

    async deleteAccount(userId: number) {
        const user = await this.getUserById(userId)
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }

        let checkRole:boolean = false
        user.roles.map(e=> {
            if (e.value==='WITCH'){
                checkRole = true
            }
        })
        if (checkRole){
            await this.witchRepository.destroy({where:{userId:user.id}})
        }
        await this.userRepository.destroy({where:{id:userId}})
        return HttpStatus.ACCEPTED
    }

    async getDiamonds(userId: number) {
        const user = await this.getUserById(userId)
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        return user.diamonds
    }


}
