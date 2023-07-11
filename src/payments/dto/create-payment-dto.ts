import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreatePaymentDto{

    @ApiProperty({example:'399', description:'сумма платежа'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly value: number


    @ApiProperty({example:'Платёт от того-то тому то', description:'Описание платежа'})
    @IsString({message:'Должно быть строкой'})
    @Length(1,100, {message:'Не меньше 1 и не больше 100'})
    readonly description:string


}
