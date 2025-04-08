import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollTypesComponentsEntity } from "../entites/payroll-types-components.entity";


@Injectable()
export class PayrollTypeComponentsRepository extends Repository<PayrollTypesComponentsEntity> {

    constructor(@InjectRepository(PayrollTypesComponentsEntity) private payrollTypeComponentsRepository: Repository<PayrollTypesComponentsEntity>
    ) {
        super(payrollTypeComponentsRepository.target, payrollTypeComponentsRepository.manager, payrollTypeComponentsRepository.queryRunner);
    }

}