import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateWitchTasksDto {

    @ApiProperty({example:'21', description:'id гадалки у которой чат'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly witchId: number

    @ApiProperty({example:'Привет!', description:'Задание'})
    @IsString({message:'Должно быть строкой'})
    @Length(1,300, {message:'Не меньше 1 и не больше 300'})
    readonly task:string

    @ApiProperty({example:'простое сообщение/запрос на гадание/приватное задание/подарок', description:'Тип сообщения'})
    @IsString({message:'Должно быть строкой'})
    @Length(1,30, {message:'Не меньше 1 и не больше 30'})
    readonly type:string

    @ApiProperty({example:'3', description:'номер аватраки от 0 до 8'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly authorPicId: number

    @ApiProperty({example:'Таня', description:'Имя автора сообщения'})
    @IsString({message:'Должно быть строкой'})
    @Length(1,100, {message:'Не меньше 1 и не больше 16'})
    readonly authorName:string

}
