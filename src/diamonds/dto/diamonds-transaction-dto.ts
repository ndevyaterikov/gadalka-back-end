import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class DiamondsTransactionDto {
    @ApiProperty({example:'1', description:'userId проводящего транзакцию'})
    @IsNumber()
    readonly userId: number

    @ApiProperty({example:'1', description:'транзакция'})
    @IsNumber()
    readonly transaction:number

    @ApiProperty({example:'Подтверждение емейла или обмен на монеты', description:'Причина пранзакции алмазов'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,40, {message:'Не меньше 4'})
    readonly cause:string

    constructor(userId:number, transaction:number, cause:string) {
        this.transaction= transaction
        this.userId=userId
        this.cause=cause
    }

}