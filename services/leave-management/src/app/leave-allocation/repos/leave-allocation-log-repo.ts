import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeaveAllocationsLog } from "../entities/leave-allocation-log.entity";

@Injectable()
export class LeaveAllocationsLogRepository extends Repository<LeaveAllocationsLog> {

    constructor(@InjectRepository(LeaveAllocationsLog) private leaveAllocationRepo: Repository<LeaveAllocationsLog>
    ) {
        super(leaveAllocationRepo.target, leaveAllocationRepo.manager, leaveAllocationRepo.queryRunner);
    }
}