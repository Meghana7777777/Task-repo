import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MemoEntity } from "./memo.entity";
import { Employee } from "../employee-onboarding/entities/employee-details.entity";

@Injectable()
export class MemoRepository extends Repository<MemoEntity> {

    constructor(@InjectRepository(MemoEntity) private memoRepo: Repository<MemoEntity>
    ) {
        super(memoRepo.target, memoRepo.manager, memoRepo.queryRunner);
    }

    async getAllMemoRepo(): Promise<any> {
        return await this.createQueryBuilder('me')
            .select([
                'me.id as id',
                'me.date as date',
                'me.type as type',
                'me.feedback_on as feedBackOn',
                'me.description as description',
                'me.impact_on_bussiness as impactOnBussiness',
                'emp.id AS employeeId',
                "CONCAT(emp.first_name, ' ', emp.last_name) AS employeeName",
                'emp.employee_code AS employeeCode',
                'me.is_active as isActive',
                'me.created_user as createdUser',
                'me.updated_user as updatedUser',
                'me.version_flag as versionFlag',
            ])
            .leftJoin(Employee, 'emp', 'emp.id = me.employee_id')
            .getRawMany();
    }
}