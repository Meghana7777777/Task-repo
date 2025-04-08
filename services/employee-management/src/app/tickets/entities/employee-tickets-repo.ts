import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { EmployeeTicketsEntity } from "./employee-tickets-entity";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";
import { DepartmentsEntity } from "../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../designations/entites/designations.entity";
import { Branches } from "../../branches/branches.entity";
import { TourDetailsEntity } from "../../employee-forms/tour-intimation/entities/tour-details-entity";

@Injectable()
export class EmployeeTicketsRepository extends Repository<EmployeeTicketsEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(EmployeeTicketsEntity) private employeeTicketsRepo: Repository<EmployeeTicketsEntity>, private readonly configService: ConfigService
    ) {
        super(employeeTicketsRepo.target, employeeTicketsRepo.manager, employeeTicketsRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


      async getAllTickets(req?: any): Promise<any> {
            const queryBuilder = this.createQueryBuilder('t')
                .select([
                    't.id AS id',
                    't.category AS category',
                    't.subject AS subject',
                    't.issue AS issue',
                    't.reply as reply',
                    't.status as status',
                    't.created_at AS raisedDate',
                    't.updated_at AS closedDate',
                    'e.employee_code AS employeeCode',
                    'e.first_name AS firstName',
                    'd.name AS departmentName',
                    'de.name AS designationName',
                    'b.branch_name AS branchName',
                ])
                .leftJoin(Employee, 'e', 'e.id = t.employee_id')
                .leftJoin(DepartmentsEntity, 'd', 'd.id = e.department_id')
                .leftJoin(DesignationsEntity, 'de', 'de.id = e.designation_id')
                .leftJoin(Branches, 'b', 'b.id = e.branch_id')
    
            if (req.employeeId) {
                queryBuilder.andWhere('t.employee_id = :employeeId', { employeeId: req?.employeeId });
            }
            const data = await queryBuilder.getRawMany();
            return data
        }


}