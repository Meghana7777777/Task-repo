import { Module } from '@nestjs/common';
import { PermsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from './entities/permissions.entity';
import { PermsController } from './permissions.controller';
import { PermsRepository } from './repo/perm.repo';
import { PermissionAdapter } from './repo/permissions.adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionsEntity])],
  controllers: [PermsController],
  providers: [PermsService, PermsRepository, PermissionAdapter,ApplicationExceptionHandler],
  exports: [PermsService]
})
export class PermissionsModule { }
