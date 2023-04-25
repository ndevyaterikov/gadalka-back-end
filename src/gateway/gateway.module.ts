import {forwardRef, Module} from "@nestjs/common";
import {MyGateWay} from "./gateway";
import {GatewayService} from "./gateway.service";
import {WsAtStrategy} from "../auth/strategies/ws-at.strategy";
import {UsersModule} from "../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Diamonds} from "../diamonds/diamonds.model";
import {Message} from "../messages/messages.model";
import {MessagesService} from "../messages/messages.service";
import {MessagesModule} from "../messages/messages.module";


@Module({
    providers:[MyGateWay, GatewayService, WsAtStrategy],
    imports:[
        forwardRef(()=>UsersModule),
        forwardRef(()=>MessagesModule),
        SequelizeModule.forFeature([User, Message]),
    ]

})
export class GatewayModule{}