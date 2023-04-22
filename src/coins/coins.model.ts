import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/user.model";


interface CoinsCreationAttrs{
    userId: number,
    transaction: number
}

@Table({tableName:'coins'})
export class Coins extends Model<Coins, CoinsCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.INTEGER})
    transaction:number

    @Column({type: DataType.INTEGER})
    coins_count:number

    @Column({type: DataType.STRING})
    cause:string

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @BelongsTo(()=>User)
    owner: User

}