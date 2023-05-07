import {BelongsTo,  Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import {User} from "../users/user.model";


interface WitchTasksCreationAttrs{
    userId: number,
    authorId:number,
    authorPicId:number,
    authorName:string,
    task: string,
    taskType: string,
}

@Table({tableName:'witch-tasks'})
export class WitchTasks extends Model<WitchTasks, WitchTasksCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.INTEGER, allowNull:false})
    authorId:number

    @Column({type: DataType.INTEGER, allowNull:false})
    authorPicId:number

    @Column({type: DataType.STRING, allowNull:false})
    authorName:string

    @Column({type: DataType.STRING, allowNull:false})
    task:string

    @Column({type: DataType.STRING, allowNull:false})
    taskType: string

    @Column({type: DataType.BOOLEAN, allowNull:false, defaultValue:false})
    isTaskCompleated: boolean


    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @BelongsTo(()=>User)
    users: User
}