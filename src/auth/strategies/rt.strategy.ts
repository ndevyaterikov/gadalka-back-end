import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { Request} from "express";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor() {
        super(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(request:Request)=>{
                    return request?.cookies['jwt-RT']
                }]),
                ignoreExpiration:false,
                secretOrKey:'rt-secret',
                passReqToCallback:true
            }
        );
    }

    async validate(req:Request, payload: any){
        const refreshToken = req.cookies['jwt-RT']
        return {
            ...payload,
            refreshToken
        }
    }
}