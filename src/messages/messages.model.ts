import {BelongsTo,  Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import {User} from "../users/user.model";


interface MessageCreationAttrs{
    userId: number,
    authorId:number,
    authorPicId:number,
    authorName:string,
    message: string,
    type: string,
}

@Table({tableName:'messages'})
export class Message extends Model<Message, MessageCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number


    @Column({type: DataType.INTEGER, allowNull:false})
    authorId:number

    @Column({type: DataType.INTEGER, allowNull:false})
    authorPicId:number

    @Column({type: DataType.STRING, allowNull:false})
    authorName:string

    @Column({type: DataType.STRING, allowNull:false})
    message:string

    @Column({type: DataType.STRING, allowNull:false})
    type: string

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number


    @BelongsTo(()=>User)
    users: User

}