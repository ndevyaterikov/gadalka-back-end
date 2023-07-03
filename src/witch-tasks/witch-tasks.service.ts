import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {WitchTasks} from "./witch-tasks.model";
import {GatewayService} from "../gateway/gateway.service";

@Injectable()
export class WitchTasksService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(WitchTasks) private witchTasksRepository: typeof WitchTasks,

        @Inject(forwardRef(() => GatewayService))
        private gatewayService:GatewayService,

        private userService: UsersService,

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
                order:[[ 'updatedAt','ASC']],
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
        await this.gatewayService.sentCurrentGadaniyeUser(task.userId, task.authorId)
        return tasks
    }

    async getLineForGadaniye(dto) {
        console.log(dto.witchId)
        try {
            const tasks = await this.witchTasksRepository.findAll(
                {
                    where:{userId:dto.witchId, isTaskCompleated:false},
                    order:[[ 'updatedAt','ASC']],
                })

            const tasksWithoutFirst = tasks.filter((task,i,a)=>i>0)
            const authorTasks = tasksWithoutFirst.filter(tasks=>tasks.authorId==dto.authorId)
            const indexes:number[] = []
            authorTasks.forEach(at=>{
                indexes.push(tasksWithoutFirst.findIndex(t=>t.id==at.id)+1)
            })

            return {indexes, userpicId:tasks[0].authorPicId,userName:tasks[0].authorName}
        }
        catch (e) {
            return e

        }
    }
}
