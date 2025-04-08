import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ApplyOTEntity } from "../entity/apply-ot-entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class ApplyOtRepository extends Repository<ApplyOTEntity> {

    constructor(@InjectRepository(ApplyOTEntity) private applyOtRepo: Repository<ApplyOTEntity>
    ) {
        super(applyOtRepo.target, applyOtRepo.manager, applyOtRepo.queryRunner);
    }

    async getAllOt(): Promise<any>{
        return await this.createQueryBuilder('ot')
        .select([
            'ot.id',
            'ot.employee_name AS employeeName',
            'ot.DATE',
            'ot.in_time AS inTime',
            'ot.out_time AS outTime',
            'ot.working_hours AS workingHours',
            'ot.is_Active AS isActive'
        ])
        .getRawMany();
    }
}
