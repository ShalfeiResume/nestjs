import { UserEntity } from "../user.entity";

export class ErrorGettingUser {
  emailError: string[];
  loginError: string[];
  passwordError: string[];
}

export class ResponseGetingUserDto {
  errors: ErrorGettingUser;
  user: Omit<UserEntity, 'password'>;
  message: string;
}

export class RequestGetingUserDto {
  login: string;
}