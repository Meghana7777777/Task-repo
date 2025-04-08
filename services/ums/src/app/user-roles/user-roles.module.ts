import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesEntity } from './entitys/user-roles.entity';
import { UserRolesRepository } from './repositories/user-roles.repo';
import { UserRolesAdapter } from './adapters/userroles.adapter';
import { SubMenuRepository } from '../sub-menus/repo/sub-menu-repo';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { UsersService } from '@hrexpert/shared-services';

@Module({
  imports: [TypeOrmModule.forFeature([UserRolesEntity])],
  controllers: [UserRolesController],
  providers: [UserRolesService, UserRolesRepository,SubMenuRepository, UserRolesAdapter,ApplicationExceptionHandler,UsersService],
  exports: [UserRolesService]
})
export class UserRolesModule { }
