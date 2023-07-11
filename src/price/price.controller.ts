import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {CoinsService} from "../coins/coins.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Coins} from "../coins/coins.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import {IncomingCoinsDto} from "../coins/dto/incoming-coins-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {CoinsTransactionDto} from "../coins/dto/coins-transaction-dto";
import {PriceService} from "./price.service";
import {Roles} from "../auth1/roles-auth1.decorator";
import {RolesGuard} from "../auth/common/guards/roles.guard";
import {PriceCreateDto} from "./dto/price-create-dto";
import {Public} from "../auth/common/decorators/public.decorator";

@Controller('price')
export class PriceController {

    constructor(
        private priceService: PriceService) {
    }

    @ApiOperation({summary:'Создание прайса'})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @Post('/createPriceLine')
    createPriceLine(
        @Body() dto: PriceCreateDto,
    ){
      return this.priceService.createPriceLine(dto)
    }


    @Public()
    @ApiOperation({summary:'Получение всего прайса'})
    @UsePipes(ValidationPipe)
    @Get('/getAllPriceLines')
    getAllPriceLines(
    ){
        return this.priceService.getAllPriceLines()
    }


    @ApiOperation({summary:'Обновление прайса'})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    @Post('/updatePriceLine')
    updatePriceLine(
        @Body() dto: PriceCreateDto,
    ){
        return this.priceService.updatePriceLine(dto)
    }

}
