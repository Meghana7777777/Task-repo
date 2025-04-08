import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DepartmentsEntity } from "../entites/departments-entity";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";



@Injectable()
export class DepartmentsRepository extends Repository<DepartmentsEntity> {

    constructor(@InjectRepository(DepartmentsEntity) private departmentRepo: Repository<DepartmentsEntity>
    ) {
        super(departmentRepo.target, departmentRepo.manager, departmentRepo.queryRunner);
    }


    async getAllDepartments(): Promise<any> {
        return await this.createQueryBuilder('dept')
            .select([
                'dept.id AS id',
                'dept.name AS name',
                'dept.code AS code',
                'dept.hod AS hodId',
                'e.first_name AS hod',
                'dept.is_active AS isActive'
            ]) 
            .leftJoin(Employee, 'e', 'e.id = dept.hod')
           
            // .where('dept.is_active = :isActive', { isActive: 1 })
            .getRawMany();
    }

    async getActiveDepartments(): Promise<any> {
        return await this.createQueryBuilder('dept')
            .select([
                'dept.id AS deptId',
                'dept.name AS deptName',
                'dept.company_code AS companyCode',
                'dept.unit_code AS unitCode'
            ])
            .where('dept.is_active = :isActive', { isActive: 1 })
            .orderBy('dept.name', 'ASC')
            .getRawMany();
    }
}