import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {Injectable} from "@nestjs/common";

@Injectable()
export class WsAtStrategy extends PassportStrategy(Strategy, 'jwt-ws'){
    constructor() {
        super(
            {   jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwtTokenFieldName'),
                ignoreExpiration:false,
                secretOrKey:'at-secret'
            }
        );
    }

    validate(payload: any){
        return payload
    }
}