import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollEmployeeComponentAmountsEntity } from "../entites/payroll-emp-comp-amt.entity";


@Injectable()
export class PayrollEmployeeComponentAmountsRepository extends Repository<PayrollEmployeeComponentAmountsEntity> {

    constructor(@InjectRepository(PayrollEmployeeComponentAmountsEntity) private payrollEmployeeComponentAmountsRepository: Repository<PayrollEmployeeComponentAmountsEntity>
    ) {
        super(payrollEmployeeComponentAmountsRepository.target, payrollEmployeeComponentAmountsRepository.manager, payrollEmployeeComponentAmountsRepository.queryRunner);
    }

}