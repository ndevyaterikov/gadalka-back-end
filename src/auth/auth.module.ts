import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User777} from "./auth.model";
import {AtStrategy} from "./strategies/at.strategy";
import {RtStrategy} from "./strategies/rt.strategy";
import {JwtModule} from "@nestjs/jwt";
import {User} from "../users/user.model";
import {UsersModule} from "../users/users.module";
import {WitchModule} from "../witch/witch.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  imports:[
      forwardRef(()=>UsersModule),
      forwardRef(()=>WitchModule),
      SequelizeModule.forFeature([User]),
      JwtModule.register({})
  ],
})
export class AuthModule {}
