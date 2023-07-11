import {forwardRef, Module} from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Coins} from "./coins.model";
import {GatewayModule} from "../gateway/gateway.module";
import {Message} from "../messages/messages.model";
import {MessagesModule} from "../messages/messages.module"
import {TestwsModule} from "../testws/testws.module";

@Module({
  controllers: [CoinsController],
  imports:[
    SequelizeModule.forFeature([User, Coins, Message]),
    forwardRef(()=>MessagesModule),
    forwardRef(()=>GatewayModule),
    forwardRef(()=>TestwsModule),
  ],
  providers: [CoinsService],
  exports: [CoinsService]
})
export class CoinsModule {}
