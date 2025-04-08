import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShiftsEntity } from "../shifts.entity";
import { ShiftDto, ShiftReq } from "libs/shared-models/src/lib";
import { Branches } from './../../../../../employee-management/src/app/branches/branches.entity'


@Injectable()
export class ShiftsRepository extends Repository<ShiftsEntity> {
    private readonly dbNames: any
    constructor(@InjectRepository(ShiftsEntity) private shiftRepo: Repository<ShiftsEntity>,
        private readonly configService: ConfigService
    ) {
        super(shiftRepo.target, shiftRepo.manager, shiftRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');

    }

    async getAllShidtDetailsAgaisntLogDate(req: ShiftReq): Promise<any> {
        return await this.createQueryBuilder('shift')
            .select([
                'shift.id',
                'shift.company_code AS comapanyCode',
                'shift.unit_code AS unitCode',
                'shift.remarks',
                'shift.shift_type AS shiftType',
                'shift.start_time AS startTime',
                'b.branch_name AS branchName',
                'shift.end_time AS endTime',
            ])
            .leftJoin(Branches, 'b', 'b.id = shift.branch_id')
            .where('shift.start_time IS NOT NULL')
            .orderBy(
                `ABS(TIMESTAMPDIFF(SECOND, shift.start_time, CAST(:logDate AS TIME)))`,
                'ASC'
            )
            .setParameter('logDate', req.logDate)
            .limit(1)
            .getRawMany();
    }

   
    async getAllShifts(req: ShiftDto): Promise<any> {
       
        let query = `SELECT  s.id AS id,
                    b.branch_name AS branchName,
                    s.shift_type AS shiftType,
                    DATE_FORMAT(s.start_time, '%H:%i') AS startTime,
                    DATE_FORMAT(s.end_time, '%H:%i') AS endTime,
                    s.is_active AS isActive,
                    s.branch_id AS branchId
                    FROM ${this.dbNames.masters}.shifts s 
                   LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = s.branch_id
                   WHERE 1=1`;
    
        if (req.branchId != undefined) {
            query = query + ` AND s.branch_id = ${req.branchId}`;
        } 
    
        return await this.shiftRepo.query(query);
    }
    


}