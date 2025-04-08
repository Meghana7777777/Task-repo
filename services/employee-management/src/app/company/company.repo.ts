import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CompanyEntity } from "./company.entity";
import { Branches } from "../branches/branches.entity";


@Injectable()
export class CompanyRepository extends Repository<CompanyEntity> {

    constructor(@InjectRepository(CompanyEntity) private companyRepo: Repository<CompanyEntity>
    ) {
        super(companyRepo.target, companyRepo.manager, companyRepo.queryRunner);
    }

    async getCompanyRepo(): Promise<any> {
        return await this.createQueryBuilder('comp')
        .select([
            'comp.id as id',
            'comp.company_name as companyName',
            'comp.company_code as companyCode',
            'comp.is_active AS isActive',
            // 'comp.branch_id AS branchId',
            // 'b.branch_name AS branchName'
        ])           
        // .leftJoin(Branches, 'b', 'b.id = comp.branch_id')
        .getRawMany();
    }
}