import {forwardRef, HttpStatus, Inject, Injectable, Res} from '@nestjs/common';
import {CreatePaymentDto} from "./dto/create-payment-dto";
import {v4} from "uuid"
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';
import {InjectModel} from "@nestjs/sequelize";
import {Coins} from "../coins/coins.model";
import {GatewayService} from "../gateway/gateway.service";
import {Payments} from "./payments.model";

@Injectable()
export class PaymentsService {

    constructor(

        @InjectModel(Payments) private paymentsRepository: typeof Payments,

    ){}

    async createPayment(createPaymentDto: CreatePaymentDto,  res, userId) {
        const checkout = new YooCheckout({ shopId: '229784', secretKey: 'test_D12k7Ewb4TPrYV01HXfWcZvItPwxI3sQS2e10PEjadI'});
        const idempotenceKey = v4();

        const createPayload: ICreatePayment = {
            amount: {
                value: String(createPaymentDto.value),
                currency: 'RUB'
            },

            confirmation: {
                type: 'redirect',
                return_url: 'http://localhost:3000/'
            },
            capture:true,
            description:createPaymentDto.description,

        };

        try {
            const payment = await checkout.createPayment(createPayload, idempotenceKey);
            console.log(payment)

            await this.paymentsRepository.create(
                {
                    paymentId: payment.id,
                    userId:userId,
                    status: payment.status,
                    amount: payment.amount.value,
                    currency: payment.amount.currency,
                    description: payment.description,
                    recipient_account_id:payment.recipient.account_id,
                    recipient_gateway_id:payment.recipient.gateway_id
                })

            res.redirect(payment.confirmation.confirmation_url)
        } catch (error) {
            console.log('in error')
            console.error(error);
        }

    }

    async updatePayment(updateObject, ip) {
        console.log('request from ip: ')
        console.log(ip)

        console.log('updateObject: ')
        console.log(updateObject)

        if(typeof updateObject.object!=='undefined'){
            const payment = await this.paymentsRepository.findOne({where:{paymentId:updateObject.object.id}})


        if (payment){
            if (payment.status==='pending'){
                switch(updateObject.object.status) {
                    case 'succeeded': {
                        payment.status='succeeded'
                        await payment.save()
                    }
                        break

                    case 'canceled': {
                        payment.status='canceled'
                        await payment.save()
                    }
                        break

                    default:
                        break
                }

            }
        }

        }
        return HttpStatus.OK

    }
}
