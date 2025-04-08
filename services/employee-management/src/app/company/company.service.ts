// src/services/master.service.ts
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { CompanyReq } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './company.entity';
import { CompanyRepository } from './company.repo';

@Injectable()
export class CompanyService {
    constructor(
        private readonly companyRepo: CompanyRepository,
    ) { }


    async createCompany(req: CompanyEntity): Promise<CommonResponseModel> {
        console.log(req)
        try {
            const entity = new CompanyEntity();
            entity.companyName = req.companyName
            entity.companyCode = req.companyCode
            const save = await this.companyRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Company creation', []);
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Failed', err)
        }
    }

    async updateCompany(req: CompanyReq): Promise<CommonResponseModel> {
        try {
            const result = await this.companyRepo.update(
                { id: req.id },
                {
                    companyName: req.companyName,
                    companyCode: req.companyCode,
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

    async getCompany(): Promise<CommonResponseModel> {
        let result = await this.companyRepo.getCompanyRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getActiveCompany(): Promise<CommonResponseModel> {
        const data = await this.companyRepo.find({ where: { isActive: true } });
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active Division data found', []);
    }

    async activateDeactivateCompany(req: CompanyReq): Promise<CommonResponseModel> {
        try {
            const exists = await this.companyRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 77787, 'No Company Found');
            }
            const update = await this.companyRepo.update(
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
