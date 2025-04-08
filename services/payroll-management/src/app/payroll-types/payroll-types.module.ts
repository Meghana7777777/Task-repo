import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollTypesEntity } from './entites/payroll-types.entity';
import { PayrollTypesController } from './payroll-types.controller';
import { PayrollTypesService } from './payroll-types.service';
import { PayrollTypesRepository } from './repositories/payroll-types.repository';
@Module({
  imports: [TypeOrmModule.forFeature([PayrollTypesEntity])],
  controllers: [PayrollTypesController],
  providers: [PayrollTypesRepository, PayrollTypesService, ApplicationExceptionHandler]
})
export class PayrollTypesModule { }
