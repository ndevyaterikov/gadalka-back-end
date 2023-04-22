import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";
import {CanActivate, ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {AuthService} from "../../auth.service";
import {Socket} from "socket.io";
import {WsException} from "@nestjs/websockets";
import {Observable} from "rxjs";
import jwt_decode from "jwt-decode"

@Injectable()
export class WsAtGuard extends AuthGuard('jwt-ws'){
    constructor(private reflector:Reflector) {
        super();
    }

    getRequest(context:ExecutionContext){
       return context.switchToWs().getClient().handshake
    }

    canActivate(context:ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) return true

        return super.canActivate(context)
    }
}

/*
export class WsAtGuard implements CanActivate {
    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        console.log(context.args[0].handshake.query.jwtTokenFieldName)
        const bearerToken = context.args[0].handshake.query.jwtTokenFieldName;
        try {
            const decoded = jwt_decode(bearerToken)
            return new Promise((resolve, reject) => {
                console.log(decoded)
                return true
            });
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}*/