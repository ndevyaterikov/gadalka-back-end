import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/user.model";
import {Message} from "./messages.model";


@Table({tableName:'user_messages', createdAt:false, updatedAt:false})
export class UserMessages extends Model<UserMessages> {


    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ForeignKey(()=>Message)
    @Column({type: DataType.INTEGER})
    messageId:number

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

}