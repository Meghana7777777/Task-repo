import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { PayrollChecklist } from "./payroll-checklist.entity";

@Injectable()
export class PayrollChecklistRepository extends Repository<PayrollChecklist> {
    private readonly dbNames: any
    constructor(@InjectRepository(PayrollChecklist) private payrollChecklistRepository: Repository<PayrollChecklist>,
        private readonly configService: ConfigService
    ) {
        super(payrollChecklistRepository.target, payrollChecklistRepository.manager, payrollChecklistRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames')
    }
}