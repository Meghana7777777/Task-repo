import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ConfigService } from "@nestjs/config";
import { TourIntimationEntity } from "../entities/tour-intimation-entity";
import { Employee } from "../../../employee-onboarding/entities/employee-details.entity";
import { DepartmentsEntity } from "../../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../../designations/entites/designations.entity";
import { Branches } from "../../../branches/branches.entity";
import { TourDetailsEntity } from "../entities/tour-details-entity";
import { Division } from "../../../division/division.entity";

@Injectable()
export class TourIntimationRepository extends Repository<TourIntimationEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(TourIntimationEntity) private tourIntimationRepo: Repository<TourIntimationEntity>, private readonly configService: ConfigService
    ) {
        super(tourIntimationRepo.target, tourIntimationRepo.manager, tourIntimationRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async getTourIntimationDataRepo(req: any): Promise<any> {
        const queryBuilder = this.createQueryBuilder('t')
            .select([
                't.id AS id',
                't.permission AS permission', 
                't.permission_date AS permissionDate',
                't.advance_required AS advanceRequired',
                't.requested_amount AS requestedAmount',
                't.created_at AS appliedDate',
                't.employee_id AS employeeId',
                't.remarks AS remarks',
                't.tour_claim AS tourClaim',
                't.tour_type AS tourType',
                't.purpose_of_visit AS purposeOfVisit',
                'e.employee_code AS employeeCode',
                'e.first_name AS firstName',
                'd.name AS departmentName',
                'de.name AS designationName',
                'dv.division_name AS divisionName',
                'b.branch_name AS branchName',
                'd.hod AS hodName',
                'rm.first_name AS rmFirstName', 
                'rm.email_id AS rmEmail',
                `COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'fromDate', td.from_date,
                            'fromPlace', td.from_place,
                            'toDate', td.to_date,
                            'toPlace', td.to_place
                        )
                    ), JSON_ARRAY()
                ) AS employeeTourDetails`
            ])
            .leftJoin(Employee, 'e', 'e.id = t.employee_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(DepartmentsEntity, 'd', 'd.id = e.department_id')
            .leftJoin(DesignationsEntity, 'de', 'de.id = e.designation_id')        
            .leftJoin(Division, 'dv', 'dv.id = e.division_id')
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(TourDetailsEntity, 'td', 'td.tour_id = t.id')
            .groupBy('t.id')
            .addGroupBy('e.employee_code')
            .addGroupBy('e.first_name')
            .addGroupBy('d.name')
            .addGroupBy('de.name')
            .addGroupBy('dv.division_name')
            .addGroupBy('b.branch_name')
            .addGroupBy('d.hod')
            .addGroupBy('rm.first_name')
            .addGroupBy('rm.email_id');
    
        if (req.employeeId) {
            queryBuilder.andWhere('t.employee_id = :employeeId', { employeeId: req.employeeId });
        }
        if (req.id) {
            queryBuilder.andWhere('t.id = :id', { id: req.id });
        }
        if (req.branches && req.branches !== 'ALL') {
            queryBuilder.andWhere('b.id = :branchId', { branchId: req.branches });
        }
        if (req.divisionId) {
            queryBuilder.andWhere('dv.id = :divisionId', { divisionId: req.divisionId });
        }
        if (req.departmentId) {
            queryBuilder.andWhere('d.id = :departmentId', { departmentId: req.departmentId });
        }
        if (req.designationId) {
            queryBuilder.andWhere('de.id = :designationId', { designationId: req.designationId });
        }
    
        queryBuilder.orderBy('t.created_at', 'DESC'); 
    
        const data = await queryBuilder.getRawMany();
        return data;
    }
    


    async gettourEmployeeDataRepo(req: any): Promise<any> {
        try {
            let query = `SELECT e.id AS employeeId, e.employee_code AS employeeCode, e.first_name AS firstName, d.name AS departmentName, de.name AS designationName, 
            b.branch_name AS branchName, d.hod AS hodName, rm.first_name AS rmFirstName, rm.email_id AS rmEmail
            FROM employee e 
            LEFT JOIN employee rm ON rm.id = e.reporting_manager
            LEFT JOIN departments d ON d.id = e.department_id  
            LEFT JOIN designations de ON de.id = e.designation_id  
            LEFT JOIN branches b ON b.id = e.branch_id 
            WHERE e.id = ${req.employeeId} `
            return await this.tourIntimationRepo.query(query);
        } catch (err) {
            console.log(err);
        }
    }


}