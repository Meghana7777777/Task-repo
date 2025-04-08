import { EntityRepository, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ShiftChangeReqEntity } from "../entity/shift-change.entity";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import moment from "moment";
import { ConfigService } from "@nestjs/config";


export class ShiftChangeRepository extends Repository<ShiftChangeReqEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(ShiftChangeReqEntity) private shiftChangeRepo: Repository<ShiftChangeReqEntity>,
        private readonly configService: ConfigService

    ) {
        super(shiftChangeRepo.target, shiftChangeRepo.manager, shiftChangeRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getAllOpenShiftChangeRequest(): Promise<any> {
        const query = `SELECT sc.id ,sc.employee_id AS employeeId ,e.employee_code AS employeeCode ,e.first_name AS employeeName, sc.shift_code AS shiftCode,
                       sc.from_date AS fromDate ,sc.to_date AS toDate,sc.request_status AS requestStatus,
                       sc.reason,sc.from_shift AS fromShift,to_shift AS toShift FROM ${this.dbNames.lms}.shift_change_req sc
                       LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = sc.employee_id where sc.id>0`

        const result = await this.query(query);
        return result;
    }
    async approvedShiftOfEmp(date: any, employeeId: number): Promise<any> {
        console.log(date, '####', employeeId, '$$$')
        const query = `SELECT id,employee_id AS employeeId,shift_code AS shiftCode,from_date AS fromDate,
                       to_date AS toDate, from_shift AS fromShift,to_shift AS toShift,request_status AS requestStatus
                        FROM hrms_lms.shift_change_req 
                        WHERE request_status='APPROVED' 
                        AND '${date}' BETWEEN from_date AND to_date AND employee_id=${employeeId}`
        return await this.shiftChangeRepo.query(query)

    }

    async getShiftByEmpId({ empId }: { empId: any }): Promise<any> {
        const query = `SELECT 
                        e.id AS id,
                        CONCAT(e.first_name, ' ', e.last_name) AS fullName,
                        tc.shift_code AS shiftCode,
                        tc.shift AS shiftType
                    FROM 
                        ${this.dbNames.ems}.employee e
                    LEFT JOIN 
                        ${this.dbNames.lms}.team_calender tc ON tc.id = e.shift_group
                    WHERE 
                        e.id = ${empId}`;
        return await this.query(query);
    }
}