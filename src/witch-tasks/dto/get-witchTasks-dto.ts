import {ApiProperty} from "@nestjs/swagger";
import { IsNumber, IsString, Length} from "class-validator";

export class GetWitchTasksDto{

    @ApiProperty({example:'21', description:'id гадалки у которой чат'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly witchId: number

}