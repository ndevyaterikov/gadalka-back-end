import {IsNumber, IsString} from "class-validator";

export class AddRoleDto{
    @IsString({message:'Должно быть строкой'})
    readonly value:string;

    @IsNumber({},{message:'Должен быть числом'})
    readonly userId:number
}