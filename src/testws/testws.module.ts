import {forwardRef, Module} from '@nestjs/common';
import { TestwsService } from './testws.service';
import {MessagesService} from "../messages/messages.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Coins} from "../coins/coins.model";
import {Message} from "../messages/messages.model";
import {MessagesModule} from "../messages/messages.module";
import {GatewayModule} from "../gateway/gateway.module";
import {CoinsModule} from "../coins/coins.module";

@Module({
  providers: [TestwsService],
  imports:[
    SequelizeModule.forFeature([User, Coins, Message]),
    forwardRef(()=>CoinsModule),
  ],
  exports:[TestwsService]
})
export class TestwsModule {}
