import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Post} from "../posts/posts.model";
import {FilesService} from "../files/files.service";
import {CreatePostDto} from "../posts/dto/CreatePostDto";
import {Diamonds} from "./diamonds.model";
import {DiamondsTransactionDto} from "./dto/diamonds-transaction-dto";
import {Op} from "sequelize";
import {count} from "rxjs";

@Injectable()
export class DiamondsService {

    constructor(@InjectModel(Diamonds) private diamondsRepository: typeof Diamonds) {
    }

    async transaction(dto: DiamondsTransactionDto) {
        const transaction = await this.diamondsRepository.create(dto)
        const previouse_transaction = await this.diamondsRepository.findOne({where:{id:transaction.id-1}})
        const diamonds_count_after_transaction = previouse_transaction.diamonds_count + dto.transaction

        if (diamonds_count_after_transaction<0)  {
            await this.diamondsRepository.update(
                {
                    diamonds_count:previouse_transaction.diamonds_count,
                    cause:"операция отклонена"
                },
                {where:{id:transaction.id}})
            throw new HttpException('Недостаточно алмазов', HttpStatus.FORBIDDEN)
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
}
