import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmpNonRecTermsEntity } from "../entites/emp-non-rec-terms.entity";
import { EmployeeNonRecurringComponentsRepository } from "./emp-non-rec-components.repo";
import { EmpNonRecComponentsEntity } from "../entites/emp-non-rec-components.entity";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";


@Injectable()
export class EmployeeNonRecurringTermsRepository extends Repository<EmpNonRecTermsEntity> {

    constructor(@InjectRepository(EmpNonRecTermsEntity) private employeeNonRecurringTermsRepository: Repository<EmpNonRecTermsEntity>
    ) {
        super(employeeNonRecurringTermsRepository.target, employeeNonRecurringTermsRepository.manager, employeeNonRecurringTermsRepository.queryRunner);
    }

    async getAllTermsRecords(yearMonth: any, empId: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('enrt')
            .select([
                'enrt.id AS id',
                'enrt.pay_month AS payMonth',
                'enrt.term_amount AS termAmount',
                'pc.component_name AS componentName'
            ])
            .leftJoin(EmpNonRecComponentsEntity, 'enrc', 'enrc.id = enrt.non_recurring_id')
            .leftJoin(PayrollComponentsEntity, 'pc', 'pc.id = enrc.component_id')
            .where('enrt.pay_month = :yearMonth', { yearMonth: Number(yearMonth) })
            .andWhere('enrt.employee_id = :empId', { empId: empId })
            .andWhere('enrt.is_active = 1');

        return queryBuilder.getRawMany();
    }
}