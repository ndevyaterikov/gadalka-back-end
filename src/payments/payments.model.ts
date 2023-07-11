import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";
import {Coins} from "../coins/coins.model";


interface PaymentsCreationAttrs{
    paymentId: string,
    userId:number,
    status: string,
    amount: string,
    currency: string,
    description: string,
    recipient_account_id:string,
    recipient_gateway_id:string,
}

@Table({tableName:'payments'})
export class Payments extends Model<Payments, PaymentsCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.STRING})
    paymentId: string

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @ForeignKey(()=>Coins)
    @Column({type: DataType.INTEGER})
    transactionId:number

    @Column({type: DataType.STRING})
    status: string

    @Column({type: DataType.STRING})
    amount: string

    @Column({type: DataType.STRING})
    currency: string

    @Column({type: DataType.STRING})
    description: string

    @Column({type: DataType.STRING})
    recipient_account_id:string

    @Column({type: DataType.STRING})
    recipient_gateway_id:string

    @Column({type: DataType.STRING})
    payment_method_type:string

    @Column({type: DataType.STRING})
    payment_method_title:string

}