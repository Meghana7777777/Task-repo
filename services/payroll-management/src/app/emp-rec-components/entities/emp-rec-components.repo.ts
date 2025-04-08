import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmpRecComponentsEntity } from "./emp-ec-components-entities";
import { PayrollEmployeesEntity } from "../../payroll-employees/entites/payroll-employees.entity";
import { PayrollComponentsEntity } from "../../payroll-components/entites/payroll-components.entity";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class EmpRecComRepository extends Repository<EmpRecComponentsEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(EmpRecComponentsEntity) 
    private empRecComRepository: Repository<EmpRecComponentsEntity>,
    private readonly configService: ConfigService
    ) {
        super(empRecComRepository.target, empRecComRepository.manager, empRecComRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getEmpRecComponent(): Promise<any> {
        try {
            let query = `SELECT 
                    erc.id,
                    erc.amount,
                    e.id AS employeeId,
                    e.employee_code AS empCode,
                    e.first_name AS employeeName,
                    e.department_id departmentId,
                    e.division_id divisionId,  
                    e.branch_id branchId,
                    pc.id AS componentId,
                    pc.component_name AS componentName,
                    d.name AS departmentName,
                    di.division_name AS divisionName,
                    b.branch_name AS branchName,
                    erc.emi_count AS emiCount,
                    erc.emi_amount AS emiAmount,
                    erc.start_date AS startDate,
                    erc.end_date AS endDate
                        FROM ${this.dbNames.pms}.emp_rec_components erc 
                        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = erc.employee_id
                        LEFT JOIN ${this.dbNames.pms}.payroll_components pc ON pc.id = erc.component_id 
                        LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id 
                        LEFT JOIN ${this.dbNames.ems}.division di ON di.id = e.division_id
                        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
                        WHERE pc.type = 'RECURRING';`
                        return await this.empRecComRepository.query(query)
        } catch (err) {
            console.log(err);
        }
    }
}
