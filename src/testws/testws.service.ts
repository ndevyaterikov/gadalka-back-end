import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CoinsService} from "../coins/coins.service";

@Injectable()
export class TestwsService {
    constructor(
        @Inject(forwardRef(() => CoinsService))
        private coinService:CoinsService
    ) {
    }

    async func(){
        this.coinService.getCoinsCount(89)
    }

}
