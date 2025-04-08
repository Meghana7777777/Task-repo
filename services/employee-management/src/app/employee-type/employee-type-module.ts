import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models'
import { EmployeeTypeService } from './employee-type-service';
import { EmployeeTypeRepository } from './dto/employee-type-repository';
import { EmployeeType } from './dto/employee-type-entity';
import { EmployeeTypeController } from './employee-type-controller';
@Module({
  imports:[TypeOrmModule.forFeature([EmployeeType])],
  controllers: [EmployeeTypeController],
  providers: [EmployeeTypeService,EmployeeTypeRepository, ApplicationExceptionHandler]
})
export class EmplolyeeTypeModule {}
