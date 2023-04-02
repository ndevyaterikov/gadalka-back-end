import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";


interface PostCreationAttrs{
    titel: string,
    content: string,
    userId: number,
    image: string
}

@Table({tableName:'posts'})
export class Post extends Model<Post, PostCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.STRING, allowNull:false})
    titel:string

    @Column({type: DataType.STRING, allowNull:false})
    content: string

    @Column({type: DataType.STRING})
    image:  string

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @BelongsTo(()=>User)
    author: User

}