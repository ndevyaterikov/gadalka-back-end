import {forwardRef, Module} from "@nestjs/common";
import {MyGateWay} from "./gateway";
import {GatewayService} from "./gateway.service";
import {WsAtStrategy} from "../auth/strategies/ws-at.strategy";
import {UsersModule} from "../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Message} from "../messages/messages.model";
import {MessagesModule} from "../messages/messages.module";
import {CoinsModule} from "../coins/coins.module";
import {CoinsService} from "../coins/coins.service";
import {Coins} from "../coins/coins.model";
import {WitchTasksModule} from "../witch-tasks/witch-tasks.module";


@Module({
    providers:[MyGateWay, GatewayService, WsAtStrategy],
    imports:[
        forwardRef(()=>UsersModule),
        forwardRef(()=>MessagesModule),
        forwardRef(()=>CoinsModule),
        forwardRef(()=>WitchTasksModule),
        SequelizeModule.forFeature([User, Message, Coins, Message]),
    ],
    exports: [MyGateWay,GatewayService]

})
export class GatewayModule{}