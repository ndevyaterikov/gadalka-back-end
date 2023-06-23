import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user-dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {RolesService} from "../roles/roles.service";
import {Witch} from "./witch.model";
import {CreateWitchDto} from "./dto/create-witch-dto";
import CreateUserDtoFromwitch from "./dto/create-user-dto-fromwitch";
import ResponseWitchDto from "./dto/response-witch-dto";
import {SetOnlineWitchStatusDto} from "./dto/set-online-witch-status-dto";

@Injectable()
export class WitchService {

    constructor(
        @InjectModel(Witch) private witchRepository: typeof Witch,
        @InjectModel(User) private userRepository: typeof User,
        private roleServive: RolesService
    ) {
    }

    async CreateWitch(dto: CreateWitchDto) {
        const userDtoFromWitch = new CreateUserDtoFromwitch(dto)
        const user = await this.userRepository.create(userDtoFromWitch)
        const witch = await this.witchRepository.create({desctription:dto.description, pathLink:dto.pathLink})
        await this.userRepository.update({accountPicNumber:dto.accountPicNumber},{where:{id:user.id}})
        const role = await this.roleServive.getRoleByValue('WITCH')
        await user.$set('roles', [role.id])
        await user.$set('witch', witch.id)
        user.roles = [role]
        user.witch = [witch]
        return user
    }

    async getAllWitch() {
        const allWitch = await this.witchRepository.findAll({
            order:[
                [ 'isOnLine','DESC'],
                [ 'viewers','DESC']
            ],

            include:User
        })
        const response = [] as ResponseWitchDto[]

        allWitch.forEach(w=>{
            response.push(new ResponseWitchDto(w))
        })
        return response
    }

    async upDateViewersOnWitch(witchId:number, viewers:number) {

        try {
            await this.witchRepository.update(
                {
                    viewers:viewers,
                },
                {where:{userId:witchId}})
        }catch (e) {
            console.log(e)
        }

    }

    async setOnLineWitchStatus(setOnlineWitchStatusDto: SetOnlineWitchStatusDto) {
        try {
            await this.witchRepository.update(
                {
                        isOnLine:setOnlineWitchStatusDto.isOnLine,
                },
                {where:{userId:setOnlineWitchStatusDto.witchId}})

            return {id:setOnlineWitchStatusDto.witchId, isOnLine:setOnlineWitchStatusDto.isOnLine}
        }catch (e) {
            console.log(e)
        }

    }
}
