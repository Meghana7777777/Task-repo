import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeekOffLeaves } from "../week-of-leaves.entity";
import { DashboardReq, UnitIdReq } from "@hrexpert/shared-models";
import { Employee } from "services/employee-management/src/app/employee-onboarding/entities/employee-details.entity";
import { ConfigService } from "@nestjs/config";




@Injectable()
export class WeekOffLeavesRepository extends Repository<WeekOffLeaves> {
private readonly dbNames:any
    constructor(@InjectRepository(WeekOffLeaves) private weekOffLeavesRepo: Repository<WeekOffLeaves>,
    private readonly configService: ConfigService

   
    ) {
        super(weekOffLeavesRepo.target, weekOffLeavesRepo.manager, weekOffLeavesRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }
    // async getAllWeekOffLeaves(req: DashboardReq): Promise<any> {
    //     const query = this.createQueryBuilder('wol')
    //         .select(`
    //             wol.id AS id,
    //             wol.week_name AS weekName,
    //             wol.is_active AS isActive,
    //             wol.employee_id AS employeeId,
    //             e.id AS employeeId,
    //             e.employee_code AS employeeCode,
    //             e.first_name AS employeeName,
    //             e.last_name AS lastName
    //         `)
    //         .leftJoin(Employee, 'e', 'e.id = wol.employee_id');
        
    //     if (req?.branchId) {
    //         query.where('e.branchId = :branchId', { branchId: req.branchId });
    //     }
    
    //     return await query.getRawMany();
   
    
    // async getAllWeekOffLeaves(req:DashboardReq): Promise<any> {
    //     return await this.createQueryBuilder('wol')
    //         .select(`
    //             wol.id AS id,
    //             wol.week_name AS weekName,
    //             wol.is_active AS isActive,
    //             wol.employee_id AS employeeId
    //             e.id AS employeeId,
    //             e.employee_code AS employeeCode,
    //             e.first_name AS employeeName,
    //             e.last_name AS lastName`
    //         )
            
    //         // .leftJoin(Employee, 'e', 'e.id = wol.employee_id')
    //         .getRawMany();
    //     }


    async getAllWeekOffLeaves(req: DashboardReq): Promise<any> {
        let query = `Select 
                wol.id AS id,
                wol.week_name AS weekName,
                wol.is_active AS isActive,
                wol.employee_id AS employeeId,
                e.id AS employeeId,
                e.employee_code AS employeeCode,
                e.first_name AS employeeName,
                e.last_name AS lastName,
                e.branch_id AS branchId,
                b.branch_name AS branchName
                FROM ${this.dbNames.masters}.week_off_leaves wol
                LEFT JOIN ${this.dbNames.ems}.employee e on e.id = wol.employee_id
                 LEFT JOIN ${this.dbNames.ems}.branches b on b.id = e.branch_id

            WHERE 1=1`
            
        
        if (req?.branchId) {
            query += ` AND e.branch_id = ${req.branchId}`
        }
    
        return await this.query(query)
    }
    
    

    async getWeekOfLeaves(): Promise<any> {
        return await this.createQueryBuilder('wol')
            .select([
                'wol.id',
                'wol.week_name AS weekName',
                'wol.employee_id AS employeeId',
                'wol.employee_code AS employeeCode',
                'wol.employee_name AS employeeName'
            ])
            .getRawMany();
    }

}