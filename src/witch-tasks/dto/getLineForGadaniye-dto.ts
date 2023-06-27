import {ApiProperty} from "@nestjs/swagger";
import { IsNumber, IsString, Length} from "class-validator";

export class GetLineForGadaniyeDto{

    @ApiProperty({example:'21', description:'id гадалки у которой очередь'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly witchId: number

    @ApiProperty({example:'21', description:'id автора задачи'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly authorId: number
}