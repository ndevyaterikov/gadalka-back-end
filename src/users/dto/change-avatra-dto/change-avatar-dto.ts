import {ApiProperty} from "@nestjs/swagger";
import {IsDivisibleBy, IsEmail, IsNumber, IsString, Length, Max, Min} from "class-validator";

export class ChangeAvatarDto{
    @ApiProperty({example:1, description:'Номер аватара от 0 до 8'})
    @IsNumber()
    @IsDivisibleBy(1,{message:"должно быть целое число"})
    @Min(0,{message:'не должно быть меньше 0'})
    @Max(8,{message:'не должно быть больше 8'})
    readonly accountPicNumber:number
}