import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from "../user/user.service";
import { RequestGetingUserDto } from '../user/dto/getingUser.dto';
 
@Injectable()
export class AuthenticationStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'login' });
  }
  async validate(login: string, password: string): Promise<RequestGetingUserDto> {
      const user = await this.userService.validateAuthorizationUser({login, password});
      if (user.errors !== null) {
        throw new HttpException({
          errors: ['Errors in the sent data'],
          user: null,
          message: 'Need authorization',
        }, HttpStatus.BAD_REQUEST);
      }
      return {login};
  }
}