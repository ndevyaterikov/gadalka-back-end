import {Body, Controller, HttpCode, Ip, Post, Res, UsePipes} from '@nestjs/common';
import {MessagesService} from "../messages/messages.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import {CreateMessageDto} from "../messages/dto/create-message-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {PaymentsService} from "./payments.service";
import {CreatePaymentDto} from "./dto/create-payment-dto";
import {Public} from "../auth/common/decorators/public.decorator";

@Controller('payments')
export class PaymentsController {

    constructor(private paymentService: PaymentsService) {
    }

    @ApiOperation({summary:'Проведение платежа'})
    @ApiResponse({status:200})
    @UsePipes(ValidationPipe)
    @Post('/create')
    createPayment(
        @Body() createPaymentDto: CreatePaymentDto,
        @GetCurrentUserId() userId: number
    ){
        return this.paymentService.createPayment(createPaymentDto, userId)
    }


    @Public()
    @ApiOperation({summary:'Апдейты статуса платежа от ЮКасса'})
    @HttpCode(200)
    @Post('/updates')
    updatePayment(
        @Body() updateObject
    ){
        console.log('in updates')
        return this.paymentService.updatePayment(updateObject)
    }


}
