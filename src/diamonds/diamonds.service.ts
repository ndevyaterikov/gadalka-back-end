import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "../posts/posts.model";
import {FilesService} from "../files/files.service";
import {CreatePostDto} from "../posts/dto/CreatePostDto";
import {Diamonds} from "./diamonds.model";
import {DiamondsTransactionDto} from "./dto/diamonds-transaction-dto";
import {Op} from "sequelize";
import {count} from "rxjs";
import {CoinsService} from "../coins/coins.service";
import {CoinsTransactionDto} from "../coins/dto/coins-transaction-dto";
import {DiamonExchangeDto} from "./dto/diamon-exchange-dto";

@Injectable()
export class DiamondsService {

    constructor(@InjectModel(Diamonds) private diamondsRepository: typeof Diamonds,
                private coinsService: CoinsService) {
    }

    async transaction(dto: DiamondsTransactionDto) {
        const transaction = await this.diamondsRepository.create(dto)
        const previouse_transaction = await this.diamondsRepository.findOne({where:{id:transaction.id-1}})


        let diamonds_count_after_transaction
        if (previouse_transaction)
        {diamonds_count_after_transaction = previouse_transaction.diamonds_count + dto.transaction}
        else
        {diamonds_count_after_transaction = dto.transaction}


        if (diamonds_count_after_transaction<0)  {
            await this.diamondsRepository.update(
                {
                    diamonds_count:previouse_transaction.diamonds_count,
                    cause:"операция отклонена"
                },
                {where:{id:transaction.id}})
            throw new HttpException('Недостаточно алмазов', HttpStatus.BAD_REQUEST)
        }

        await this.diamondsRepository.update(
            {
                diamonds_count:diamonds_count_after_transaction,
            },
            {where:{id:transaction.id}})

        return await this.diamondsRepository.findOne({where:{id:transaction.id}})
    }

    async getDiamondsHistory(userId: number, limit:number, page:number) {
        let offset = limit*page -limit
        const diamonds = await this.diamondsRepository.findAll(
            {
                where:{userId:userId},
                order:[[ 'id','DESC']],

                limit:limit,
                offset:offset
            }
        )
        return diamonds
    }

    async getDiamondsTransactionsCount(userId: number) {
        const count = await this.diamondsRepository.count(
            {
                where:{userId:userId},
            }
        )
        return count
    }


    async exchangeDiamonds(dto: DiamondsTransactionDto) {

        const diamondsDto = {...dto, transaction:-dto.transaction}
        const diamondResponse = await this.transaction(diamondsDto)
        const coins_count_exchange = -diamondResponse.transaction/10
        const coinsDTO = new CoinsTransactionDto(dto.userId,coins_count_exchange,dto.cause)
        const coinsResponse = await this.coinsService.transaction(coinsDTO)
        return {
            diamonds_after_transaction: diamondResponse.diamonds_count,
            coins_after_transaction: coinsResponse.coins_count
        }
    }


    async getDiamondsCount(userId: number) {

        const diamonds = await this.diamondsRepository.findOne(
            {
                where:{userId:userId},
                order:[[ 'id','DESC']],
            }
        )
        let diamonds_on_accaunt
        if(diamonds){
            diamonds_on_accaunt = diamonds.diamonds_count
        }else {
            diamonds_on_accaunt = 0
        }

        return {
            diamons_count: diamonds_on_accaunt
        }
    }

}
