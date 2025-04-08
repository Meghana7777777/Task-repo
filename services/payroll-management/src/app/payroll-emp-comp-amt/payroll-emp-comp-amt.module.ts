import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollEmployeeComponentAmountsEntity } from './entites/payroll-emp-comp-amt.entity';
import { PayrollEmployeeComponentAmountsController } from './payroll-emp-comp-amt.controller';
import { PayrollEmployeeComponentAmountsService } from './payroll-emp-comp-amt.service';
import { PayrollEmployeeComponentAmountsRepository } from './repositories/payroll-emp-comp-amt.repository';
@Module({
  imports: [TypeOrmModule.forFeature([PayrollEmployeeComponentAmountsEntity])],
  controllers: [PayrollEmployeeComponentAmountsController],
  providers: [PayrollEmployeeComponentAmountsRepository, PayrollEmployeeComponentAmountsService, ApplicationExceptionHandler]
})
export class PayrollEmployeeComponentAmountsModule { }
