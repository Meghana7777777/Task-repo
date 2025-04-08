import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollCodeBranchMappingEntity } from "../entities/code-branch-emptype-mapping.entity";

@Injectable()
export class PayrollCodeBranchMappingReposirtory extends Repository<PayrollCodeBranchMappingEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(PayrollCodeBranchMappingEntity) private payrollCodeBranchMappingRepo: Repository<PayrollCodeBranchMappingEntity>,
        private readonly configService: ConfigService
    ) {
        super(payrollCodeBranchMappingRepo.target, payrollCodeBranchMappingRepo.manager, payrollCodeBranchMappingRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async jjjjjjjjjjjRepo(): Promise<any> {
        let query = `SELECT  
        pcbmr.id AS id,
                pcbmr.payroll_code AS payrollCode,
                pcbmr.branch_id AS branchId,
                pcbmr.employee_type_Id AS employeeTypeId,
                b.branch_name AS branchName,
                empType.name AS employeeTypeName,
                pcbmr.is_active AS isActive
                  FROM ${this.dbNames.pms}.payroll_code_branch_mapping pcbmr
                  LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = pcbmr.branch_id
                  LEFT JOIN ${this.dbNames.ems}.employee_type empType ON empType.id = pcbmr.employee_type_id`
        return await this.payrollCodeBranchMappingRepo.query(query)
    }



}