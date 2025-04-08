import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollChecklist } from './payroll-checklist.entity';
import { PayrollChecklistService } from './payroll-checklist.service';
import { PayrollChecklistController } from './payroll-checklist.controller';
import { PayrollChecklistRepository } from './payroll-checklist.repo';

@Module({
    imports: [TypeOrmModule.forFeature([PayrollChecklist])],
    providers: [PayrollChecklistService, PayrollChecklistRepository],
    controllers: [PayrollChecklistController],
})
export class PayrollChecklistModule { }
