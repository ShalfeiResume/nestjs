import { UserEntity } from "../user.entity";

export class ErrorCreatingUser {
  emailError: string[];
  loginError: string[];
  passwordError: string[];
}

export class ResponseCreatingUserDto {
  errors: ErrorCreatingUser;
  user: Omit<UserEntity, 'password'>;;
  message: string;
}

export class RequestCreatingUserDto {
  login: string;
  password: string;
  email: string;
  confirmPassword: string;
}