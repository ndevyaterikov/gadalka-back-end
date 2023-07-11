import {Body, Controller, Post, Res, UsePipes} from '@nestjs/common';
import {MessagesService} from "../messages/messages.service";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ValidationPipe} from "../pipes/validation.pipe";
import {CreateMessageDto} from "../messages/dto/create-message-dto";
import {GetCurrentUserId} from "../auth/common/decorators/get-current-user-id.decorator";
import {PaymentsService} from "./payments.service";
import {CreatePaymentDto} from "./dto/create-payment-dto";

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
        @Res() res
    ){
        return this.paymentService.createPayment(createPaymentDto, res)
    }


    @ApiOperation({summary:'Апдейты статуса платежа от ЮКасса'})
    @Post('/uptates')
    updatePayment(
        @Body() updateObject,
    ){
        return this.paymentService.updatePayment(updateObject)
    }


}
