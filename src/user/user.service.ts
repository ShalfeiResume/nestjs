import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RequestGetingUserDto, ResponseGetingUserDto } from "./dto/getingUser.dto";
import { RequestCreatingUserDto, ResponseCreatingUserDto } from "./dto/creatingUser.dto";
import { UserEntity } from "./user.entity";
import { RequestUpdatingUserDto, ResponseUpdatingUserDto } from "./dto/updatingUser.dto";
import { RequestAuthorizationUserDto, ResponseAuthorizationUserDto } from "./dto/authorizationUser.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity>, private jwtService:JwtService) {}
  
  async getUser (requestGetingUserDto: RequestGetingUserDto): Promise<ResponseGetingUserDto> {
    const user = await this.userRepository.findOne({login: requestGetingUserDto.login});
    const {password, ...userWithoutPassword} = user;
    const gettingUser = {
      errors: null,
      user: userWithoutPassword,
      message:'User successfully getted',
    }
    return gettingUser;
  }

  async createUser (requestCreatingUserDto: RequestCreatingUserDto): Promise<ResponseCreatingUserDto> {
    const resultValidation = await this.validateCreatingUser(requestCreatingUserDto);
    return resultValidation
  }

  async authUser (requestAuthorizationgUserDto: RequestAuthorizationUserDto): Promise<ResponseAuthorizationUserDto> {
    const resultValidation = await this.validateAuthorizationUser(requestAuthorizationgUserDto);
    return resultValidation
  }
 
  async updateUser (requestUpdatingUserDto: RequestUpdatingUserDto): Promise<ResponseUpdatingUserDto> {
    const resultValidation = await this.validateUpdatingUser(requestUpdatingUserDto);
    if(!resultValidation.errors){
      const user = await this.userRepository.findOne({login: requestUpdatingUserDto.login});
      await this.userRepository.update({id: user.id}, {...requestUpdatingUserDto});
    }
    return resultValidation
  }

  async getJwtToken(coookieData:RequestGetingUserDto): Promise<string>{
    const payload = {
     ...coookieData
    }
    return this.jwtService.signAsync(payload);
  }

  async validateCreatingUser (requestCreatingUserDto: RequestCreatingUserDto): Promise<ResponseCreatingUserDto>{
    const creatingUser = {
      errors: null,
      user: null,
      message:'User successfully created',
    }

    // Password validation

    if (!requestCreatingUserDto.password || !requestCreatingUserDto.confirmPassword) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Password and Confirm password can't be empty"]};
      creatingUser.message = 'Error creating user';
    }

    if (requestCreatingUserDto.password !== requestCreatingUserDto.confirmPassword) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Confirm password not matching"]};
      creatingUser.message = 'Error creating user';
    }

    if (!/^[a-z0-9_-]{3,16}$/.test(requestCreatingUserDto.password)) {
      creatingUser.errors = {...creatingUser?.errors, passwordError: [...creatingUser?.errors?.passwordError ?? [], "Maximum password length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      creatingUser.message = 'Error creating user';
    }

    // Email validation

    if (!requestCreatingUserDto.email) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Email can't be empty"] };
      creatingUser.message = 'Error creating user';
    }

    if (!/^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/.test(requestCreatingUserDto.email)) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Maximum email length must be 2-6 characters and have got symbol '@'. Valid characters 'a-z 0-9 _ - .'"]};
      creatingUser.message = 'Error creating user';
    }

    const userByEmail = await this.userRepository.findOne({ email: requestCreatingUserDto.email });

    if (userByEmail && userByEmail.email) {
      creatingUser.errors = {...creatingUser?.errors, emailError: [...creatingUser?.errors?.emailError ?? [], "Email already exist"]};
      creatingUser.message = 'Error creating user';
    }

    // Login validation

    if (!requestCreatingUserDto.login) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Login can't be empty"]};
      creatingUser.message = 'Error creating user';
    }

    if (!/^[a-z0-9_-]{3,16}$/.test(requestCreatingUserDto.login)) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Maximum login length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      creatingUser.message = 'Error creating user';
    }

    const userByLogin = await this.userRepository.findOne({ login: requestCreatingUserDto.login });

    if (userByLogin && userByLogin.login) {
      creatingUser.errors = {...creatingUser?.errors, loginError: [...creatingUser?.errors?.loginError ?? [], "Login already exist"]};
      creatingUser.message = 'Error creating user';
    }

    if(!creatingUser.errors){
      const newUser = new UserEntity();
      const hashPassword = await this.getPasswordHash(requestCreatingUserDto.password);
      await this.userRepository.save({...newUser, ...requestCreatingUserDto, password:hashPassword })
      const {password, ...userWithoutPassword} = await this.userRepository.findOne({ login: requestCreatingUserDto.login });
      creatingUser.user = userWithoutPassword;
    }
    return creatingUser 
  }

  async validateAuthorizationUser (requestAuthorizationUserDto: RequestAuthorizationUserDto): Promise<ResponseAuthorizationUserDto>{
    const autorizationUser = {
      errors: null,
      user: null,
      message:'User successfully authorization',
    }

    // Password validation

    if (!requestAuthorizationUserDto.password) {
      autorizationUser.errors = {...autorizationUser?.errors, passwordError: [...autorizationUser?.errors?.passwordError ?? [], "Password can't be empty"]};
      autorizationUser.message = 'Error authorization user';
    }

    // Login validation

    if (!requestAuthorizationUserDto.login) {
      autorizationUser.errors = {...autorizationUser?.errors, loginError: [...autorizationUser?.errors?.loginError ?? [], "Password can't be empty"]};
      autorizationUser.message = 'Error authorization user';
    }

    const userByLogin = await this.userRepository.findOne({ login: requestAuthorizationUserDto.login });
    const validPassword = await this.comparePasswordHashAndPlainTextPassword(requestAuthorizationUserDto?.password, userByLogin?.password);

    if (!(userByLogin && validPassword) ) {
      autorizationUser.errors = {...autorizationUser?.errors, loginError: [...autorizationUser?.errors?.loginError ?? [], "Login or password is wrong"]};
      autorizationUser.message = 'Error authorization user';
    }
    
    if(!autorizationUser.errors){
      const {password, ...userWithoutPassword} = userByLogin;
      autorizationUser.user = userWithoutPassword;
    }

    return autorizationUser
  }

  async validateUpdatingUser (requestUpdatingUserDto: RequestUpdatingUserDto): Promise<ResponseUpdatingUserDto>{
    const updatingUser = {
      errors: null,
      message:'User successfully updated',
    }

    // FirstName validation

    if (!requestUpdatingUserDto.firstName) {
      updatingUser.errors = {...updatingUser?.errors, firstName: [...updatingUser?.errors?.firstNameError ?? [], "FirstName can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestUpdatingUserDto.firstName)) {
      updatingUser.errors = {...updatingUser?.errors, firstName: [...updatingUser?.errors?.firstNameError ?? [], "Maximum firstName length must be 3-16 characters. Valid characters 'a-zA-ZА-Яа-я'"]};
      updatingUser.message = 'Error creating user';
    }

    // LastName validation

    if (!requestUpdatingUserDto.lastName) {
      updatingUser.errors = {...updatingUser?.errors, lastName: [...updatingUser?.errors?.lastNameError ?? [], "LastName can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^[a-zA-ZА-Яа-я]{3,16}$/.test(requestUpdatingUserDto.lastName)) {
      updatingUser.errors = {...updatingUser?.errors, lastName: [...updatingUser?.errors?.lastNameError ?? [], "Maximum lastName length must be 3-16 characters. Valid characters 'a-z 0-9 _ -'"]};
      updatingUser.message = 'Error creating user';
    }

    // Email validation

    if (!requestUpdatingUserDto.email) {
      updatingUser.errors = {...updatingUser?.errors, emailError: [...updatingUser?.errors?.emailError ?? [], "Email can't be empty"] };
      updatingUser.message = 'Error creating user';
    }

    if (!/^([a-z0-9_.-]+)@([a-z0-9_.-]+)\.([a-z.]{2,6})$/.test(requestUpdatingUserDto.email)) {
      updatingUser.errors = {...updatingUser?.errors, emailError: [...updatingUser?.errors?.emailError ?? [], "Maximum email length must be 2-6 characters and have got symbol '@'. Valid characters 'a-z 0-9 _ - .'"]};
      updatingUser.message = 'Error creating user';
    }

    return updatingUser
  }

  async getPasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  async comparePasswordHashAndPlainTextPassword(hash: string, password: string): Promise<boolean> {
    if(hash && password) {
      return await await bcrypt.compare(hash, password);
    }
  }












  async validateUserToken(login: string, password: string):Promise<boolean> {
    const user = await this.userRepository.findOne({ login });
    if (user === null) return false;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return false;
    
    return true;
  }







}