import {Injectable, Res} from '@nestjs/common';
import {CreatePaymentDto} from "./dto/create-payment-dto";
import {v4} from "uuid"
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';

@Injectable()
export class PaymentsService {
    async createPayment(createPaymentDto: CreatePaymentDto,  res) {
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

            description:createPaymentDto.description
        };

        try {
            const payment = await checkout.createPayment(createPayload, idempotenceKey);
            console.log(payment)
            res.redirect(payment.confirmation.confirmation_url)

        } catch (error) {
            console.log('in error')
            console.error(error);
        }

    }

    async updatePayment(updateObject) {
        console.log('updateObject: ')
        console.log(updateObject)
        return(updateObject)
    }
}
