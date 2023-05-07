import {ApiProperty} from "@nestjs/swagger";
import {IsDivisibleBy, IsEmail, IsNumber, IsString, Length, Max, Min} from "class-validator";

export class CreateWitchDto{
    @ApiProperty({example:'user@user.com', description:'email'})
    @IsString({message:'Должно быть строкой'})
    @IsEmail({},{message:'Некорректный email'})
    readonly email: string

    @ApiProperty({example:'userName', description:'userName'})
    @IsString({message:'Должно быть строкой'})
    readonly userName: string

    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly password:string

    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,16, {message:'Не меньше 4 и не больше 16'})
    readonly secondPassword:string

    @ApiProperty({example:1, description:'Номер аватара от 0 до 8'})
    @IsNumber()
    @IsDivisibleBy(1,{message:"должно быть целое число"})
    @Min(0,{message:'не должно быть меньше 0'})
    @Max(8,{message:'не должно быть больше 8'})
    readonly accountPicNumber:number

    @ApiProperty({example:'Потомственная гадалка', description:'Описание гадалки'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,100, {message:'Не меньше 4 и не больше 100'})
    readonly description:string

    @ApiProperty({example:'gadala', description:'Ссылка на профиль'})
    @IsString({message:'Должно быть строкой'})
    @Length(4,10, {message:'Не меньше 4 и не больше 10'})
    readonly pathLink:string
}