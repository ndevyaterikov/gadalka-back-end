import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto{
    @ApiProperty({example:'user@user.com', description:'email'})
    @IsString({message:'Должно быть строкой'})
    @IsEmail({},{message:'Некорректный email'})
    readonly email: string

    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly password:string


    @ApiProperty({example:'7fe0dc8a-c9e9-4f10-9c55-47d4af6a6f30', description:'v4 random link'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,60, {message:'Не меньше 4 и не больше 60'})
    readonly activationLink:string
}