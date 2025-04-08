import { Injectable } from '@nestjs/common';


import { CommonResponseModel, DashboardReq } from '@hrexpert/shared-models';
import { WeekOffLeavesDTO } from './dtos/week-of-leaves.dto';
import { WeekOffLeavesRepository } from './dtos/week-of-leaves.repo';
import { WeekOffLeavesUpDateDTO } from './dtos/week-off-leaves-update.dto';
import { WeekOffLeaves } from './week-of-leaves.entity';


@Injectable()
export class WeekOffLeavesService {

    constructor(
        private weekOffLeavesRepo: WeekOffLeavesRepository,
    ) { }

   
    async createWeekOffLeaves(req: WeekOffLeavesDTO): Promise<CommonResponseModel> {
        try {
            const savedEntities = [];
            
            if (!Array.isArray(req.employee)) {
                throw new TypeError('Expected Employees to be an array');
            }
            
            for (const employee of req.employee) {
                const existingData = await this.weekOffLeavesRepo.findOne({
                    where: {
                        isActive: true,
                        weekName: req.weekName,
                        employeeId: employee.employeeId,
                    },
                });
                
                
                if (existingData) {
                    return new CommonResponseModel(
                        false,
                        0,
                        `Week off  already exists for the employee.`,
                        employee.employeeId
                    );
                }
                const entityData = new WeekOffLeaves();
                entityData.weekName = req.weekName;
                entityData.employeeId = employee.employeeId;
                entityData.createdUser = req.createdUser;
                entityData.updatedUser = req.updatedUser;
                entityData.isActive = req.isActive;
                entityData.versionFlag = req.versionFlag;
    
               
                const savedData = await this.weekOffLeavesRepo.save(entityData);
                savedEntities.push(savedData);
            }
    
            if (savedEntities.length > 0) {
                return new CommonResponseModel(true, savedEntities.length, 'Created successfully', savedEntities);
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong during WeekOffLeaves creation', []);
            }
        } catch (err) {
            
            throw err;
        }
    }
    

    

    async getAllWeekOffLeaves(req:DashboardReq): Promise<CommonResponseModel> {
        console.log(req,"---------------------------------------------")
        const data = await this.weekOffLeavesRepo.getAllWeekOffLeaves(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrived sucessfully', data)
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found', [])
        }
    }
    async getAllActiveWeekOffLeaves(): Promise<CommonResponseModel> {
        const data = await this.weekOffLeavesRepo.find({
            where: {
                isActive: true
            }
        });

        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No active WeekOfLeaves found', []);
    }

    async updateWeekOffLeaves(req: WeekOffLeavesUpDateDTO): Promise<CommonResponseModel> {
        try {
            // Check if the same weekName already exists for the given employeeId
            const existingWeekOff = await this.weekOffLeavesRepo.findOne({
                where: {
                    weekName: req.weekName, // Ensure the weekName is unique for the employee
                    employeeId: req.employeeId,
                    isActive: true, // Check only active entries if necessary
                },
            });
    
            // If a record exists and it's not the same record being updated
            if (existingWeekOff && existingWeekOff.id !== req.id) {
                return new CommonResponseModel(
                    false,
                    0,
                    `The employee already  assigned as a week off.`,
                    existingWeekOff.id // Optionally, include the conflicting record's ID
                );
            }
    
            // Proceed with the update
            const result = await this.weekOffLeavesRepo.update(
                { id: req.id },
                {
                    weekName: req.weekName,
                    employeeId: req.employeeId,
                    isActive: req.isActive,
                }
            );
    
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.error('Error updating week off leaves:', error);
            throw new Error('An error occurred while updating week off leaves.');
        }
    }
    

    async activateOrDeactivateWeekOffLeave(req: WeekOffLeavesDTO): Promise<CommonResponseModel> {
        try {
            const exists = await this.weekOffLeavesRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No WeekOfLeaves  found');
            }

            const update = await this.weekOffLeavesRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );

            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'WeekOfLeaves deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'WeekOfLeaves already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'WeekOfLeaves activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'WeekOfLeaves already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getWeekNameFromWeekOffLeaves(): Promise<CommonResponseModel> {
        try {
            const weeksOffData = await this.weekOffLeavesRepo.getWeekOfLeaves()
            return new CommonResponseModel(true, 1111, "Week off got", weeksOffData)
        } catch (err) {
            throw err;
        }
    }
}
