import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IsLeaveAllocatedLogs } from "../entities/is-leaves-allocated-logs-entity";

@Injectable()
export class IsLeaveAllocatedLogRepository extends Repository<IsLeaveAllocatedLogs> {

    constructor(@InjectRepository(IsLeaveAllocatedLogs) private isLeaveAllocatedLogRepo: Repository<IsLeaveAllocatedLogs>
    ) {
        super(isLeaveAllocatedLogRepo.target, isLeaveAllocatedLogRepo.manager, isLeaveAllocatedLogRepo.queryRunner);
    }
}