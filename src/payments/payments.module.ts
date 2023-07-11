import {forwardRef, Module} from '@nestjs/common';
import {CoinsController} from "../coins/coins.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Coins} from "../coins/coins.model";
import {PaymentsController} from "./payments.controller";
import {PaymentsService} from "./payments.service";
import {Payments} from "./payments.model";

@Module({
    controllers: [PaymentsController],
    imports:[
        SequelizeModule.forFeature([User, Coins, Payments]),
    ],
    providers: [PaymentsService],
    exports: [PaymentsService]
})
export class PaymentsModule {}
