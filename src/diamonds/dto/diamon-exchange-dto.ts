import {ApiProperty} from "@nestjs/swagger";
import {IsDivisibleBy, IsEmail, IsNumber, IsString, Length, Min} from "class-validator";

export class DiamonExchangeDto {

    @ApiProperty({example:'1', description:'транзакция'})
    @IsNumber()
    @Min(1,{message:'Число алмазов не должно отрицательным'})
    @IsDivisibleBy(10, {message:'Число алмазов должно быть кратным 10'})
    readonly transaction:number

    @ApiProperty({example:'Подтверждение емейла или обмен на монеты', description:'Причина пранзакции алмазов'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,40, {message:'Не меньше 4'})
    readonly cause:string

    constructor(userId:number, transaction:number) {
        this.transaction= transaction
    }

}