import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { UserService } from "../user/user.service";
import { RequestGetingUserDto } from '../user/dto/getingUser.dto';
 
@Injectable()
export class RegistartionStrategy extends PassportStrategy(Strategy, 'create') {
  constructor(private readonly userService: UserService) {
    super({ 
      usernameField: 'login',
      passwordField: 'password',
      passReqToCallback: true 
    });
  }
  async validate(req: Request): Promise<RequestGetingUserDto> {
      const valid = await this.userService.validateCreatingUser({
        login: req?.query?.login as string ?? '',
        password: req?.query?.password as string ?? '',
        email: req?.query?.email as string ?? '',
        confirmPassword: req?.body?.confirmPassword as string ?? '',
      });
     
      if (valid.errors !== null) {
        throw new HttpException({
          errors: valid.errors,
          user: null,
          message: 'Need authorization',
        }, HttpStatus.UNAUTHORIZED);
      }

      const user = {
        login: req?.body?.login,
      }
     
      return user;
  }
}