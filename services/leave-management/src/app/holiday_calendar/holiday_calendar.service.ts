import { CommonResponseModel, HolidayReqForGenerateSwipe } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { HolidayDto } from './holiday_calendar.dto';
import { HolidaysRepository } from './repositories/holiday_cal.repo';
import { HolidaysEntity } from './holiday_calendar.entity';
import { AttendanceEntity } from '../attendance/dto/attendance-entity';
import { AttendanceRepo } from '../attendance/dto/attendance-repo';
import { In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class HolidayCalanderService {
    constructor(
        private holidaysRepo: HolidaysRepository,
        private attendanceRepo:AttendanceRepo
    ) {}

    async createHoliday(req: HolidayDto): Promise<CommonResponseModel> {
        try {
            // Check for duplicate holidays
            const duplicateCheck = await this.holidaysRepo.findOne({
                where: {
                    branchId: req.branchId,
                    holidayDate:req.holidayDate
                },
            });
    
            if (duplicateCheck) {
                return new CommonResponseModel(
                    false,
                    0,
                    'Holiday with the same  date, and branch already exists',
                    [],
                );
            }
    
            // Create a new holiday entity
            const entity = new HolidaysEntity();
            entity.holidayName = req.holidayName;
            entity.holidayDate = req.holidayDate;
            entity.branchId = req.branchId;
            entity.type = req.type;
            entity.isActive = req.isActive;
            entity.createdUser = req.createdUser;
            entity.updatedUser = req.updatedUser;
    
            // Save the new holiday entity
            const save = await this.holidaysRepo.save(entity);
    
            if (save) {
                // Update attendance records for the holiday date and branch
                await this.updateAttendanceForHoliday(req.holidayDate, req.branchId, req.type);
    
                return new CommonResponseModel(true, 1, 'Holiday created successfully', save);
            } else {
                return new CommonResponseModel(false, 0, 'Error creating holiday', []);
            }
        } catch (err) {
            console.error('Error in createHoliday:', err);
            throw err;
        }
    }
    
    async updateAttendanceForHoliday(holidayDate: string, branchId: number, type: string): Promise<void> {
       
        try {
            // Fetch attendance records for the given date and branch ID
            const attendanceRecords = await this.attendanceRepo.find({
                where: {
                    date: holidayDate,
                    branch: branchId,
                    attnStatus: In(['A', 'P']), // Only fetch records with attnStatus = 'A' or 'P'
                },
            });
            console.log(attendanceRecords,"attendanceRecords")
            // Update the attnStatus based on the holiday type
            for (const record of attendanceRecords) {
                if (type === 'WEEK OFF') {
                    // For WEEK OFF, update A -> W and P -> WP
                    record.attnStatus = record.attnStatus === 'A' ? 'W' : 'WP';
                } else {
                    // For other holiday types, update A -> H and P -> HP
                    record.attnStatus = record.attnStatus === 'A' ? 'H' : 'HP';
                }
            }
    
            // Save the updated records back to the database
            await this.attendanceRepo.save(attendanceRecords);
        } catch (err) {
            console.error('Error updating attendance records for holiday:', err);
            throw err;
        }
    }
    
    async getAllHolidays(): Promise<CommonResponseModel> {
        const holidays = await this.holidaysRepo.find();
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', holidays);
    }

    async getActiveHolidays(req:any): Promise<CommonResponseModel> {
        const result = await this.holidaysRepo.getActiveHolidays(req)
        if (result){
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);

    }

    async getActiveWeekOffAndHolidays(req:HolidayReqForGenerateSwipe): Promise<CommonResponseModel> {
        const result = await this.holidaysRepo.getActiveWeekOffAndHoliday(req)
        if (result){
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);

    }

    async updateHoliday(req: HolidayDto): Promise<CommonResponseModel> {
        const duplicates =await this.holidaysRepo.findOne({where:{holidayName:req.holidayName}})
        if (duplicates) {
            return new CommonResponseModel(
                false,
                0,
                'Holiday with the same name,  already exists',
                [],
            );
        }
        const result = await this.holidaysRepo.update({ id: req.id }, req);
        return result.affected > 0
            ? new CommonResponseModel(true, 1, 'Updated successfully', result)
            : new CommonResponseModel(false, 0, 'Update failed', []);
    }

    async activateOrDeactivateHoliday(req: HolidayDto): Promise<CommonResponseModel> {
        const holiday = await this.holidaysRepo.findOne({ where: { id: req.id } });
        if (!holiday) {
            return new CommonResponseModel(false, 99998, 'No Holiday found');
        }

        holiday.isActive = req.isActive;
        holiday.updatedUser = req.updatedUser;

        const result = await this.holidaysRepo.save(holiday);
        return new CommonResponseModel(true, 1, req.isActive ? 'Holiday activated successfully' : 'Holiday deactivated successfully', result);
    }


    async getHolidaysDateData(): Promise<CommonResponseModel> {
        try {
            const holidayData = await this.holidaysRepo.getHolidayDatesRepo()
            return new CommonResponseModel(true, 1111, "holidayData Got",holidayData)
        } catch (err) {
            throw err;
        }
    }
}