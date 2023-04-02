import {ApiProperty} from "@nestjs/swagger";
import {IsString, Length} from "class-validator";

export class ChangePasswordDto{
    @ApiProperty({example:'pdsfdsf', description:'Текущий пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly password:string

    @ApiProperty({example:'pdsfdsf', description:'Новый пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly newPassword1:string

    @ApiProperty({example:'pdsfdsf', description:'Повторый новый пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly newPassword2:string

}