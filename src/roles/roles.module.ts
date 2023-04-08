import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {Role} from "./roles.model";
import {UserRole} from "./user-roles.model";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports:[
    SequelizeModule.forFeature([Role, User, UserRole])
  ],
  exports:[RolesService]
})
export class RolesModule {}
