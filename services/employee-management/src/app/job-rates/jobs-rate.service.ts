// src/services/master.service.ts
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { JobRatesReq } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { JobsRateEntity } from './jobs-rate.entity';
import { JobsRateRepository } from './jobs-rate.repo';
import dayjs from 'dayjs';

@Injectable()
export class JobsRateService {
    constructor(
        private readonly jobsRateRepo: JobsRateRepository,
    ) { }


    async createJobRates(req: JobsRateEntity): Promise<CommonResponseModel> {
        console.log(req)
        try {
            const entity = new JobsRateEntity();
            entity.rate = req.rate
            entity.effFromDate = dayjs(req.effFromDate).format("YYYY-MM-DD");
            entity.branchId =  req.branchId
            entity.jobId = req.jobId
            const save = await this.jobsRateRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Job Rates creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async updateJobRates(req: JobRatesReq): Promise<CommonResponseModel> {
        try {
            const result = await this.jobsRateRepo.update(
                { id: req.id },
                {
                    rate: req.rate,
                    effFromDate: dayjs(req.effFromDate).format("YYYY-MM-DD"),
                    updatedUser: req.updatedUser,
                    isActive: req.isActive
                }
            );
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getJobRates(): Promise<CommonResponseModel> {
        let result = await this.jobsRateRepo.getJobRatesRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async activateDeactivateJobRates(req: JobRatesReq): Promise<CommonResponseModel> {
        try {
            const exists = await this.jobsRateRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 77787, 'No Job Rates Found');
            }
            const update = await this.jobsRateRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Deactivated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Activated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were Made');
            }
        } catch (err) {
            return err;
        }
    }
}
