import { Module } from '@nestjs/common';
import {GatewayModule} from "./gateway/gateway.module";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/user.model";
import {Role} from "./roles/roles.model";
import {UserRole} from "./roles/user-roles.model";
import { Auth1Module } from './auth1/auth1.module';
import { PostsModule } from './posts/posts.module';
import {Post} from "./posts/posts.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { AuthModule } from './auth/auth.module';
import * as path from 'path'
import {User777} from "./auth/auth.model";
import {APP_GUARD} from "@nestjs/core";
import {AtGuard} from "./auth/common/guards/at.guard";
import { DiamondsModule } from './diamonds/diamonds.module';
import {Diamonds} from "./diamonds/diamonds.model";
import { CoinsModule } from './coins/coins.module';
import {Coins} from "./coins/coins.model";
import { WitchModule } from './witch/witch.module';
import {Witch} from "./witch/witch.model";
import { MessagesModule } from './messages/messages.module';
import {Message} from "./messages/messages.model";
import {UserMessages} from "./messages/user-messages.model";
import {EventEmitterModule} from "@nestjs/event-emitter";
import { TestwsModule } from './testws/testws.module';
import { WitchTasksModule } from './witch-tasks/witch-tasks.module';
import {WitchTasks} from "./witch-tasks/witch-tasks.model";
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import {Payments} from "./payments/payments.model";
import { PriceService } from './price/price.service';
import { PriceModule } from './price/price.module';
import {Price} from "./price/price.model";

@Module({
  imports: [
      EventEmitterModule.forRoot(),
      ConfigModule.forRoot({
          envFilePath:`.${process.env.NODE_ENV}.env`
      }),
      GatewayModule,
      UsersModule,
      AuthModule,
      RolesModule,
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User777, User, Role,
              UserRole, Post, Diamonds,
              Coins, Witch, Message, WitchTasks, Payments, Price],
          autoLoadModels:true,
          synchronize: true,
        }),
      ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname,'static'),
      }),
    Auth1Module,
    PostsModule,
    FilesModule,
    AuthModule,
    DiamondsModule,
    CoinsModule,
    WitchModule,
    MessagesModule,
    TestwsModule,
    WitchTasksModule,
    MailModule,
    PaymentsModule,
    PriceModule,
  ],
  controllers: [PaymentsController],
  providers: [
      {
          provide: APP_GUARD,
          useClass: AtGuard,
      },
      MailService,
  ],
})
export class AppModule {}
