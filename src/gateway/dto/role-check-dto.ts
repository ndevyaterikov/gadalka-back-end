import {ApiProperty} from "@nestjs/swagger";
import { IsNumber, IsString, Length} from "class-validator";

export class RoleCheckDto{

    @ApiProperty({example:'21', description:'id пользователя'})
    @IsNumber({},{message:'Должно быть числом'},)
    readonly witchId: number

}
