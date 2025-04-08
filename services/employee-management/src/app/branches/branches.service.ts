import { Injectable } from '@nestjs/common';
import { BranchDto } from './branch.dto';
import { Branches } from './branches.entity';
import { BranchesRepository } from './repositories/branch-repo';
import { CommonResponseModel, ErrorResponse } from '@hrexpert/shared-models'
import { BranchIdDto } from './branch-req.dto';
import { Not } from 'typeorm';


@Injectable()
export class BranchesService {

    constructor(
        private branchesRepo: BranchesRepository,
    ) { }

    async createBranch(req: BranchDto): Promise<CommonResponseModel> {
        console.log(req);
        try {
            const existingBranch = await this.branchesRepo.findOne({
                where: [
                    { branchName: req.branchName },
                ],
            });
            if (existingBranch) {
                return new CommonResponseModel(false, 0, 'Branch with the same name or code already exists', []);
            }
            const entity = new Branches();
            entity.branchName = req.branchName;
            entity.branchCode = req.branchCode;
            entity.companyName = req.companyId;
            entity.isEmployee = req.isEmployee;
            entity.isWorker = req.isWorker;
            entity.address = req.address;
            entity.state = req.state;
            entity.unitName = req.unitName;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
            const save = await this.branchesRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Branch creation', []);
            }
        } catch (err) {
            throw err;
        }
    }


    async getAllBranches(): Promise<CommonResponseModel> {
        const result = await this.branchesRepo.getAllBranches()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveBranches(): Promise<CommonResponseModel> {
        const data = await this.branchesRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active branches found', []);
    }

    async updateBranch(req: BranchDto): Promise<CommonResponseModel> {
        try {

            const result = await this.branchesRepo.update(
                { id: req.id },
                {
                    branchName: req.branchName,
                    address: req.address,
                    branchCode: req.branchCode,
                    updatedUser: req.updatedUser,
                    // ptApplicable: req.ptApplicable,
                    companyName: req.companyId,
                    isEmployee: req.isEmployee,
                    isWorker: req.isWorker,
                    isActive: req.isActive,
                    state: req.state,
                    unitName: req.unitName,
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

    async activateOrDeactivateBranch(req: BranchDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.branchesRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Branch found');
            }

            const update = await this.branchesRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Branch deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Branch already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Branch activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Branch already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getBranchName(dto: BranchIdDto): Promise<CommonResponseModel> {
        const record = await this.branchesRepo.findOne({ select: ['branchName'], where: { id: dto.branchId, isActive: true } });
        if (!record) {
            throw new ErrorResponse(99998, 'No Records Found');
        } else {
            return new CommonResponseModel(true, 1, '', record)

        }
    }

    async getBranchesByCompany(companyName: any): Promise<CommonResponseModel> {
        console.log(companyName);

        try {
            if (!companyName) {
                return new CommonResponseModel(false, 0, 'Company name is required', []);
            }
            const branches = await this.branchesRepo.query(
                `SELECT br.branch_name AS branchName, br.id
                FROM branches br 
                LEFT JOIN company c ON br.company_name = c.id
                WHERE c.company_name = '${companyName}' AND br.is_active = true`,
            );
            if (branches.length > 0) {
                return new CommonResponseModel(true, 1, 'Branches retrieved successfully', branches);
            }
            return new CommonResponseModel(false, 0, `No branches found for company: ${companyName}`, []);
        } catch (error) {
            console.error('Error fetching branches by company:', error);
            return new CommonResponseModel(false, 0, 'Failed to retrieve branches', []);
        }
    }



}
