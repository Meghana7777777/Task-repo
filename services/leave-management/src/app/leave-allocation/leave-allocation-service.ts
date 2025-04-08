import { CommonResponseModel, EmpDataReq, LeaveAllocationReqDto } from '@hrexpert/shared-models';
import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { ApplyForLeavesDto } from '../apply-for-leaves/dto/apply-for-leaves.dto';
import { LeaveAdjustmentDto } from './dto/leave-adjustment-dto';
import { LeaveAllocationsDto } from './dto/leave-allocation-dto';
import { LeaveAllocations } from './entities/leave-allocation-entity';
import { LeaveAllocationsLog } from './entities/leave-allocation-log.entity';
import { LeaveAdjustmentRepository } from './repos/leave-adjustment.repo';
import { LeaveAllocationsLogRepository } from './repos/leave-allocation-log-repo';
import { LeaveAllocationsRepository } from './repos/leave-allocation-repository';
import { LeaveAllocationsMonthlyLogRepository } from './repos/leave-allocations-monthly-logs-repo';

@Injectable()
export class LeaveAllocationsService {

    constructor(
        private allocationRepo: LeaveAllocationsRepository,
        private allocationLogRepo:  LeaveAllocationsLogRepository,
        private leaveAdjustmentRepo: LeaveAdjustmentRepository,
        private dataSource: DataSource,
        private leaveAllocationsMonthlyLogRepo: LeaveAllocationsMonthlyLogRepository,

    ) { }
    
    async getAllActiveEmpDropDown(req: EmpDataReq): Promise<CommonResponseModel> {
        try{
            const data = await this.allocationRepo.getAllActiveEmpDropDown(req)
            return data.length > 0
            ? new CommonResponseModel(true, 1, 'Data Retrieved successfully', data)
            : new CommonResponseModel(false, 0, 'No Data Found', []);
        }catch(error){
            throw(error)
        }
    }
    
    async getAllActiveEmp(req: EmpDataReq): Promise<CommonResponseModel> {
        try{
            const data = await this.allocationRepo.getAllActiveEmp(req)
            console.table(data,)
            const getExisting =  await this.allocationRepo.find()
            const existingEmployeeIds = new Set(getExisting.map((item) => item.employeeId));
            const filteredData = data.filter((employee) => !existingEmployeeIds.has(employee.id));
            console.table(data,filteredData)
            return filteredData.length > 0
            ? new CommonResponseModel(true, 1, 'Data Retrieved successfully', filteredData)
            : new CommonResponseModel(false, 0, 'No Data Found', []);
        }catch(error){
            throw(error)
        }
    }
    
    async getAllActiveLeaveTypes(): Promise<CommonResponseModel> {
        try{
            const data = await this.allocationRepo.getAllActiveLeaveTypes()
            return data.length > 0
            ? new CommonResponseModel(true, 1, 'Data Retrieved successfully', data)
            : new CommonResponseModel(false, 0, 'No Data Found', []);
        }catch(error){
            throw(error)
        }
    }
    
