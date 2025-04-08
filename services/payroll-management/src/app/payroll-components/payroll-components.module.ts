import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { EmployeeTypeService } from '@hrexpert/shared-services';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollRecordsModule } from '../payroll-records/payroll-records.module';
import { PayrollCodeEntity } from './entites/payroll-code.entity';
import { PayrollComponentsEntity } from './entites/payroll-components.entity';
import { PayrollTypesComponentsEntity } from './entites/payroll-types-components.entity';
import { PayrollComponentsController } from './payroll-components.controller';
import { PayrollComponentsService } from './payroll-components.service';
import { PayrollCodeRepository } from './repositories/payroll-code.repository';
import { PayrollComponentsRepository } from './repositories/payroll-components.repository';
import { PayrollTypeComponentsRepository } from './repositories/payroll-types-components.repository';
import { PayrollCodeBranchMappingReposirtory } from '../code-branch-emptype-mapping/repo/code-branch-emptype-mapping-repo';
import { PayrollCodeBranchMappingEntity } from '../code-branch-emptype-mapping/entities/code-branch-emptype-mapping.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([PayrollComponentsEntity, PayrollTypesComponentsEntity, PayrollCodeEntity, PayrollCodeBranchMappingEntity]), forwardRef(() => PayrollRecordsModule)
  ],
  controllers: [PayrollComponentsController],
  providers: [PayrollComponentsRepository, PayrollComponentsService, ApplicationExceptionHandler, PayrollTypeComponentsRepository, EmployeeTypeService, PayrollCodeRepository, PayrollCodeBranchMappingReposirtory],
  exports: [PayrollComponentsRepository, PayrollCodeRepository]
})
export class PayrollComponentsModule { }
