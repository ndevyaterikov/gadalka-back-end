import {ApiProperty} from "@nestjs/swagger";
import { IsNumber} from "class-validator";

export class DiamondHistoryDto {
    @ApiProperty({example:'3', description:'лимит'})
    @IsNumber()
    readonly limit: number

    @ApiProperty({example:'6', description:'оффсет'})
    @IsNumber()
    readonly page:number

}