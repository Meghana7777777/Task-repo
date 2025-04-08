import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Branches } from "../branches.entity";
import { CompanyEntity } from "../../company/company.entity";



@Injectable()
export class BranchesRepository extends Repository<Branches> {

    constructor(@InjectRepository(Branches) private branchesRepo: Repository<Branches>
    ) {
        super(branchesRepo.target, branchesRepo.manager, branchesRepo.queryRunner);
    }

    async getAllBranches(): Promise<any> {
        return await this.createQueryBuilder('br')
            .select([
                'br.id AS id',
                'br.branch_name AS branchName',
                'br.branch_code AS branchCode',
                'br.address AS address',
                'br.state AS state',
                'br.is_active AS isActive',
                'br.pt_applicable AS ptApplicable',
                'com.company_name AS companyName',
                'com.id AS companyId',
                'br.is_employee AS isEmployee',
                'br.is_worker AS isWorker',
                'br.unit_name AS unitName',
            ])
            .leftJoin(CompanyEntity, 'com', 'com.id = br.company_name')
            .getRawMany();
    }
}