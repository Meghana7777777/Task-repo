import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsController } from './user-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermsRepository } from './repo/user-perm.repo';
import { UserPermsAdapter } from './user-permisons-adapter';
import { UserPermissionEntity } from './entities/user-permissions.entity';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';


@Module({
  imports: [TypeOrmModule.forFeature([UserPermissionEntity])],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService, UserPermsRepository,UserPermsAdapter,ApplicationExceptionHandler]
})
export class UserPermissionsModule { }
