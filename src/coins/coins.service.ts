import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Diamonds} from "../diamonds/diamonds.model";
import {Coins} from "./coins.model";
import {CoinsTransactionDto} from "./dto/coins-transaction-dto";
import {ReturnCoinsDto} from "./dto/return-coins-dto";
import {WsException} from "@nestjs/websockets";
import {MyGateWay} from "../gateway/gateway";
import {GatewayService} from "../gateway/gateway.service";
import {MessagesService} from "../messages/messages.service";
import {TestwsService} from "../testws/testws.service";



@Injectable()
export class CoinsService {

    constructor(

        @InjectModel(Coins) private coinsRepository: typeof Coins,

        @Inject(forwardRef(() => GatewayService))
        private gatewayService:GatewayService

    ){}

    async transaction(dto: CoinsTransactionDto) {
        const previouse_transaction = await this.getCoinsCount(dto.userId)

        const transaction = await this.coinsRepository.create(dto)
        const previouse_transaction1 = await this.coinsRepository.findOne({where:{id:transaction.id-1}})

        let coins_count_after_transaction
        if (previouse_transaction)
        {coins_count_after_transaction = previouse_transaction.coins_count + dto.transaction}
        else
        {coins_count_after_transaction = dto.transaction}


        if (coins_count_after_transaction<0)  {
            await this.coinsRepository.update(
                {
                    coins_count:previouse_transaction.coins_count,
                    cause:"операция отклонена"
                },
                {where:{id:transaction.id}})
            throw new HttpException('Недостаточно монет', HttpStatus.FORBIDDEN)
        }

        await this.coinsRepository.update(
            {
                coins_count:coins_count_after_transaction,
            },
            {where:{id:transaction.id}})
        const transactionReturn = await this.coinsRepository.findOne({where:{id:transaction.id}})
        const transDTO = new ReturnCoinsDto(
            transactionReturn.userId,
            transactionReturn.transaction,
            transactionReturn.cause,
            transactionReturn.coins_count,
            transactionReturn.id
            )
        this.gatewayService.onCoinsUpdated(transactionReturn.userId,transactionReturn.coins_count)
        return transDTO
    }

   /* async transactionWS(dto: CoinsTransactionDto) {
        const previouse_transaction = await this.getCoinsCount(dto.userId)

        const transaction = await this.coinsRepository.create(dto)
        const previouse_transaction1 = await this.coinsRepository.findOne({where:{id:transaction.id-1}})

        let coins_count_after_transaction
        if (previouse_transaction)
        {coins_count_after_transaction = previouse_transaction.coins_count + dto.transaction}
        else
        {coins_count_after_transaction = dto.transaction}


        if (coins_count_after_transaction<0)  {
            await this.coinsRepository.update(
                {
                    coins_count:previouse_transaction.coins_count,
                    cause:"операция отклонена"
                },
                {where:{id:transaction.id}})
            throw new WsException('Недостаточно монет')
        }

        await this.coinsRepository.update(
            {
                coins_count:coins_count_after_transaction,
            },
            {where:{id:transaction.id}})
        const transactionReturn = await this.coinsRepository.findOne({where:{id:transaction.id}})
        const transDTO = new ReturnCoinsDto(
            transactionReturn.userId,
            transactionReturn.transaction,
            transactionReturn.cause,
            transactionReturn.coins_count,
            transactionReturn.id
        )
        return transDTO
    }
*/



    async getCoinsHistory(userId: number, limit: number, page: number) {
        let offset = limit*page -limit
        const coins = await this.coinsRepository.findAll(
            {
                where:{userId:userId},
                order:[[ 'id','DESC']],
                limit:limit,
                offset:offset
            }
        )
        return coins
    }

    async getCoinsTransactionsCount(userId: number) {
        const count = await this.coinsRepository.count(
            {
                where:{userId:userId},
            }
        )
        return count
    }

    async getCoinsCount(userId: number) {

        const coins_count = await this.coinsRepository.findOne(
            {
                where:{userId:userId},
                order:[[ 'id','DESC']],
            }
        )
        let coins_on_acaunt
        if(coins_count){
            coins_on_acaunt = coins_count.coins_count
        }else {
            coins_on_acaunt = 0
        }
        return {
            coins_count: coins_on_acaunt
        }
    }

    async buyCoins(description: string, userId: number) {

    }
}
