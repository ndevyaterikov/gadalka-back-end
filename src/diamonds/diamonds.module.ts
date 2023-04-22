import { Module } from '@nestjs/common';
import { DiamondsService } from './diamonds.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Post} from "../posts/posts.model";
import {FilesModule} from "../files/files.module";
import {Role} from "../roles/roles.model";
import {UserRole} from "../roles/user-roles.model";
import {Diamonds} from "./diamonds.model";
import { DiamondsController } from './diamonds.controller';
import {CoinsModule} from "../coins/coins.module";

@Module({
  providers: [DiamondsService],
  imports:[
      CoinsModule,
    SequelizeModule.forFeature([User, Diamonds]),
  ],
  controllers: [DiamondsController]
})
export class DiamondsModule {}
