import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { AttendanceDevRepository } from "./repository/attendance-device.repo";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { AttendanceDeviceDto } from "./dto/attendance-device.dto";
import { AttendanceDevEntity } from "./entity/attendance-device.entity";

@Injectable()
export class AttendanceDevService {
    constructor (
        private attendancedevRepo : AttendanceDevRepository,
        private dataSource : DataSource
    ) { }

    async CreateAttendanceDevice (dto: AttendanceDeviceDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.attendancedevRepo.findOne({
                where: dto.id
                    ? { branchId: dto.branchId, deviceType: dto.deviceType }
                    : { branchId: dto.branchId }
            });
            
            if (exists) {
                return new CommonResponseModel(false, 3, 'Already exists');
            }
            const entity = new AttendanceDevEntity();
            entity.branchId = dto.branchId
            entity.deviceType = dto.deviceType
            if (dto.id) {
                entity.id = dto.id;
                entity.updatedUser = dto.updatedUser
            }

            const savedEntity = await this.attendancedevRepo.save(entity);
            if (savedEntity) {
                const message = dto.id ? 'Updated Successfully' : 'Created Successfully';
                return new CommonResponseModel(true, 6281481725, message, savedEntity);
            } else {
                return new CommonResponseModel(false, 8309649082, 'Failed to save Attendance Device details');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAttendanceDevice (): Promise<CommonResponseModel> {
        const data = await this.attendancedevRepo.getAttendanceDevice()
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    
    }
    async getActiveAttendanceDevice(): Promise<CommonResponseModel> {
        const data = await this.attendancedevRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active branches found', []);
    }


    async activateDeactivateAttandenceDev(req: AttendanceDeviceDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.attendancedevRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No AttendanceDevice found');
            }
            const update = await this.attendancedevRepo.update({ id: req.id }, { isActive: req.isActive })

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'AttendanceDevice Deactivated Successfully', update);
                }
                else {
                    return new CommonResponseModel(false, 0, 'Failed', []);
                }
            }
            else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'AttendanceDevice Activated Successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'AttendanceDevice Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (error) {
            console.log(error);
        }
    }








}
