import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeLogsEntity } from "../entities/employee-logs.entity";
import { ConfigService } from "@nestjs/config";
import { DashboardReq, EmpDataReq } from "@hrexpert/shared-models";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";
import { Branches } from "../../branches/branches.entity";
import { DepartmentsEntity } from "../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../designations/entites/designations.entity";
import { Division } from "../../division/division.entity";
import { EmployeeType } from "../../employee-type/dto/employee-type-entity";

@Injectable()
export class EmployeeLogsRepository extends Repository<EmployeeLogsEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(EmployeeLogsEntity) private employeeLogsRepo: Repository<EmployeeLogsEntity>, private readonly configService: ConfigService
    ) {
        super(employeeLogsRepo.target, employeeLogsRepo.manager, employeeLogsRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

//     async getAllEmployeeLogs(req?:EmpDataReq): Promise<any> {
//         const queryBuilder = this.createQueryBuilder('el')
//         .select([
//             'el.employee_id AS employeeId',
//             'el.role AS role',
//             'el.action_type AS actionType',
//             'el.previous_values AS previousValues',
//             'el.updated_values AS updatedValues',
//             'el.remarks AS remarks',
//             'el.created_at AS createdAt',
//             'el.updated_user AS updatedUser',
//             'e.employee_code AS employeeCode',
//              "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
//              'e.department_id AS departmentId',
//                 'e.designation_id AS designationId',
//                 'e.branch_id AS branchId',
//                 'e.division_id AS division',
//                 'b.branch_name AS branchName',
//                 'dep.name AS departmentName',
//                 'des.name AS designationName',
//                 'divi.division_name AS divisionName'
//         ])
//         .leftJoin(Employee, 'e', 'e.id = el.employee_id')
//         .leftJoin(Branches, 'b', 'b.id = e.branch_id')
//         .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
//         .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
//         .leftJoin(Division, 'divi', 'divi.id = e.division_id')
//         //.orderBy( 'el.created_at  DESC')
      
        
// if (req.employeeId) {
//             queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
//         }

//         if (req.departmentId) {
//             queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
//         }

//         if (req.designationId) {
//             queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
//         }

//         if (req.divisionId) {
//             queryBuilder.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId });
//         }

//         if (req.branchId) {
//             queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
//         }


//     const result = await queryBuilder.getRawMany();
//     return result}

    async getAllEmployeeLogs(req?:EmpDataReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('el')
        .select([
            'el.employee_id AS employeeId',
            'el.role AS role',
            'el.action_type AS actionType',
            
            'el.remarks AS remarks',
            'el.created_at AS createdAt',
            'el.updated_user AS updatedUser',
            'e.employee_code AS employeeCode',
             "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
             'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
        ])
        .leftJoin(Employee, 'e', 'e.id = el.employee_id')
        .leftJoin(Branches, 'b', 'b.id = e.branch_id')
        .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
        .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
        .leftJoin(Division, 'divi', 'divi.id = e.division_id')
        .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
        .groupBy('el.employee_id')
        //.orderBy( 'el.created_at  DESC')
      
        
if (req.employeeId) {
            queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
        }

        if (req.departmentId) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }

        if (req.designationId) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
        }

        if (req.divisionId) {
            queryBuilder.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId });
        }

        if (req.branchId) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }


    const result = await queryBuilder.getRawMany();
    return result}
            
    async getAllEmployeeChildLogs(req?:EmpDataReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('el')
        .select([
            'el.employee_id AS employeeId',
            'el.previous_values AS previousValues',
            'el.updated_values AS updatedValues',
            'el.remarks AS remarks',
            'el.created_at AS createdAt',
            
        ])
        .leftJoin(Employee, 'e', 'e.id = el.employee_id')
        .where('el.employee_id = :employeeId', { employeeId: req.employeeId })
        const result = await queryBuilder.getRawMany();
    return result}
            
}