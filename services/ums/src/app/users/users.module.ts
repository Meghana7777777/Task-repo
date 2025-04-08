import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthenticationsModule } from '../authentications/authentications.module';
import { UserRolesRepository } from '../user-roles/repositories/user-roles.repo';
import { UserEntity } from './entities/users.entity';
import { UsersAdapter } from './user-repo/adapter';
import { UserRepo } from './user-repo/user-repo';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { UserChildRepo } from './user-repo/user-child.repo';
import { UserChildEntity } from './entities/user-child.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DataSource,UserChildEntity]),
    AuthenticationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepo, UserRolesRepository, UsersAdapter,ApplicationExceptionHandler,UserChildRepo],
  exports: [TypeOrmModule],
})
export class UsersModule {}
