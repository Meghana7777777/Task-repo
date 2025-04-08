import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExceededLeavesEntity } from "../entities/exceeded-leaves.entity";


@Injectable()
export class ExceededLeavesRepository extends Repository<ExceededLeavesEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(ExceededLeavesEntity) private exceededLeavesRepository: Repository<ExceededLeavesEntity>,
        private readonly configService: ConfigService

    ) {
        super(exceededLeavesRepository.target, exceededLeavesRepository.manager, exceededLeavesRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }
    async getAllExceedLeavesDataRepo(): Promise<any> {
        let query = `
           SELECT 
           exc.id AS id, 
           exc.employee_id AS employeeId,
           exc.employee_code AS empCode,
           exc.leave_name AS leaveName,
           exc.no_of_days AS noOfDays, 
           exc.leave_reason AS leaveReason, 
           exc.leave_address AS leaveAddress, 
           exc.leaves_allotted AS leavesAlloted,
           exc.leaves_used AS leavesUsed, 
           exc.available_leaves AS availableLeaves,
           CONCAT(e.first_name, " ", e.last_name) AS employeeName
           FROM ${this.dbNames.lms}.exceeded_leaves exc
           LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = exc.employee_id
           WHERE DATE(exc.created_at) = CURDATE()`
        return await this.exceededLeavesRepository.query(query);
    }

}