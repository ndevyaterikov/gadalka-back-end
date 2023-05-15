import {forwardRef, Module} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import {CoinsModule} from "../coins/coins.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Diamonds} from "../diamonds/diamonds.model";
import {UsersModule} from "../users/users.module";
import {Message} from "./messages.model";
import {UsersService} from "../users/users.service";

@Module({
  providers: [MessagesService],
  controllers: [MessagesController],
  imports:[
    forwardRef(()=>UsersModule),
    SequelizeModule.forFeature([User, Diamonds, User, Message]),
  ],
  exports:[MessagesService]
})
export class MessagesModule {}
