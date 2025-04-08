import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobsEntity } from "./jobs.entity";



@Injectable()
export class JobsRepository extends Repository<JobsEntity> {

    constructor(@InjectRepository(JobsEntity) private jobsRepo: Repository<JobsEntity>
    ) {
        super(jobsRepo.target, jobsRepo.manager, jobsRepo.queryRunner);
    }
}