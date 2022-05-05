import { UserEntity } from "../user.entity";

export class ErrorAuthorizationUser {
  loginError: string[];
  passwordError: string[];
}

export class ResponseAuthorizationUserDto {
  errors: ErrorAuthorizationUser;
  user: Omit<UserEntity, 'password'>;;
  message: string;
}

export class RequestAuthorizationUserDto {
  login: string;
  password: string;
}