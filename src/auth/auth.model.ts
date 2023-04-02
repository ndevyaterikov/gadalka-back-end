import { Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";


interface UserCreationAttrs{
    email: string,
    password: string
}

@Table({tableName:'auth'})
export class User777 extends Model<User777, UserCreationAttrs> {

    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @ApiProperty({example:'user@user.com', description:'email'})
    @Column({type: DataType.STRING, unique:true, allowNull:false})
    email:string

    @ApiProperty({example:'pdsfdsf', description:'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull:false})
    password: string

    @ApiProperty({example:'pdsfdsf', description:'Хаш рефреш токена'})
    @Column({type: DataType.STRING, allowNull:true})
    hashedRt: string

}