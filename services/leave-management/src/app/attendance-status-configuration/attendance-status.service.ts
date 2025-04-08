import { Injectable } from '@nestjs/common';
import { AttendanceStatusDto } from './atten.dto';
import { CommonResponseModel } from '@hrexpert/shared-models';
import { AttendanceStatusRepository } from './repositories/attendance-status-repo';
import { AttendanceStatusEntity } from './attendance-status.entity';

@Injectable()
export class AttendanceStatusService {
    constructor(
        private attendanceStatusRepo: AttendanceStatusRepository,
    ) { }

    async createAttendanceStatus(req: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            // const data = await this.attendanceStatusRepo.find({ where: { branchName: req.branchName, attendanceStatus: req.attendanceStatus } });
            // if (data) {
            //     return new CommonResponseModel(false, 0, 'AttendanceStatus type already there for selected branch');
            // } else {
                const entity = new AttendanceStatusEntity();
                entity.attendanceStatus = req.attendanceStatus;
                entity.startTime = req.startTime;
                entity.endTime = req.endTime;
                entity.isActive = req.isActive;
                entity.createdUser = req.createdUser;
                entity.updatedUser = req.updatedUser;
                entity.versionFlag = req.versionFlag;
                entity.branchName = req.branchName;
                const save = await this.attendanceStatusRepo.save(entity);
                if (save) {
                    return new CommonResponseModel(true, 1, 'Created successfully', save);

                } else {
                    return new CommonResponseModel(false, 0, 'Something went wrong in AttendanceStatus creation', []);

                }
            // }
        } catch (err) {
            throw err;
        }
    }

    async getAllAttendanceStatus(req: any): Promise<CommonResponseModel> {
        const result = await this.attendanceStatusRepo.getAllAttendanceStatus(req)
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    async getActiveAttendanceStatus(): Promise<CommonResponseModel> {
        const data = await this.attendanceStatusRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active AttendanceStatus data found', []);
    }

    async updateAttendanceStatus(req: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            const result = await this.attendanceStatusRepo.update(
                { id: req.id },
                {
                    attendanceStatus: req.attendanceStatus,
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

    async activateOrDeactivateAttendanceStatus(req: AttendanceStatusDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.attendanceStatusRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No AttendanceStatus found');
            }

            const update = await this.attendanceStatusRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'AttendanceStatus deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'AttendanceStatus already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'AttendanceStatus activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'AttendanceStatus already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }
}
