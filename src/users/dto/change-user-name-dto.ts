import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class ChangeUserNameDto{
    @ApiProperty({example:'userName', description:'Имя пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly userName:string
}