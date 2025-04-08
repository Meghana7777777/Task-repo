import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayrollTypesEntity } from "../entites/payroll-types.entity";


@Injectable()
export class PayrollTypesRepository extends Repository<PayrollTypesEntity> {

    constructor(@InjectRepository(PayrollTypesEntity) private payrollTypesRepository: Repository<PayrollTypesEntity>
    ) {
        super(payrollTypesRepository.target, payrollTypesRepository.manager, payrollTypesRepository.queryRunner);
    }

    async getAllPayrollTypesRepo(): Promise<any> {
        return await this.createQueryBuilder('payrollTypes')
            .select([
                'payrollTypes.id AS id',
                'payrollTypes.name AS name',
                'payrollTypes.description AS description',
                'payrollTypes.is_active AS isActive'
            ])
            .getRawMany();
    }

    async getActivePayrollTypesRepo(): Promise<any> {
        return await this.createQueryBuilder('dept')
            .select([
                'dept.id AS id',
                'dept.name AS name',
                'dept.description AS description',
            ])
            .where('dept.is_active = :isActive', { isActive: 1 })
            .orderBy('dept.name', 'ASC')
            .getRawMany();
    }
}