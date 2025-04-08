import { Injectable } from '@nestjs/common';
import { ShiftDto } from './shift.dto';
import { CommonResponseModel, ShiftReq } from '@hrexpert/shared-models';
import { ShiftsRepository } from './repositories/shift-repo';
import { ShiftsEntity } from './shifts.entity';

@Injectable()
export class ShiftsService {
    constructor(
        private shiftRepo: ShiftsRepository,
    ) { }

    async createShift(req: ShiftDto): Promise<CommonResponseModel> {
        try {
            const entity = new ShiftsEntity();
            entity.shiftType = req.shiftType;
            entity.startTime = req.startTime;
            
            entity.endTime = req.endTime;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
            entity.versionFlag = req.versionFlag;
            entity.branchName = req.branchName;
    
            const save = await this.shiftRepo.save(entity);
            if (save) {
                return new CommonResponseModel(true, 1, 'Created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong in Shift creation', []);
            }
        } catch (err) {
            throw err;
        }
    }
    

    async getAllShifts(req: any): Promise<CommonResponseModel> {
        const result = await this.shiftRepo.getAllShifts(req)
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveShifts(): Promise<CommonResponseModel> {
        const data = await this.shiftRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active shifts data found', []);
    }

    async updateShifts(req: ShiftDto): Promise<CommonResponseModel> {
        try {
            const result = await this.shiftRepo.update(
                { id: req.id },
                {
                    shiftType: req.shiftType,
                    startTime: req.startTime,
                    endTime: req.endTime,
                    branchName: req.branchName, // Use branchId
                    updatedUser: req.updatedUser,
                    isActive: req.isActive,
                }
            );

            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async activateOrDeactivateShifts(req: ShiftDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.shiftRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Shift found');
            }

            const update = await this.shiftRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Shift deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Shift already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Shift activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Shift already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
    async getAllShidtDetailsAgaisntLogDate(req: ShiftReq): Promise<CommonResponseModel> {
        try {
            const data = await this.shiftRepo.getAllShidtDetailsAgaisntLogDate(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data Retrived Sucessfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }
}
