import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./user.model";
import {Role} from "../roles/roles.model";
import {UserRole} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {Auth1Module} from "../auth1/auth1.module";
import {Post} from "../posts/posts.model";
import {AuthModule} from "../auth/auth.module";
import {Witch} from "../witch/witch.model";
import {MessagesService} from "../messages/messages.service";
import {MessagesModule} from "../messages/messages.module";
import {Message} from "../messages/messages.model";
import {WitchTasks} from "../witch-tasks/witch-tasks.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
      RolesModule,
      SequelizeModule.forFeature([User, Role, UserRole, Post, Witch, Message, WitchTasks]),
      forwardRef(()=>Auth1Module),
      forwardRef(()=>AuthModule),
      forwardRef(()=>MessagesModule),

  ],
  exports:[UsersService, ]
})
export class UsersModule {}
