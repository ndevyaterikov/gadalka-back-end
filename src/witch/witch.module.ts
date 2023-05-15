import { Module } from '@nestjs/common';
import { WitchService } from './witch.service';
import { WitchController } from './witch.controller';
import {CoinsModule} from "../coins/coins.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Diamonds} from "../diamonds/diamonds.model";
import {Witch} from "./witch.model";
import {UsersService} from "../users/users.service";
import {Role} from "../roles/roles.model";
import {RolesModule} from "../roles/roles.module";

@Module({
  providers: [WitchService],
  controllers: [WitchController],
  imports:[
    RolesModule,
    SequelizeModule.forFeature([User, Witch, Role]),
  ],
  exports:[WitchService]
})
export class WitchModule {}
