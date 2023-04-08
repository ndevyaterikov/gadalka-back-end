import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";


interface DiamondsCreationAttrs{
    userId: number,
    transaction: number
}

@Table({tableName:'diamonds'})
export class Diamonds extends Model<Diamonds, DiamondsCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.INTEGER})
    transaction:number

    @Column({type: DataType.INTEGER})
    diamonds_count:number

    @Column({type: DataType.STRING})
    cause:string

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @BelongsTo(()=>User)
    owner: User

}