import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";
import {Role} from "./roles.model";


@Table({tableName:'user_roles', createdAt:false, updatedAt:false})
export class UserRole extends Model<UserRole> {


    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ForeignKey(()=>Role)
    @Column({type: DataType.INTEGER})
    roleId:number

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

}