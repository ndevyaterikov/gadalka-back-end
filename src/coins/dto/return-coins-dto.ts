import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class ReturnCoinsDto{
    @ApiProperty({example:'1', description:'Id транзакции'})
    @IsNumber()
    readonly id: number

    @ApiProperty({example:'1', description:'userId проводящего транзакцию'})
    @IsNumber()
    readonly userId: number

    @ApiProperty({example:'1', description:'транзакция'})
    @IsNumber()
    readonly transaction:number

    @ApiProperty({example:'1', description:'транзакция'})
    @IsNumber()
    readonly coins_count:number

    @ApiProperty({example:'Покупка или оплата', description:'Причина транзакции монет'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,40, {message:'Не меньше 4'})
    readonly cause:string

    constructor(userId:number, transaction:number, cause:string, coins_count:number, id:number) {
        this.transaction= transaction
        this.userId=userId
        this.cause=cause
        this.coins_count = coins_count
        this.id = id
    }

}