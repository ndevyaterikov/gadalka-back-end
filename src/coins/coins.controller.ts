import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {DiamondsService} from "../diamonds/diamonds.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Diamonds} from "../diamonds/diamonds.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import {IncomingDiamondsDto} from "../diamonds/dto/incoming-diamonds-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {DiamondsTransactionDto} from "../diamonds/dto/diamonds-transaction-dto";
import ReturnUserDto from "../users/dto/return-user-dto";
import {DiamondHistoryDto} from "../diamonds/dto/diamond-history-dto";
import {NUMBER} from "sequelize";
import {CoinsService} from "./coins.service";
import {Coins} from "./coins.model";
import {IncomingCoinsDto} from "./dto/incoming-coins-dto";
import {CoinsTransactionDto} from "./dto/coins-transaction-dto";
import {CoinsHistoryDto} from "./dto/coins-history-dto";
import {BuyCoinsDto} from "./dto/buy-coins-dto";

@Controller('coins')
export class CoinsController {

    constructor(
        private coinsService: CoinsService) {
    }

    @ApiOperation({summary:'Транзакция монет'})
    @ApiResponse({status:200, type:Coins})
    @UsePipes(ValidationPipe)
    @Post('/transactionCoins')
    transactionCoins(
        @Body() incoming_dto: IncomingCoinsDto,
        @GetCurrentUserId() userId: number
    ){
        const dto = new CoinsTransactionDto(userId, incoming_dto.transaction, incoming_dto.cause)
        return this.coinsService.transaction(dto)
    }



    @ApiOperation({summary:'Покупка монет'})
    @ApiResponse({status:200, type:Coins})
    @UsePipes(ValidationPipe)
    @Post('/buyCoins')
    buyCoins(
        @Body() dto: BuyCoinsDto,
        @GetCurrentUserId() userId: number
    ){
      return this.coinsService.buyCoins(dto.description, userId)
    }




    @ApiOperation({summary:'Получить историю транзакций монет'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/getCoinsHistory')
    getCoinsHistory(
        @GetCurrentUserId() userId: number,
        @Body() dto: CoinsHistoryDto,
    ){
        return this.coinsService.getCoinsHistory(userId, dto.limit, dto.page)
    }


    @ApiOperation({summary:'Количество транзакций'})
    @ApiResponse({status:200, type:NUMBER})
    @UsePipes(ValidationPipe)
    @Get('/get_coins_transacions_count')
    getCoinsTransactionsCount(
        @GetCurrentUserId() userId: number
    ){
        return this.coinsService.getCoinsTransactionsCount(userId)
    }


    @ApiOperation({summary:'Монет на счету'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Get('/get_coins_count')
    getCoinsCount(
        @GetCurrentUserId() userId: number
    ){
        return this.coinsService.getCoinsCount(userId)
    }
}
