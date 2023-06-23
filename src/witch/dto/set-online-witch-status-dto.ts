import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDivisibleBy, IsEmail, IsNumber, IsString, Length, Max, Min} from "class-validator";

export class SetOnlineWitchStatusDto{
    @ApiProperty({example:'12', description:'witchId'})
    @IsNumber({},{message:'Некорректный номер гадалки'})
    readonly witchId: number

    @ApiProperty({example:'true', description:'онлайн или нет'})
    @IsBoolean()
    readonly isOnLine: boolean
}