import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/roles-auth.decorator"
import {GetCurrentUserId} from "../decorators/get-current-user-id.decorator";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private jwtService: JwtService,
                private reflector:Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        const roles = req.user.roles

        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
                context.getHandler(),
                context.getClass()
            ])
            if (!requiredRoles){
                return true
            }



            return roles.some(role=> requiredRoles.includes(role.value))

        }
        catch (e){
            throw new HttpException('Нет доступа',HttpStatus.FORBIDDEN)
        }

    }

}