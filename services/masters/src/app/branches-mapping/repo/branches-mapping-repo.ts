import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BranchesMappingEntity } from "../entity/branches-mapping-entity";
import { Branches } from "services/employee-management/src/app/branches/branches.entity";
import { DepartmentsEntity } from "services/employee-management/src/app/departments/entites/departments-entity";
import { Division } from "services/employee-management/src/app/division/division.entity";
import { BranchesMappingSharedDto } from "@hrexpert/shared-models";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BranchesMappingRepo extends Repository<BranchesMappingEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(BranchesMappingEntity) private branchesMappingRepo: Repository<BranchesMappingEntity>,
        private readonly configService: ConfigService
    ) {
        super(branchesMappingRepo.target, branchesMappingRepo.manager, branchesMappingRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getBranchMapping(): Promise<any> {
        let query = `SELECT  bm.id AS id, b.branch_name AS branchName, d.name AS departmentName, di.division_name AS divisionName,
                    b.id AS branchId, d.id AS departmentId, di.id AS divisionId, bm.is_active AS isActive
                    FROM ${this.dbNames.masters}.branches_mapping bm
                    LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = bm.branch_id
                    LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = bm.department_id
                    LEFT JOIN ${this.dbNames.ems}.division di ON di.id = bm.division_id`
        return await this.branchesMappingRepo.query(query)
    }

    async getDivisionByBranchId(branchId: number): Promise<any> {
        const query = `
            SELECT  bm.id AS id, b.id AS branchId, b.branch_name AS branchName, di.id AS divisionId, di.division_name AS divisionName
            FROM ${this.dbNames.masters}.branches_mapping bm
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = bm.branch_id
            LEFT JOIN ${this.dbNames.ems}.division di ON di.id = bm.division_id
            WHERE bm.is_active = :isActive
              AND bm.division_id IS NOT NULL
              ${branchId ? 'AND bm.branch_id = :branchId' : ''}
            GROUP BY bm.division_id
            ORDER BY di.division_name
        `;
    
        const params: any = {
            isActive: true,
        };
    
        if (branchId) {
            params.branchId = branchId;
        }
    
        return await this.branchesMappingRepo.query(query, params);
    }

    async getDepartmentByBranchId(branchId: number): Promise<any> {
        const query = `
            SELECT bm.id AS id, b.id AS branchId, b.branch_name AS branchName, d.id AS departmentId, d.name AS deptName
            FROM  ${this.dbNames.masters}.branches_mapping bm
            LEFT JOIN  ${this.dbNames.ems}.branches b ON b.id = bm.branch_id
            LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = bm.department_id
            WHERE  bm.is_active = true AND bm.department_id IS NOT NULL ${branchId ? `AND bm.branch_id = ${branchId}` : ''}
            GROUP BY bm.department_id
            ORDER BY d.name`
        return await this.branchesMappingRepo.query(query);
    }
}