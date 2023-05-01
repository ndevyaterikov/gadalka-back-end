import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, Min, MIN} from "class-validator";

export class CoinGiftDto{
    @ApiProperty({example:'1', description:'WitchId отправляем деньги'})
    @IsNumber()
    readonly witchId: number

    @ApiProperty({example:'1', description:'транзакция'})
    @IsNumber()
    @Min(0)
    readonly transaction:number


    constructor(witchId:number, transaction:number) {
        this.transaction= transaction
        this.witchId=witchId
    }

}