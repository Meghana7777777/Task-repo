import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveAdjustmentEntity } from "../entities/leave-adjustment-entity";

@Injectable()
export class LeaveAdjustmentRepository extends Repository<LeaveAdjustmentEntity> {

    constructor(@InjectRepository(LeaveAdjustmentEntity) private leaveAdjustmentRepo: Repository<LeaveAdjustmentEntity>
    ) {
        super(leaveAdjustmentRepo.target, leaveAdjustmentRepo.manager, leaveAdjustmentRepo.queryRunner);
    }
}