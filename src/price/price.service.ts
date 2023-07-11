import { Injectable } from '@nestjs/common';
import {PriceCreateDto} from "./dto/price-create-dto";
import {InjectModel} from "@nestjs/sequelize";
import {Price} from "./price.model";


@Injectable()
export class PriceService {

    constructor(
        @InjectModel(Price) private priceRepository: typeof Price,
    ) {
    }


    async createPriceLine(dto: PriceCreateDto) {
        const price = await this.priceRepository.create(dto)
        return price
    }

    async getAllPriceLines() {
        const priceLine = await this.priceRepository.findAll()
        return priceLine
    }

    async updatePriceLine(dto: PriceCreateDto) {
        const price = await this.priceRepository.findOne({where:{description:dto.description}})
        price.price = dto.price
        price.description = dto.description
        price.coins_count = dto.coins_count
        await price.save()
        return price
    }
}
