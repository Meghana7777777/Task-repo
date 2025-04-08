import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermsRepository } from './repo/role-perm.repo';
import { RolePermissionsController } from './role-permissions.controller';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermsAdapter } from './role-permissions-adapter';
import { RolePermissionEntity } from './entities/role-permissions.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [PermissionsModule, TypeOrmModule.forFeature([RolePermissionEntity])],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService, RolePermsAdapter, RolePermsRepository,ApplicationExceptionHandler]
})
export class RolePermissionsModule { }
