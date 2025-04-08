import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Division } from "../division.entity";
@Injectable()
export class DivisionRepository extends Repository<Division> {

    constructor(@InjectRepository(Division) private divisionRepo: Repository<Division>
    ) {
        super(divisionRepo.target, divisionRepo.manager, divisionRepo.queryRunner);
    }

    async getAllActiveDivisions(): Promise<any> {
        return await this.createQueryBuilder('div')
            .select([
                'div.id AS divisionId',
                'div.division_name AS divisionName',
                'div.company_code AS companyCode',
                'div.unit_code AS unitCode'
            ])
            .where('div.is_active = :isActive', { isActive: 1 })
            .orderBy('div.division_name', 'ASC')
            .getRawMany();
    }


}