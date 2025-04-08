import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { lateMinutesRecordsEntity } from "../entity/late-minutes-moment-records-entity";



@Injectable()
export class LateMinMomentRecordsRepository extends Repository<lateMinutesRecordsEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(lateMinutesRecordsEntity) private lateMinRecMomentRepo: Repository<lateMinutesRecordsEntity>,
        private readonly configService: ConfigService
    ) {
        super(lateMinRecMomentRepo.target, lateMinRecMomentRepo.manager, lateMinRecMomentRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    // async getLateMinMomentRecordsRepo(req: any): Promise<any> {
    //     console.log(req,"rururu")
    //     const queryBuilder = this.createQueryBuilder('latemin')
    //         .select([
    //             'latemin.id AS id',
    //             'latemin.employee_code AS employeeCode',
    //             `CONCAT(emp.first_name, ' ', emp.last_name) AS fullName`,
    //             // 'latemin.branch_id AS branchId',
    //             // 'b.branch_name AS branchName',
    //         ])
    //         // .leftJoin(Branches, 'b', 'b.id = la.branch_id')
    //         .leftJoin(Employee, 'emp', 'emp.employee_code = latemin.employee_code')
    //         .where('1=1')
    //     if (req?.employeeId) {
    //         queryBuilder.where('latemin.employee_code = :employeeId', { employeeId: req.employeeId });
    //     }
    //     const data = await queryBuilder.getRawMany();
    //     return data;
    // }
    async getLateMinMomentRecordsRepo(req: any): Promise<any[]> {
        let query = `SELECT 
                        latemin.id AS lateMinId,
                        latemin.employee_code AS empCode,
                        latemin.date AS date,
                        latemin.swipe_in_time AS swipeInTime,
                        latemin.swipe_out_time AS swipeOutTime,
                        latemin.swipes_enum AS swipesEnum,
                        latemin.actual_late_min AS actualLateMin,
                        latemin.final_late_min AS finalLateMin,
                        latemin.status AS status,
                        latemin.created_at AS createdAt,
                        latemin.remarks AS remarks,
                        e.branch_id AS branchId,
                        br.branch_name AS branchName,
                        att.attn_status AS attnStatus,
                        CONCAT(e.first_name, ' ', e.last_name) AS fullName
                    FROM ${this.dbNames.lms}.late_minutes_records latemin
                    LEFT JOIN ${this.dbNames.ems}.employee e ON latemin.employee_code = e.employee_code
                    LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id 
                    LEFT JOIN ${this.dbNames.lms}.attendance att ON att.date = latemin.date AND latemin.employee_code = att.emp_code
                    WHERE 1=1`;

        if (req?.status) {
            query += ` AND latemin.status = '${req.status}'`;
        }

        if (req?.branchId) {
            query += ` AND e.branch_id = ${req.branchId}`;
        }
        if (req?.employeeCode) {
            query += ` AND latemin.employee_code = ${req.employeeCode}`;
        }
        if (req.month) {
            query += ` AND latemin.date LIKE '%${req.month}%'`;
        }
        return await this.lateMinRecMomentRepo.query(query);
    }


}