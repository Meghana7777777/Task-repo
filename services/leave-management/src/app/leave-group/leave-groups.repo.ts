import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveGroupEntity } from "./dto/leave-group-entity";
import { ApplyLeaveBrachDto } from "@hrexpert/shared-models";




@Injectable()
export class LeaveGroupsRepository extends Repository<LeaveGroupEntity> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeaveGroupEntity) private leaveGroupsRepo: Repository<LeaveGroupEntity>
    ) {
        super(leaveGroupsRepo.target, leaveGroupsRepo.manager, leaveGroupsRepo.queryRunner);
    }
    async getAllLeaveGroups(): Promise<any> {
        return await this.createQueryBuilder('le')
            .select([
                'le.id AS id',
                'le.name AS name',
                'le.code AS code',
                
                'le.is_active AS isActive'
            ])
            .getRawMany();
    }

 async getActiveLeaveGroupByIds(req: ApplyLeaveBrachDto): Promise<any> {
        let query = `
        SELECT  
       e.id AS id,
                e.id AS empId,
                e.employee_code AS employeeCode,
                e.branch_id AS branchId,
                e.employee_type_id AS employeeTypeId,
               e.leave_group AS leaveGroup,
                e.branch_id AS branchId,
                br.branch_name AS branchName,
                CONCAT(e.first_name, ' ', e.last_name) AS employeeName,
                le.name AS name,le.id AS leaveGroupId
        FROM ${this.dbNames.lms}.leave_group le
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.leave_group = le.id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id`
      if (req.branchId) {
            query = query + ` and e.branch_id = ${req.branchId}`
        }
        
        return await this.leaveGroupsRepo.query(query);
    }

   
}