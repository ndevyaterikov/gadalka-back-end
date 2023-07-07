import { Module } from '@nestjs/common';
import {MailService} from "./mail.service";
import {CoinsService} from "../coins/coins.service";

@Module({
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
