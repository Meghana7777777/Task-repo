import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollEmployeesEntity } from "../entites/payroll-employees.entity";


@Injectable()
export class PayrollEmployeesRepository extends Repository<PayrollEmployeesEntity> {

    constructor(@InjectRepository(PayrollEmployeesEntity) private payrollEmployeesRepository: Repository<PayrollEmployeesEntity>
    ) {
        super(payrollEmployeesRepository.target, payrollEmployeesRepository.manager, payrollEmployeesRepository.queryRunner);
    }
}