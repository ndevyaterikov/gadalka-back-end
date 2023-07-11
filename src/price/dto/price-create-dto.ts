import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class PriceCreateDto {

    @ApiProperty({example:'10Coins', description:'что именно покупаем/название покупки'})
    @IsString()
    readonly description:string

    @ApiProperty({example:'10', description:'количество монет'})
    @IsNumber()
    readonly coins_count:number

    @ApiProperty({example:'399', description:'строка но цифрами в рублях'})
    @IsString()
    readonly price:string


}