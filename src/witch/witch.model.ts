import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRole} from "../roles/user-roles.model";
import {Post} from "../posts/posts.model";
import {Diamonds} from "../diamonds/diamonds.model";
import {User} from "../users/user.model";

interface WitchCreationAttrs{
    desctription: string,
    pathLink:string
}

@Table({tableName:'witch'})
export class Witch extends Model<Witch, WitchCreationAttrs> {

    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ApiProperty({example:'Потомственная гадалка', description:'описание'})
    @Column({type: DataType.STRING, allowNull:false})
    desctription:string

    @ApiProperty({example:'30', description:'viewers'})
    @Column({type: DataType.INTEGER, defaultValue:0})
    viewers:number

    @ApiProperty({example:'/picture.jpeg', description:'Ссылка на обложку'})
    @Column({type: DataType.STRING, allowNull:false, defaultValue:'defaultCover.jpeg'})
    linkToCover: string


    @ApiProperty({example:'/gadayu', description:'Ссылка на профиль'})
    @Column({type: DataType.STRING, allowNull:false, unique:true})
    pathLink: string

    @ApiProperty({example:'статус', description:'online/offline'})
    @Column({type: DataType.BOOLEAN, allowNull:false, defaultValue:false})
    isOnLine: boolean

    @ApiProperty({example:'статус', description:'private or no'})
    @Column({type: DataType.BOOLEAN, allowNull:false, defaultValue:false})
    isPrivate: boolean

    @ApiProperty({example:'Замьючен ли микрофон', description:'Mute on/ mute off'})
    @Column({type: DataType.BOOLEAN, allowNull:false, defaultValue:true})
    isMicMuted: boolean


    @ApiProperty({example:'120', description:'Рейтинг'})
    @Column({type: DataType.INTEGER, allowNull:true, defaultValue:0})
    rating: number

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userId:number

    @BelongsTo(()=>User)
    owner: User

}