import {
    AfterUpdate,
    BeforeCreate,
    BeforeUpdate,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {User} from "../users/user.model";
import { EventEmitter2 } from "@nestjs/event-emitter";

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

    @BeforeUpdate
    @BeforeCreate
    static afterUpdateCoins(instance:Coins) {
        console.log('Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_Coins_updated_')
        console.log('Измеfнение монет на '+instance.transaction + ' у пользователя '
            + instance.userId + ' причина ' + instance.cause)
        // do something
    }
}