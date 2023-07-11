import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { PriceController } from './price.controller';
import {PriceService} from "./price.service";
import {Price} from "./price.model";
import {AuthModule} from "../auth/auth.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [PriceController],
    imports:[PriceModule,
        SequelizeModule.forFeature([Price]),
        forwardRef(()=>AuthModule),
        JwtModule.register({})
    ],
    providers: [PriceService],
    exports: [PriceService]
})
export class PriceModule {}