    async getLeaveAllocationData(req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            const empData = await this.allocationRepo.getEmpAllocation(req);
    
            if (empData.length === 0) {
                return new CommonResponseModel(false, 0, 'No Data Found', []);
            }
    
            const empIds = empData.map(emp => emp.empId);
            const leaveAllocations = await this.allocationRepo.getMultipleEmpLeaveAllocations(empIds);
    
            const leaveDataMap = leaveAllocations.reduce((acc, leave) => {
                acc[leave.empId] = acc[leave.empId] || [];
                acc[leave.empId].push({
                    leaveAllocationId: leave.leaveAllocationId,
                    leaveTypeId: leave.leaveTypeId,
                    type: leave.leaveType,
                    total: leave.leavesAllotted,
                    used: leave.leavesUsed,
                    available: leave.available
                });
                return acc;
            }, {});
    
            const empWithLeaveData = empData.map(emp => ({
                id: emp.empId,
                departmentId: emp.deptId,
                designationId: emp.designId,
                name: emp.fullName,
                department: emp.department,
                designation: emp.designation,
                divisionId: emp.id,
                division: emp.divisionName,
                branchId: emp.id,
                branchName: emp.branchName,
                leaveTypes: leaveDataMap[emp.empId] || [],
                employeeCode:emp.employeeCode
            }));
    
            return new CommonResponseModel(true, 1, 'Data Retrieved successfully', empWithLeaveData);
        } catch (error) {
            throw error;
        }
    }
    
    
    async allocateLeave(dtoArray: LeaveAllocationsDto[]): Promise<CommonResponseModel> {
        try {
            const savedAllocations = [];
            const logEntries = [];
    
            for (const dto of dtoArray) {
                const existingAllocation = await this.allocationRepo.findOne({
                    where: {
                        employeeId: dto.employeeId,
                        leaveTypeId: dto.leaveTypeId,
                        year: new Date().getFullYear().toString(),
                    },
                });
    
                let leaveAllocation: LeaveAllocations;
    
                if (existingAllocation) {
                    leaveAllocation = existingAllocation;
                    leaveAllocation.leavesAllotted = dto.leavesAllotted;
                    leaveAllocation.leavesUsed = dto.leavesUsed;
                    leaveAllocation.available = dto.available;
                    leaveAllocation.isActive = dto.isActive;
                    leaveAllocation.companyCode = dto.companyCode;
                    leaveAllocation.unitCode = dto.unitCode;
                    leaveAllocation.updatedUser = dto.updatedUser;
                } else {
                    leaveAllocation = new LeaveAllocations();
                    leaveAllocation.employeeId = dto.employeeId;
                    leaveAllocation.leaveTypeId = dto.leaveTypeId;
                    leaveAllocation.year = new Date().getFullYear().toString();
                    leaveAllocation.leavesAllotted = dto.leavesAllotted;
                    leaveAllocation.leavesUsed = dto.leavesUsed;
                    leaveAllocation.available = dto.available;
                    leaveAllocation.isActive = dto.isActive;
                    leaveAllocation.companyCode = dto.companyCode;
                    leaveAllocation.unitCode = dto.unitCode;
                    leaveAllocation.createdUser = dto.createdUser;
                }
    
                const savedAllocation = await this.allocationRepo.save(leaveAllocation);
                savedAllocations.push(savedAllocation);
    
                const logEntity = new LeaveAllocationsLog();
                logEntity.employeeId = dto.employeeId;
                logEntity.leaveTypeId = dto.leaveTypeId;
                logEntity.year = new Date().getFullYear().toString();
                logEntity.leavesAllotted = dto.leavesAllotted;
                logEntity.leavesUsed = dto.leavesUsed;
                logEntity.available = dto.available;
                logEntity.companyCode = dto.companyCode;
                logEntity.unitCode = dto.unitCode;
                logEntity.leaveAllocation = savedAllocation;
    
                const savedLog = await this.allocationLogRepo.save(logEntity);
                logEntries.push(savedLog);
            }
    
            if (logEntries.length > 0) {
                await this.allocationLogRepo.save(logEntries);
            }
    
            if (savedAllocations.length > 0) {
                return new CommonResponseModel(true, 1, 'Leave allocations saved successfully');
            } else {
                return new CommonResponseModel(false, 0, 'Something went wrong while saving the leave allocations');
            }
        } catch (error) {
            throw new Error(`Error in allocating leave: ${error.message}`);
        }
    }
    
      
      

    async getAllLeaveBalanceReport(req: LeaveAllocationReqDto): Promise<CommonResponseModel> {
        const data = await this.allocationRepo.getAllLeaveBalanceReport(req)
         if (data.length > 0) {
             return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
         }
         return new CommonResponseModel(true, 1, 'No data found', []);
    }

    // async getLeaveHistoryReport(req: EmpDataReq): Promise<CommonResponseModel> {
    //     try{
    //         const data = await this.allocationRepo.getLeaveHistoryReport(req)
    //         if (data.length>0) {
    //             return new CommonResponseModel(true, 1, "Data Retrieved successfully", data)

    //         } else {
    //             return new CommonResponseModel(true, 0, "No Data Found")

    //         }
    //     }catch(error){
    //         throw(error)
    //     }
    // }
    async getLeaveHistoryReport(req: EmpDataReq): Promise<CommonResponseModel> {
        try{
            const data = await this.allocationRepo.getLeaveHistoryReport(req)
            return data.length > 0
            ? new CommonResponseModel(true, 1, 'Data Retrieved successfully', data)
            : new CommonResponseModel(false, 0, 'No Data Found', []);
        }catch(error){
            throw(error)
        }
    }

     async getAllLeaveAllocations(): Promise<CommonResponseModel> {
        try {
            const data = await this.allocationRepo.getLeaveAllocationsDataRepo()
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Leave Allocations Data Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'Leave Allocations No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }
    async getAllLeaveAllocationsLeaveTypes(req: LeaveAllocationReqDto): Promise<CommonResponseModel> {
        console.log(req,"=================================")
        try {
            const data = await this.allocationRepo.getAllLeaveAllocationsLeaveTypes(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Leave Allocations Data Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'Leave Allocations No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }



    async updateLeaveAllocations(data: ApplyForLeavesDto): Promise<CommonResponseModel> {
        try {
            const updatedResult = await this.allocationRepo.updateLeaveAllocations(data)
            if (updatedResult) {
                return new CommonResponseModel(true, 1, "Manual Leave Applied SuccessFully")
            } else {
                throw new CommonResponseModel(false,0, "Failed While Applying Leave through Manual Creation")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getLeavesByEmpId(req: EmpDataReq):Promise<CommonResponseModel>{
        try{
            const empData = await this.allocationRepo.getLeavesByEmpId(req)
            return empData.length > 0
            ? new CommonResponseModel(true, 1, ' Data retrieved successfully', empData)
            : new CommonResponseModel(false, 2, 'No data found',[])
        }catch(err){
            throw(err)
        }
    }
    
    async createLeaveAdjustment(req: LeaveAdjustmentDto): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        
        try {
            await transactionManager.startTransaction('SERIALIZABLE');
    
            const entityManager = await transactionManager.getQueryRunner();
    
            if (!req.allocationId || !req.requestedBalance || !req.revisedAvailable) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Missing required fields', null);
            }
        
            const allottedExists = await this.allocationRepo.findOne({ where: { id: req.allocationId }});
    
            if (!allottedExists) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Leave allocation not found', null);
            }
    
            if (req.revisedAvailable < 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Revised balance cannot be negative', null);
            }
    
            const entity = this.leaveAdjustmentRepo.create({
                allocationId: req.allocationId,
                requestedBalance: req.requestedBalance,
                revisedAvailable: req.revisedAvailable,
                remarks: req.remarks,
                companyCode: req.companyCode,
                unitCode: req.unitCode,
                createdUser: req.createdUser,
                adjustmentType: req.adjustmentType
            });
    
            const savedAdjustment = await this.leaveAdjustmentRepo.save(entity);

            const calculateBalance = allottedExists.leavesAllotted - req.revisedAvailable
    
            allottedExists.available = req.revisedAvailable;
            allottedExists.leavesUsed = calculateBalance
            await this.allocationRepo.save(allottedExists);
    
            const allottedLogEntity =  this.allocationLogRepo.create({
                available: req.revisedAvailable,
                employeeId: allottedExists.employeeId,
                year: allottedExists.year,
                companyCode: req.companyCode,
                createdUser: req.createdUser,
                leaveTypeId: allottedExists.leaveTypeId,
                leavesAllotted: allottedExists.leavesAllotted,
                leaveAllocation: allottedExists,
                leavesUsed: allottedExists.leavesUsed
            });
    
            await this.allocationLogRepo.save(allottedLogEntity);
    
            await transactionManager.completeTransaction();
    
            return new CommonResponseModel(true, 1, 'Leave adjustment created successfully', savedAdjustment);
    
        } catch (err) {
            await transactionManager.releaseTransaction();
            console.error('Error creating leave adjustment:', err);
            if (err instanceof QueryFailedError) {
                return new CommonResponseModel(false, 0, 'Database error occurred', null);
            }
            return new CommonResponseModel(false, 0, 'An unexpected error occurred while creating leave adjustment', null);
        }
    }

    async allocateLeaveExcel(req: any): Promise<CommonResponseModel> {
        try {
            const allocationData = [];
        
            for (const leaveData of req) {
                console.log(leaveData, 'leaveData');
                const employeeCode = leaveData['Employee Code'];
                const leaveTypes = Object.keys(leaveData).filter(
                    (key) => key !== 'Employee Code',
                );
    
                const employee = await this.allocationRepo.getEmpDataForExcels(employeeCode);
    
                if (!employee) {
                    throw new Error(`Employee with code ${employeeCode} not found`);
                }
    
                const leaveTypeEntities = await this.allocationRepo.getLeaveTypeForExcels(leaveTypes);
    
                for (const leaveTypeEntity of leaveTypeEntities) {
                    const leaveType = leaveTypeEntity.leaveType;
                    const leaveTypeId = leaveTypeEntity.leaveTypeId;
                    const allottedLeaves = parseInt(leaveData[leaveType], 10);
    
                    if (!isNaN(allottedLeaves)) {
                        allocationData.push({
                            employeeId: employee[0].empId,
                            leaveTypeId: leaveTypeId,
                            leavesAllotted: allottedLeaves,
                            available: allottedLeaves
                        });
                    }
                }
            }
            
            const saveData = await this.allocateLeave(allocationData)

            if(saveData.status){
                return new CommonResponseModel(true, 1, 'Leave data processed successfully');
            }
    
        } catch (err) {
            console.error('Error processing leave allocation:', err);
            throw err;
        }
    }

    async getLeaveAllocationMonthlyLogsData(req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            const empData = await this.leaveAllocationsMonthlyLogRepo.getEmpAllocationMonthlyLogs(req);
    
            if (empData.length === 0) {
                return new CommonResponseModel(false, 0, 'No Data Found', []);
            }
    
            const empIds = empData.map(emp => emp.empId);
            const leaveAllocations = await this.leaveAllocationsMonthlyLogRepo.getMultipleEmpLeaveAllocationsMonthlyLogs(empIds);
    
            const leaveDataMap = leaveAllocations.reduce((acc, leave) => {
                acc[leave.empId] = acc[leave.empId] || [];
                acc[leave.empId].push({
                    leaveAllocationId: leave.leaveAllocationId,
                    leaveTypeId: leave.leaveTypeId,
                    type: leave.leaveType,
                    total: leave.leavesAllotted,
                    used: leave.leavesUsed,
                    available: leave.available
                });
                return acc;
            }, {});
    
            const empWithLeaveData = empData.map(emp => ({
                id: emp.empId,
                departmentId: emp.deptId,
                designationId: emp.designId,
                name: emp.fullName,
                department: emp.department,
                designation: emp.designation,
                divisionId: emp.id,
                division: emp.divisionName,
                branchId: emp.id,
                branchName: emp.branchName,
                monthYear: emp.monthYear,
                year: emp.year,
                logType: emp.logType,
                leaveTypes: leaveDataMap[emp.empId] || []
            }));
    
            return new CommonResponseModel(true, 1, 'Data Retrieved successfully', empWithLeaveData);
        } catch (error) {
            throw error;
        }
    }
    


    //--------------new leave Allocations apply form services-----------------

    async getAllNewLeaveAllocationsLeaveTypes(req: EmpDataReq): Promise<CommonResponseModel> {
        console.log(req,"=================================")
        try {
            const data = await this.allocationRepo.getAllNewLeaveAllocationsLeaveTypes(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Leave Allocations Data Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'Leave Allocations No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }

    async updateNewLeaveAllocations(data: any): Promise<CommonResponseModel> {
        try {
            const updatedResult = await this.allocationRepo.updateNewLeaveAllocations(data)
            if (updatedResult) {
                return new CommonResponseModel(true, 1, "Manual Leave Applied SuccessFully")
            } else {
                throw new CommonResponseModel(false,0, "Failed While Applying Leave through Manual Creation")
            }
        } catch (err) {
            console.log(err);
        }
    }
    

}
