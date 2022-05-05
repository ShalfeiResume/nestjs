import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AuthenticationStrategy } from '../strategy/authentication.stategy';
import { RegistartionStrategy } from '../strategy/registaration.stategy';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule,
  JwtModule.register({
    secret: 'Salt',
    signOptions: {
      expiresIn: '365d',
    },
  })
],

  controllers: [UserController],
  providers: [UserService, AuthenticationStrategy, RegistartionStrategy, JwtStrategy]
})
export class UserModule {}
  