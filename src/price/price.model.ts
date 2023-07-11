import {
    Column,
    DataType,
    Model,
    Table
} from "sequelize-typescript";

interface PriceCreationAttrs{
    description:string,
    coins_count:number,
    price:string
}

@Table({tableName:'price'})
export class Price extends Model<Price, PriceCreationAttrs> {

    @Column({type: DataType.INTEGER, autoIncrement:true, unique:true, primaryKey:true})
    id: number

    @Column({type: DataType.STRING})
    description:string

    @Column({type: DataType.INTEGER})
    coins_count:number

    @Column({type: DataType.STRING})
    price:string

}