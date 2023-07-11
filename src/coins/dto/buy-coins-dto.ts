import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class BuyCoinsDto {

    @ApiProperty({example:'10Coins', description:'что именно покупаем'})
    @IsNumber()
    readonly description:string

}