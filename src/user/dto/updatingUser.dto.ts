export class RequestUpdatingUserDto {
  firstName: string;
  lastName: string;
  email: string;
  login?: string;
}

export class ErrorUpdatingUser {
  emailError: string[];
  firstNameError: string[];
  lastNameError: string[];
}

export class ResponseUpdatingUserDto {
  errors: ErrorUpdatingUser;
  message: string;
}