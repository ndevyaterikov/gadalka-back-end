import {forwardRef, Module} from '@nestjs/common';
import { Auth1Controller } from './auth1.controller';
import { Auth1Service } from './auth1.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [Auth1Controller],
  providers: [Auth1Service],
  imports:[forwardRef(()=>UsersModule), JwtModule.register({
    secret:process.env.PRIVAR_KEY || 'SECRET',
    signOptions:{
      expiresIn:'24h'
    }
  })]
 ,
 exports:[Auth1Service, JwtModule]
})
export class Auth1Module {}
