import { Injectable } from '@nestjs/common';


import { CommonResponseModel } from '@hrexpert/shared-models'
import { TypesOfLeavesRepository } from './repo/types-of-leave.repo';
import { TypesOfLeavesDTO } from './dto/types-of-leave.dto';
import { TypesOfLeaves } from './types-of-leave.entity';


@Injectable()
export class TypesOfLeavesService {

    constructor(
        private typesOfLeavesRepo: TypesOfLeavesRepository,
    ) { }

    async createTypesOfLeaves(req:  TypesOfLeavesDTO): Promise<CommonResponseModel> {
        console.log(req)
        try {

            const entity = new  TypesOfLeaves();
            entity.typeOfLeave = req.typeOfLeave;
            entity.leaveCode = req.leaveCode;
            entity.defaultLeaves =req.defaultLeaves
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;

            const save = await this.typesOfLeavesRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);

            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Branch creation', []);

            }
        } catch (err) {
            throw err;
        }
    }

    async getAllTypesOfLeaves(): Promise<CommonResponseModel> {
        const result = await this.typesOfLeavesRepo.getAllTypesOfLeaves()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getAllActiveTypesOfLeaves(): Promise<CommonResponseModel> {
        const data = await this.typesOfLeavesRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active branches found', []);
    }

    async updateTypesOfLeaves(req:  TypesOfLeavesDTO): Promise<CommonResponseModel> {
        try {
            const result = await this.typesOfLeavesRepo.update(
                { id: req.id },
                {
                    typeOfLeave: req.typeOfLeave,
                    defaultLeaves: req.defaultLeaves,
                    leaveCode:req.leaveCode,
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

    async activateOrDeactivateTypesOfLeave(req:  TypesOfLeavesDTO): Promise<CommonResponseModel> {
        try {
            const exists = await this.typesOfLeavesRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Type Of Leaves found');
            }

            const update = await this.typesOfLeavesRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'TypeOfLeaves deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'TypeOfLeaves already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'TypeOfLeaves activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'TypeOfLeaves already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    
    async typesOfLeaves(): Promise<CommonResponseModel> {
        try {
            const typesOfLeaveData = await this.typesOfLeavesRepo.getWeekOfLeavesRepo()
            return new CommonResponseModel(true, 1111, "type of leaves got",typesOfLeaveData)
        } catch (err) {
            throw err;
        }
    }
}
