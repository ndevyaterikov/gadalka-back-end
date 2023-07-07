import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class ValueDto{
    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,60, {message:'Не меньше 4 и не больше 16'})
    readonly value:string

}