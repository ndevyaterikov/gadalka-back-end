import { ArgumentsHost, Catch,  UnauthorizedException } from '@nestjs/common';
import {BaseWsExceptionFilter} from "@nestjs/websockets";

@Catch(UnauthorizedException)
export class AllWSExceptionsFilter extends BaseWsExceptionFilter {
 public catch(exception:any, host: ArgumentsHost) {
     host.switchToWs().getClient().send('unauthorized')

}
}

