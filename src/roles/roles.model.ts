import {BelongsTo, BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/user.model";
import {UserRole} from "./user-roles.model";

interface RoleCreationAttrs{
    value: string,
    description: string
}

@Table({tableName:'roles'})
export class Role extends Model<Role, RoleCreationAttrs> {

    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ApiProperty({example:'ADMIN', description:'Роль пользователя'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    value:string

    @ApiProperty({example:'Администратор', description:'Описание роли пользователя'})
    @Column({type: DataType.STRING, allowNull:false})
    description: string

    @BelongsToMany(()=>User, ()=>UserRole)
    users: User[]
}