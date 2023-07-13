import {forwardRef, HttpStatus, Inject, Injectable, Res} from '@nestjs/common';
import {CreatePaymentDto} from "./dto/create-payment-dto";
import {v4} from "uuid"
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';
import {InjectModel} from "@nestjs/sequelize";
import {Coins} from "../coins/coins.model";
import {GatewayService} from "../gateway/gateway.service";
import {Payments} from "./payments.model";
import {CoinsService} from "../coins/coins.service";
import {CoinsTransactionDto} from "../coins/dto/coins-transaction-dto";
import {PriceService} from "../price/price.service";

@Injectable()
export class PaymentsService {

    constructor(

        @InjectModel(Payments) private paymentsRepository: typeof Payments,
        private coinsService: CoinsService,
        private priceService: PriceService
    ){}

    async createPayment(createPaymentDto: CreatePaymentDto, userId) {
        const checkout = new YooCheckout({ shopId: '229784', secretKey: 'test_D12k7Ewb4TPrYV01HXfWcZvItPwxI3sQS2e10PEjadI'});
        const idempotenceKey = v4();

        const createPayload: ICreatePayment = {
            amount: {
                value: String(createPaymentDto.value),
                currency: 'RUB'
            },

            confirmation: {
                type: 'redirect',
                return_url: `${process.env.FRONT_URL}`
            },
            capture:true,
            description:createPaymentDto.description,

        };

        try {
            const payment = await checkout.createPayment(createPayload, idempotenceKey);
            console.log(payment)
            console.log(payment.confirmation.confirmation_url)

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

            return payment.confirmation.confirmation_url


        } catch (error) {
            console.log('in error')
            console.error(error);
        }

    }

    async updatePayment(updateObject) {

        if(typeof updateObject.object!=='undefined'){
            const payment = await this.paymentsRepository.findOne({where:{paymentId:updateObject.object.id}})


        if (payment){
            if (payment.status==='pending'){
                switch(updateObject.object.status) {
                    case 'succeeded': {
                        payment.status='succeeded'
                        await payment.save()
                        await this.recordCoinsTransaction(payment.userId, payment.paymentId,payment.description)
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

    private async recordCoinsTransaction(userId:number, paymentId:string, description:string) {

        const price = await this.priceService.getAllPriceLines()
        const transaction = price.find(f=>f.description===description).coins_count
        const dto = new CoinsTransactionDto(userId, transaction, 'Номер платежа в ЮКасса: '+paymentId)
        await this.coinsService.transaction(dto)
    }
}
