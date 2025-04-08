import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { DepartmentsEntity } from './entites/departments-entity';
import { DepartmentsRepository } from './repositories/departments-repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartmentsEntity
    ])
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository, ApplicationExceptionHandler]
})
export class DepartmentsModule { }
