import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import ReturnUserDto from "../users/dto/return-user-dto";
import {ValidationPipe} from "../pipes/validation.pipe";
import {ChangeUserNameDto} from "../users/dto/change-user-name-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {IncomingDiamondsDto} from "./dto/incoming-diamonds-dto";
import {UsersService} from "../users/users.service";
import {DiamondsService} from "./diamonds.service";
import {DiamondsTransactionDto} from "./dto/diamonds-transaction-dto";
import {Diamonds} from "./diamonds.model";
import {NUMBER} from "sequelize";
import {DiamondHistoryDto} from "./dto/diamond-history-dto";
import {DiamonExchangeDto} from "./dto/diamon-exchange-dto";

@Controller('diamonds')
export class DiamondsController {

    constructor(private diamondsService: DiamondsService) {
    }

    @ApiOperation({summary:'Транзакция алмазов'})
    @ApiResponse({status:200, type:Diamonds})
    @UsePipes(ValidationPipe)
    @Post('/transaction')
    transactionDiamonds(
        @Body() incoming_dto: IncomingDiamondsDto,
        @GetCurrentUserId() userId: number
    ){
        const dto = new DiamondsTransactionDto(userId, incoming_dto.transaction, incoming_dto.cause)
        return this.diamondsService.transaction(dto)
    }


    @ApiOperation({summary:'Обмен алмазов на монеты'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/exchangeDiamonds')
    exchangeDiamonds(
        @Body() incoming_dto: DiamonExchangeDto,
        @GetCurrentUserId() userId: number
    ){
        const dto = new DiamondsTransactionDto(userId, incoming_dto.transaction, incoming_dto.cause)
        return this.diamondsService.exchangeDiamonds(dto)
    }


    @ApiOperation({summary:'Получить историю транзакций алмазов'})
    @ApiResponse({status:200, type:ReturnUserDto})
    @UsePipes(ValidationPipe)
    @Post('/getdiamondshistory')
    getDiamondsHistory(
        @GetCurrentUserId() userId: number,
        @Body() dto: DiamondHistoryDto,
    ){
        return this.diamondsService.getDiamondsHistory(userId, dto.limit, dto.page)
    }


    @ApiOperation({summary:'Количество транзакций'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Get('/get_diamonds_transacions_count')
    getDiamondsTransactionsCount(
        @GetCurrentUserId() userId: number
    ){
        return this.diamondsService.getDiamondsTransactionsCount(userId)
    }


    @ApiOperation({summary:'Алмазов на счету'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Get('/get_diamonds_count')
    getCoinsCount(
        @GetCurrentUserId() userId: number
    ){
        return this.diamondsService.getDiamondsCount(userId)
    }

}
