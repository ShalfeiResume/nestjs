import { Body, Controller, Get, Post, Put, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { RequestCreatingUserDto, ResponseCreatingUserDto } from "./dto/creatingUser.dto";
import { RequestAuthorizationUserDto, ResponseAuthorizationUserDto } from "./dto/authorizationUser.dto";
import { RequestUpdatingUserDto, ResponseUpdatingUserDto } from './dto/updatingUser.dto';
import { UserService } from "./user.service";
import { ResponseGetingUserDto } from "./dto/getingUser.dto";


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req): Promise<ResponseGetingUserDto> {
    return this.userService.getUser({login: req?.user?.login});
  }

  @Post('create')
  @UseGuards(AuthGuard('create'))
  async createUser(@Req() req, @Res({ passthrough: true }) res: Response, @Body()requestCreatingUserDto: RequestCreatingUserDto): Promise<ResponseCreatingUserDto> {
    const token = await this.userService.getJwtToken({login: req?.user?.login,  });
    res.cookie('auth-cookie', { token }, { httpOnly:true, sameSite: 'none', secure: true });
    return this.userService.createUser({
      login: req?.query?.login,
      password: req?.query?.password,
      confirmPassword: req?.query?.confirmPassword,
      email: req?.query?.email,
    });
  }

  @Post('auth')
  @UseGuards(AuthGuard('auth'))
  async authUser(@Req() req, @Res({ passthrough: true }) res: Response, @Body()requestAuthorizationgUserDto: RequestAuthorizationUserDto): Promise<ResponseAuthorizationUserDto> {
    const token = await this.userService.getJwtToken(req.user as RequestAuthorizationUserDto);
    res.cookie('auth-cookie', { token }, {httpOnly:true, sameSite: 'none', secure: true });
    return this.userService.authUser({login: req?.query?.login, password: req?.query?.password});
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Req() req, @Body()requestUpdatingUserDto: RequestUpdatingUserDto): Promise<ResponseUpdatingUserDto> {
    return this.userService.updateUser({...requestUpdatingUserDto, login: req?.user?.login});
  }
}
