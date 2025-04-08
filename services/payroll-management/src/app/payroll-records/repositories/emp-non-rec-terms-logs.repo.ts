import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NonRecTermsLogsEntity } from "../entites/emp-non-rec-terms-logs.entity";


@Injectable()
export class EmployeeNonRecurringLogsRepository extends Repository<NonRecTermsLogsEntity> {
    private readonly dbNames: any

    constructor(
        @InjectRepository(NonRecTermsLogsEntity)
        private employeeNonRecurringLogsRepository: Repository<NonRecTermsLogsEntity>,
        private readonly configService: ConfigService,
    ) {
        super(employeeNonRecurringLogsRepository.target, employeeNonRecurringLogsRepository.manager, employeeNonRecurringLogsRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }


    async getTermLogs(req: any): Promise<any> {
        let query = `
                    SELECT
                    tl.id,
                    CONCAT(ee.first_name," ",ee.last_name) AS employee,
                    tl.employee_id AS employeeId,
                    pc.component_name AS component,
                    tl.component_id AS componentId, 
                   tl.action_type AS actionType,
                   tl.role AS role,
                    tl.previous_values AS previousValues,
                     tl.updated_values AS updatedValues,
                      tl.created_at AS createdAt,
                 CONCAT(e.first_name," ",e.last_name) AS updatedUser,
                    tl.updated_user AS updatedUserId,
                  tl.remarks AS remarks   
                   FROM ${this.dbNames.pms}.non_rec_terms_logs tl 
                   LEFT JOIN ${this.dbNames.ems}.employee e ON e.id= tl.updated_user
                   LEFT JOIN ${this.dbNames.ems}.employee ee ON ee.id= tl.employee_id
                  LEFT JOIN ${this.dbNames.pms}.payroll_components pc ON pc.id= tl.component_id
                   LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= ee.branch_id
                    LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= ee.department_id
                   LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= ee.division_id
                   LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= ee.designation_id
                   WHERE 1=1 
                   `
        if (req.payRollEmployee) {
            query += ` AND (tl.employee_id) = ${req.payRollEmployee}`
        }
        if (req.payRollComponent) {
            query += ` AND (tl.component_id) = ${req.payRollComponent}`
        }
        if (req.branches) {
            query += ` AND (br.id) = ${req.branches}`
        }
        if (req.divisionId) {
            query += ` AND (dv.id) = ${req.divisionId}`
        }
        if (req.departmentId) {
            query += ` AND (dp.id) = ${req.departmentId}`
        }
        if (req.designationId) {
            query += ` AND (dg.id) = ${req.designationId}`
        }
        return await this.query(query);
    }



}


