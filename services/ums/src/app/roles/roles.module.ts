import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './entities/roles.entity';
import { RolesRepository } from './repositories/roles.repo';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesAdapter } from './adapters/roles.adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RolesAdapter,ApplicationExceptionHandler],
  exports: [RolesService]
})
export class RolesModule { }
