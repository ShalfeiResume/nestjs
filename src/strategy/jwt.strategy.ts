import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RequestGetingUserDto } from "../user/dto/getingUser.dto";
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(){
        super({
            ignoreExpiration: false,
            secretOrKey:"Salt",
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
                const data = request?.cookies["auth-cookie"];
                if(!data){
                  throw new HttpException({
                    errors: ['Errors in the sent data'],
                    user: null,
                    message: 'Need authorization',
                  }, HttpStatus.BAD_REQUEST);
                }
                return data.token
            }])
        });
    }
 
    async validate(payload: RequestGetingUserDto){
        if(payload === null){
          throw new HttpException({
            errors: ['Errors in the sent data'],
            user: null,
            message: 'Need authorization',
          }, HttpStatus.BAD_REQUEST);
        }
        return {
          login: payload?.login
        };
    }
}