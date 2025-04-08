import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { DivisionController } from './division.controller';
import { Division } from './division.entity';
import { DivisionService } from './division.service';
import { DivisionRepository } from './repositories/divison.repo';



@Module({
  imports:[TypeOrmModule.forFeature([Division])],
  controllers: [DivisionController],
  providers: [DivisionService,DivisionRepository, ApplicationExceptionHandler]
})
export class DivisionModule {}
