import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { TypesOfLeavesController } from './types-of-leave.controller';
import { TypesOfLeaves } from './types-of-leave.entity';
import { TypesOfLeavesService } from './types-of-leave.service';
import { TypesOfLeavesRepository } from './repo/types-of-leave.repo';
@Module({
  imports:[TypeOrmModule.forFeature([TypesOfLeaves])],
  controllers: [TypesOfLeavesController],
  providers: [TypesOfLeavesService,TypesOfLeavesRepository, ApplicationExceptionHandler],
  exports:[TypesOfLeavesRepository]
})
export class TypesOfLeavesModule {}
