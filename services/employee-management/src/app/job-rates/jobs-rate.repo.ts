import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobsRateEntity } from "./jobs-rate.entity";
import { Branches } from "../branches/branches.entity";
import { JobsEntity } from "../jobs/jobs.entity";



@Injectable()
export class JobsRateRepository extends Repository<JobsRateEntity> {

    constructor(@InjectRepository(JobsRateEntity) private jobsRateRepo: Repository<JobsRateEntity>
    ) {
        super(jobsRateRepo.target, jobsRateRepo.manager, jobsRateRepo.queryRunner);
    }

    async getJobRatesRepo(): Promise<any> {
        return await this.createQueryBuilder('jobr')
        .select([
            'jobr.id as id',
            'jobr.rate as rate',
            "REPLACE(jobr.eff_from_date, '/', '-') AS effFromDate", // Wrapped in double quotes
            'jobr.is_active AS isActive',
            'jobr.job_id AS jobId',
            'j.job_code AS jobCode',
            'j.job_description AS jobDescription',
            'jobr.branch_id AS branchId',
            'b.branch_name AS branchName'
        ])           
        .leftJoin(Branches, 'b', 'b.id = jobr.branch_id')
        .leftJoin(JobsEntity, 'j', 'j.id = jobr.job_id')
        .getRawMany();
    }
}