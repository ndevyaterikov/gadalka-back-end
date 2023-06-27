import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {GetChatDto} from "../messages/dto/get-chat-dto";
import {WitchTasksService} from "./witch-tasks.service";
import {CreateWitchTasksDto} from "./dto/create-witchTasks-dto";
import {GetWitchTasksDto} from "./dto/get-witchTasks-dto";
import {CoinsHistoryDto} from "../coins/dto/coins-history-dto";
import {NUMBER} from "sequelize";
import {TasksHistoryDto} from "./dto/tasks-history-dto";
import {SetTaskCompleatedDto} from "./dto/set-task-compleated-dto";
import {GetLineForGadaniyeDto} from "./dto/getLineForGadaniye-dto";

@Controller('witch-tasks')
export class WitchTasksController {
    constructor(private witchTasksService: WitchTasksService) {
    }

    @ApiOperation({summary:'Создание задачи'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/create')
    createMessage(
        @Body() createWitchTasksDto: CreateWitchTasksDto,
        @GetCurrentUserId() userId: number
    ){
        return this.witchTasksService.createWitchTask({...createWitchTasksDto,userId:userId})
    }

    @ApiOperation({summary:'Получение невыполненных задач'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Get('/getTasks')
    getChat(
        @GetCurrentUserId() witchId: number
    ){
        return this.witchTasksService.getPendingWitchTasks({witchId:witchId})
    }


    @ApiOperation({summary:'Получить историю выполненных задач'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/getHistoryOfCompleatedTasks')
    getHistoryOfCompleatedTasks(
        @Body() dto: TasksHistoryDto,
        @GetCurrentUserId() userId: number
    ){
        return this.witchTasksService.getHistoryOfCompleatedTasks(userId, dto.limit, dto.page)
    }


    @ApiOperation({summary:'Получить количество выполненных задач у гадалки'})
    @ApiResponse({status:200, type:NUMBER})
    @UsePipes(ValidationPipe)
    @Get('/get_compleated_tasks_count')
    getCompleatedTasksCount(
        @GetCurrentUserId() userId: number
    ){
        return this.witchTasksService.getCompleatedTasksCount(userId)
    }


    @ApiOperation({summary:'Отметить задачу: выполнено'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/set_task_compleated')
    setTaskCompleated(
        @Body() dto: SetTaskCompleatedDto,
    ){
        return this.witchTasksService.setTaskCompleated(dto.taskId, dto.limit, dto.page)
    }



    @ApiOperation({summary:'Получить очередь на гадание'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/getLineForGadaniye')
    getLineForGadaniye(@Body() dto:GetLineForGadaniyeDto){
        return this.witchTasksService.getLineForGadaniye(dto)
    }

}
