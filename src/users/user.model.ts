import {BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRole} from "../roles/user-roles.model";
import {Post} from "../posts/posts.model";
import {Diamonds} from "../diamonds/diamonds.model";
import {Witch} from "../witch/witch.model";
import {Message} from "../messages/messages.model";
import {UserMessages} from "../messages/user-messages.model";
import {WitchTasks} from "../witch-tasks/witch-tasks.model";

interface UserCreationAttrs{
    email: string,
    password: string,
    userName: string
}

@Table({tableName:'users'})
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ApiProperty({example:'user@user.com', description:'email'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    email:string

    @ApiProperty({example:'userName', description:'user name'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    userName:string

    @ApiProperty({example:'1', description:'any number from 1 to 9'})
    @Column({type: DataType.NUMBER, unique:false, allowNull:false, defaultValue:1})
    accountPicNumber:number

    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull:false})
    password: string

    @ApiProperty({example:'true', description:'Забанен или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue:false})
    banned: boolean

    @ApiProperty({example:'за хулиганство', description:'Причина бана'})
    @Column({type: DataType.STRING, allowNull:true})
    banReason: string

    @ApiProperty({example:'pdsfdsf', description:'Хаш рефреш токена'})
    @Column({type: DataType.STRING, allowNull:true})
    hashedRt: string

    @ApiProperty({example:'pdsfdsf', description:'Ссылка активации'})
    @Column({type: DataType.STRING, allowNull:true})
    activationLink: string

    @ApiProperty({example:'false/true', description:'проверен ли емейл'})
    @Column({type: DataType.STRING, defaultValue:false})
    isEmailActivated: boolean


    @ApiProperty({example:'false/true', description:'первый ли вход после активации емейла?'})
    @Column({type: DataType.STRING, defaultValue:false})
    isFirstTimeAfterActivation: boolean


    @BelongsToMany(()=>Role, ()=>UserRole)
    roles: Role[]

    @HasMany(()=>Message)
    messages: Message[]

    @HasMany(()=>WitchTasks)
    tasks: WitchTasks[]

    @HasMany(()=>Post)
    posts: Post[]

    @HasMany(()=>Diamonds)
    diamonds: Diamonds[]

    @HasOne(()=>Witch)
    witch: Witch[]
}