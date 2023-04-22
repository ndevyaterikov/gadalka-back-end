import {Module} from "@nestjs/common";
import {MyGateWay} from "./gateway";
import {GatewayService} from "./gateway.service";
import {WsAtStrategy} from "../auth/strategies/ws-at.strategy";


@Module({
    providers:[MyGateWay, GatewayService, WsAtStrategy],

})
export class GatewayModule{}