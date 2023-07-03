import {forwardRef, Module} from '@nestjs/common';
import { WitchTasksService } from './witch-tasks.service';
import { WitchTasksController } from './witch-tasks.controller';
import {UsersModule} from "../users/users.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/user.model";
import {WitchTasks} from "./witch-tasks.model";
import {GatewayModule} from "../gateway/gateway.module";

@Module({
  providers: [WitchTasksService],
  controllers: [WitchTasksController],
  imports:[
    forwardRef(()=>UsersModule),
    forwardRef(()=>GatewayModule),
    SequelizeModule.forFeature([User, WitchTasks]),
  ],
  exports:[WitchTasksService]
})
export class WitchTasksModule {}
