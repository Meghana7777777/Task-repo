// src/services/master.service.ts
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsEntity } from './jobs.entity';
import { JobReq } from '@hrexpert/shared-models';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(JobsEntity)
        private readonly jobsRepository: Repository<JobsEntity>,
    ) { }


     async createJob(req: JobReq): Promise<CommonResponseModel> {
            console.log(req)
            try {
     
                const entity = new JobsEntity();
                entity.jobCode = req.jobCode;
                entity.jobDescription = req.jobDescription
                entity.isActive = req.isActive;
                entity.createdUser = req.createdUser;
                entity.updatedUser = req.updatedUser;
                entity.versionFlag = req.versionFlag;
    
                const save = await this.jobsRepository.save(entity);
                if (save) {
                    return new CommonResponseModel(true, 1, 'Created successfully', save);
    
                } else {
                    return new CommonResponseModel(false, 0, 'Something went wrong in jobs creation', []);
    
                }
            } catch (err) {
                throw err;
            }
        }
    
        async getAllJobs(): Promise<CommonResponseModel> {
            const result = await this.jobsRepository.find()
            if (result.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
            }
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    
        async getActiveJobs(): Promise<CommonResponseModel> {
            const data = await this.jobsRepository.find({
                where: {
                    isActive: true
                }
            });
    
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            }
            return new CommonResponseModel(true, 1, 'No active jobs found', []);
        }
    
        async updateJob(req: JobReq): Promise<CommonResponseModel> {
            try {
                const result = await this.jobsRepository.update(
                    { id: req.id },
                    {
                        jobCode: req.jobCode,
                        jobDescription: req.jobDescription,
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
    
        async activateOrDeactivateJob(req: JobReq): Promise<CommonResponseModel> {
            try {
                const exists = await this.jobsRepository.findOne({ where: { id: req.id } });
                if (!exists) {
                    throw new CommonResponseModel(false, 99998, 'No job found');
                }
    
                const update = await this.jobsRepository.update(
                    { id: req.id },
                    { isActive: req.isActive, updatedUser: req.updatedUser }
                );
    
                if (exists.isActive && !req.isActive) {
                    if (update.affected) {
                        return new CommonResponseModel(true, 1, 'Job deactivated successfully');
                    } else {
                        throw new CommonResponseModel(false, 0, 'Job already deactivated');
                    }
                } else if (!exists.isActive && req.isActive) {
                    if (update.affected) {
                        return new CommonResponseModel(true, 1, 'Job activated successfully');
                    } else {
                        throw new CommonResponseModel(false, 0, 'Job already activated');
                    }
                } else {
                    return new CommonResponseModel(false, 0, 'No changes were made');
                }
            } catch (err) {
                return err;
            }
        }
 
}
