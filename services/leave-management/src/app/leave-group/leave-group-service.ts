import { Injectable } from '@nestjs/common';
import { CommonResponseModel, ErrorResponse } from '@hrexpert/shared-models'
import { LeaveGroupsRepository } from './leave-groups.repo';
import { LeaveGroupsDto } from './dto/leave-group-dto';
import { LeaveGroupEntity } from './dto/leave-group-entity';


@Injectable()
export class LeaveGroupsService {

    constructor(
        private leaveGroupsRepo: LeaveGroupsRepository,
    ) { }

    async createLeaveGroups(req: LeaveGroupsDto): Promise<CommonResponseModel> {
       
        try {
            
            const existingLeaveGroup = await this.leaveGroupsRepo.findOne({
                where: [
                    { name: req.name },
                    { code: req.code },
                  ,
                ],
            });
    
            if (existingLeaveGroup) {
                return new CommonResponseModel(false, 0, 'Leave Groups with the same name or code already exists', []);
            }
    
            
            const entity = new LeaveGroupEntity();
            entity.name = req.name;
            entity.code = req.code;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
    
            const save = await this.leaveGroupsRepo.save(entity);
    
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Leave Group creation', []);
            }
        } catch (err) {
            throw err;
        }
    }
    

    async getAllLeaveGroups(): Promise<CommonResponseModel> {
        const result = await this.leaveGroupsRepo.getAllLeaveGroups()
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveLeaveGroups(): Promise<CommonResponseModel> {
        const data = await this.leaveGroupsRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active leaveGroup found', []);
    }

    async updateLeaveGroups(req: LeaveGroupsDto): Promise<CommonResponseModel> {
        try {
            const duplicates =await this.leaveGroupsRepo.findOne({where:{name:req.name,
                code :req.code
            }})
            if (duplicates) {
                return new CommonResponseModel(
                    false,
                    0,
                    'LeaveGroup with the same name already exists',
                    [],
                );
            }
            const result = await this.leaveGroupsRepo.update(
                { id: req.id },
                {
                    name: req.name,
                    code : req.code ,
                    
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

    async activateOrDeactivateLeaveGroups(req: LeaveGroupsDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.leaveGroupsRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No LeaveGroup found');
            }

            const update = await this.leaveGroupsRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'LeaveGroup deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'LeaveGroup already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'LeaveGroup activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'LeaveGroup already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    
    
}
