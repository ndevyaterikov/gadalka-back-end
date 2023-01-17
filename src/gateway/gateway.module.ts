import {Module} from "@nestjs/common";
import {MyGateWay} from "./gateway";
import {GatewayService} from "./gateway.service";


@Module({
    providers:[MyGateWay, GatewayService],

})
export class GatewayModule{}