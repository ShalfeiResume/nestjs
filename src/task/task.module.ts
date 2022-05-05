import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';
import { JwtStrategy } from '../strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), PassportModule],

  controllers: [TaskController],
  providers: [TaskService, JwtStrategy]
})
export class UserModule {}
  