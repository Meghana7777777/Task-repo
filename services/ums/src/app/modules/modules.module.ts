import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModulesEntity } from './entities/modules.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesRepository } from './repositorys/module.repo';
import { ModulesAdapter } from './modules-adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesEntity])],
  controllers: [ModulesController],
  providers: [ModulesService,ModulesAdapter,ModulesRepository,ApplicationExceptionHandler]
})
export class ModulesModule { }
