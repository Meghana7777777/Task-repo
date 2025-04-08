import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { PayrollComponentsSharedService, WhatsUpService } from '@hrexpert/shared-services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollComponentsEntity } from '../payroll-components/entites/payroll-components.entity';
import { PayrollComponentsRepository } from '../payroll-components/repositories/payroll-components.repository';
import { PayrollProcessedLogEntity } from './entites/payroll-processed-log.entity';
import { PayrollProcessedLogController } from './payroll-processed-log.controller';
import { PayrollProcessedLogRepository } from './payroll-processed-log.repository';
import { PayrollProcessedLogService } from './payroll-processed-log.service';
@Module({
  imports: [TypeOrmModule.forFeature([PayrollProcessedLogEntity, PayrollComponentsEntity])],
  controllers: [PayrollProcessedLogController],
  providers: [PayrollProcessedLogRepository, PayrollProcessedLogService, ApplicationExceptionHandler, PayrollComponentsRepository, WhatsUpService, PayrollComponentsSharedService],
  exports: [PayrollProcessedLogRepository]
})
export class PayrollProcessedLogModule { }
