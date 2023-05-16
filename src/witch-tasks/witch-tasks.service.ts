import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {GetWitchTasksDto} from "./dto/get-witchTasks-dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Message} from "../messages/messages.model";
import {UsersService} from "../users/users.service";
import {WitchTasks} from "./witch-tasks.model";
import {TypeOfMessageInChat} from "../messages/dto/messages-type";
import {where} from "sequelize";

@Injectable()
export class WitchTasksService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(WitchTasks) private witchTasksRepository: typeof WitchTasks,
        private userService: UsersService
    ) {
    }

    async createWitchTask(param: {readonly witchId: number; readonly authorPicId: number; readonly authorName: string; readonly task: string; readonly type: string; userId: number}) {

        const witch = await this.userRepository.findByPk(param.witchId)
        const dto =
            {userId: param.witchId,
                authorId:param.userId,
                task: param.task,
                authorPicId: param.authorPicId,
                authorName: param.authorName,
                taskType: param.type}

        const task = await this.witchTasksRepository.create (dto)

        if (task&&witch){
            await witch.$add('task', task.id)
            return `создана задача у гадалки ${param.witchId} от пользователя ${param.userId}`
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)


    }

    async getWitchTasks({witchId}) {
        const tasks = await this.witchTasksRepository.findAll(
            {
                where:{userId:witchId, isTaskCompleated:false},
                order:[[ 'updatedAt','DESC']],
            }
        )

        const resArr:{
            taskId:number,
            task:string,
            authorName:string,
            authorId:number,
            userpic:number,
            taskType:string,
            isTaskCompleated:boolean
        }[] = []


        if (tasks){
            tasks.map(r=>resArr.push({
                taskId:r.id,
                task:r.task,
                authorName:r.authorName,
                authorId:r.authorId,
                isTaskCompleated:r.isTaskCompleated,
                userpic:r.authorPicId,
                taskType:r.taskType
            }))
            return resArr
        }
        throw new HttpException('Чат гадалки не найден', HttpStatus.NOT_FOUND)


    }


    async getPendingWitchTasks({witchId}) {
        const tasks = await this.witchTasksRepository.findAll(
            {
                where:{userId:witchId, isTaskCompleated:false},
                order:[[ 'updatedAt','DESC']],
            })

        return tasks
        throw new HttpException('Чат гадалки не найден', HttpStatus.NOT_FOUND)

    }


    async setWitchTaskCompleated(taskId:number){
        try {
            await this.witchTasksRepository.update({isTaskCompleated:true},{where:{id:taskId}})
            const task =await this.witchTasksRepository.findOne({where:{id:taskId}})
            return task
        }
        catch (e){
            throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND)
        }
    }

    async getHistoryOfCompleatedTasks(witchId: number, limit: number, page: number) {
        let offset = limit*page -limit
        const tasks = await this.witchTasksRepository.findAll(
            {
                where:{userId:witchId, isTaskCompleated:true},
                order:[[ 'updatedAt','DESC']],
                limit:limit,
                offset:offset
            }
        )
        return tasks
    }

    async getCompleatedTasksCount(witchId: number) {
        const count = await this.witchTasksRepository.count(
            {
                where:{userId:witchId, isTaskCompleated:true},
            }
        )
        return count
    }

    async setTaskCompleated(taskId: number, limit:number, page:number) {
        await this.witchTasksRepository.update({isTaskCompleated:true}, {where:{id:taskId}})
        const task = await this.witchTasksRepository.findOne({where:{id:taskId}})
        const tasks = await this.getHistoryOfCompleatedTasks(task.userId, limit, page)

        return tasks
    }
}