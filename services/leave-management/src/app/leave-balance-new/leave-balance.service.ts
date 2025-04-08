import { Injectable } from '@nestjs/common';
import { LeaveBalanceRepository } from './repos/leave-balance-repo';
import { MonthlyLeaveBalanceRepository } from './repos/monthly-leave-balance.repo';
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { EmpDataReq, LeavesAccumulationReq } from '@hrexpert/shared-models';
import { Cron } from '@nestjs/schedule';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { LeavePolicyTypeEntity } from '../leave-policy/entites/leave-policy-type-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveGroupMasterEntity } from '../leave-type-master/entities/leave-group-master.entity';
import { LeaveMasterEntity } from '../leave-type-master/entities/leave-master.entity';
import { LeaveBalance } from './entities/leaves-balance.entity';
import { MonthlyLeaveBalanceLogs } from './entities/monthly-leave-balance.entity';

@Injectable()
export class LeaveBalanceService {

  constructor(
    private leaveBalanceRepo: LeaveBalanceRepository,
    private monthlyLeaveBalanceRepo: MonthlyLeaveBalanceRepository,
    private readonly empService: EmployeeOnboardingService,
    @InjectRepository(LeaveGroupMasterEntity)
    private readonly leaveGroupMasterEntityRepo: Repository<LeaveGroupMasterEntity>,
    @InjectRepository(LeaveMasterEntity)
    private readonly leaveMasterEntityRepo: Repository<LeaveMasterEntity>,



  ) { }


  async getAllLeaveBalanceData(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const empData = await this.leaveBalanceRepo.getEmpAllocation(req);

      if (empData.length === 0) {
        return new CommonResponseModel(false, 0, 'No Data Found', []);
      }

      const empIds = empData.map(emp => emp.empId);
      const leaveAllocations = await this.leaveBalanceRepo.getMultipleEmpLeaveAllocations(empIds);

      const leaveDataMap = leaveAllocations.reduce((acc, leave) => {
        acc[leave.empId] = acc[leave.empId] || [];
        acc[leave.empId].push({
          leaveAllocationId: leave.leaveAllocationId,
          leaveTypeId: leave.leaveTypeId,
          type: leave.leaveTypeName,
          carryForward: leave.carryForward,
          monthAccumulation: leave.monthAccumulation,
          openingBalance: leave.openingBalance,
          utilized: leave.utilized,
          balance: leave.balance
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
        divisionId: emp.divisionId,
        division: emp.divisionName,
        branchId: emp.branchId,
        branchName: emp.branchName,
        leaveTypes: leaveDataMap[emp.empId] || [],
        employeeCode: emp.employeeCode,
        leaveGroupId: emp.leaveGroupId,
        leaveGroupName: emp.leaveGroupName,
        leaveGroupCode: emp.leaveGroupCode,
        employeeTypeId: emp.employeeTypeId,
        employeeTypeName: emp.employeeTypeName
      }));

      return new CommonResponseModel(true, 1, 'Data Retrieved successfully', empWithLeaveData);
    } catch (error) {
      throw error;
    }
  }


  async updateLeavesBalance(req: any): Promise<CommonResponseModel> {
    for (const record of req.rows) {
      const existingAllocation = await this.leaveBalanceRepo.findOne({
        where: { id: record.leaveAllocationId },
      });

      if (existingAllocation) {
        await this.leaveBalanceRepo.update(record.leaveAllocationId, {
          carryForward: record.carryForward,
          monthAccumulation: record.monthAccumulation,
          openingBalance: record.openingBalance,
          utilized: record.utilized,
          balance: record.balance
        });
        await this.monthlyLeaveBalanceRepo.update((record.leaveAllocationId, existingAllocation.monthYear), {
          carryForward: record.carryForward,
          monthAccumulation: record.monthAccumulation,
          openingBalance: record.openingBalance,
          utilized: record.utilized,
          balance: record.balance
        });
      }
    }

    return new CommonResponseModel(true, 1, "Leave balance updated successfully");
  }


  async leavesAccumlation(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const accrualCutoffDate = new Date(Date.UTC(currentYear, currentMonth, 20));
      const formattedMonthYear = req.monthYear || `${currentYear}${String(currentMonth + 1).padStart(2, '0')}`;

      const isNotAllocatedReq = { isAllocated: 0 }
      const isNotAllocatedResponse: CommonResponseModel = await this.leaveBalanceRepo.getLeaveBalanceNotAllocatedEmployees(isNotAllocatedReq);

      console.log('Employee data received:', isNotAllocatedResponse.data, isNotAllocatedResponse.data.length);

      if (isNotAllocatedResponse.status && Array.isArray(isNotAllocatedResponse.data)) {
        await this.processLeaveAllocation(isNotAllocatedResponse.data, req);
      }

      const isAllocatedReq = { isAllocated: 1 }
      const isAllocatedResponse: CommonResponseModel = await this.leaveBalanceRepo.getLeaveBalanceNotAllocatedEmployees(isAllocatedReq);

      console.log('Employee data received:', isAllocatedResponse.data, isAllocatedResponse.data.length);

      if (isAllocatedResponse.status && Array.isArray(isAllocatedResponse.data)) {
        await this.processleavesAccumlation(isAllocatedResponse.data, req);
      }

    } catch (err) {
      return new CommonResponseModel(false, 0, 'Error in leave accumlation', err.message);
    }
  }


  async processleavesAccumlation(employeeData: any[], req: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const formattedMonthYear = req.monthYear || `${currentYear}${String(currentMonth + 1).padStart(2, '0')}`;

      const year = parseInt(formattedMonthYear.substring(0, 4), 10);
      const month = parseInt(formattedMonthYear.substring(4, 6), 10) - 1;

      const referenceDate = new Date(year, month);
      const currentMonthName = referenceDate.toLocaleString('en-US', { month: 'long' });

      console.log('Total employees to process:', employeeData.length);

      for (const employee of employeeData) {

        const leaveMaters = await this.getEligibleLeaveTypes(employee);
        console.log('leaveMaters:', leaveMaters);

        if (leaveMaters.length > 0) {
          for (const leave of leaveMaters) {

            const existingAllocationForRequestedMonth = await this.leaveBalanceRepo.findOne({
              where: { employeeId: employee.employeeId, leaveTypeId: leave.leaveTypeId, monthYear: formattedMonthYear },
            });

            if (existingAllocationForRequestedMonth) continue;

            const existingAllocation = await this.leaveBalanceRepo.findOne({
              where: { employeeId: employee.employeeId, leaveTypeId: leave.leaveTypeId },
            });

            if (existingAllocation) {
              if (leave.collapse === 'Yearly') {
                if (leave.collapseMonth === currentMonthName) {

                  const leaveBalanceEntity = new LeaveBalance();
                  Object.assign(leaveBalanceEntity, {
                    employeeId: employee.employeeId,
                    employeeCode: employee.employeeCode,
                    leaveTypeId: leave.leaveTypeId,
                    monthYear: formattedMonthYear,
                    carryForward: 0,
                    monthAccumulation: leave.accumQty,
                    openingBalance: leave.accumQty,
                    utilized: 0,
                    utilizedNextMonth: 0,
                    balance: leave.accumQty
                  });

                  const savedLeaveBalance = await this.leaveBalanceRepo.save(leaveBalanceEntity);
                  if (!savedLeaveBalance) continue;

                  const monthlyLeaveLogEntity = new MonthlyLeaveBalanceLogs();
                  Object.assign(monthlyLeaveLogEntity, {
                    employeeId: employee.employeeId,
                    employeeCode: employee.employeeCode,
                    leaveTypeId: leave.leaveTypeId,
                    monthYear: formattedMonthYear,
                    carryForward: 0,
                    monthAccumulation: leave.accumQty,
                    openingBalance: leave.accumQty,
                    utilized: 0,
                    balance: leave.accumQty
                  });

                  await this.monthlyLeaveBalanceRepo.save(monthlyLeaveLogEntity);


                } else {
                  if (leave.accumPeriod === 'Yearly') {
                    if (leave.collapseMonth === currentMonthName) {
                      await this.leaveBalanceRepo.update(
                        { leaveTypeId: leave.leaveTypeId },
                        {
                          carryForward: existingAllocation.balance,
                          monthAccumulation: leave.accumQty,
                          openingBalance: Number(existingAllocation.balance) + Number(leave.accumQty),
                          utilized: 0 + Number(existingAllocation.utilizedNextMonth),
                          utilizedNextMonth: 0,
                          balance: (Number(existingAllocation.balance) + Number(leave.accumQty)) - Number(existingAllocation.utilizedNextMonth),
                          monthYear: formattedMonthYear
                        }
                      );

                      await this.leaveBalanceRepo.update(
                        { leaveTypeId: leave.leaveTypeId },
                        {
                          carryForward: existingAllocation.balance,
                          monthAccumulation: leave.accumQty,
                          openingBalance: Number(existingAllocation.balance) + Number(leave.accumQty),
                          utilized: 0 + Number(existingAllocation.utilizedNextMonth),
                          utilizedNextMonth: 0,
                          balance: (Number(existingAllocation.balance) + Number(leave.accumQty)) - Number(existingAllocation.utilizedNextMonth),
                          monthYear: formattedMonthYear
                        }
                      );

                      const monthlyLeaveLogEntity = new MonthlyLeaveBalanceLogs();
                      Object.assign(monthlyLeaveLogEntity, {
                        employeeId: employee.employeeId,
                        employeeCode: employee.employeeCode,
                        leaveTypeId: leave.leaveTypeId,
                        monthYear: formattedMonthYear,
                        carryForward: existingAllocation.balance,
                        monthAccumulation: leave.accumQty,
                        openingBalance: Number(existingAllocation.balance) + Number(leave.accumQty),
                        utilized: 0 + Number(existingAllocation.utilizedNextMonth),
                        balance: (Number(existingAllocation.balance) + Number(leave.accumQty)) - Number(existingAllocation.utilizedNextMonth),
                      });

                      await this.monthlyLeaveBalanceRepo.save(monthlyLeaveLogEntity);
                    }
                  } else if (leave.accumPeriod === 'Monthly') {

                  } else if (leave.accumPeriod === 'Daily') {

                  }
                }
              } else if (leave.collapse === 'Monthly') {


              } else if (leave.collapse === 'Quarterly') {
                if (leave.collapseMonth) {
                  const collapseStartMonth = new Date(`${leave.collapseMonth} 1, ${year}`).getMonth() + 1;
                  const processingMonth = parseInt(formattedMonthYear.substring(4, 6), 10);
                  const quarterMonths = [collapseStartMonth, collapseStartMonth + 1, collapseStartMonth + 2];

                  if (quarterMonths.includes(processingMonth)) {
                    console.log(`Processing Quarterly allocation for ${leave.collapseMonth} - Covering months: ${quarterMonths}`);
                    // Add logic to accumulate leave here...
                  } else {
                    if (leave.accumPeriod === 'Yearly') {
                      if (leave.collapseMonth === currentMonthName) {

                      }
                    } else if (leave.accumPeriod === 'Monthly') {

                    } else if (leave.accumPeriod === 'Daily') {

                    }
                  }
                }
              }
            }

          }
        }

      }

      console.log('Final allocations processed successfully');
      return new CommonResponseModel(true, 1, 'Leave allocation processed successfully');
    } catch (error) {
      console.error('Error processing leave allocation:', error);
      return new CommonResponseModel(false, 0, 'Error processing leave allocation', error.message);
    }
  }



  // @Cron('0 23 * * *')
  async allocateLeavesToEmp(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {
      req.isAllocated = 0
      const response: CommonResponseModel = await this.leaveBalanceRepo.getLeaveBalanceNotAllocatedEmployees(req);
      console.log('Employee data received:', response.data, response.data.length);

      if (response.status && Array.isArray(response.data)) {
        return this.processLeaveAllocation(response.data, req);
      }

    } catch (err) {
      return new CommonResponseModel(false, 0, 'Error in leave allocation', err.message);
    }
  }

  async processLeaveAllocation(employeeData: any[], req: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const accrualCutoffDate = new Date(Date.UTC(currentYear, currentMonth, 20));
      const formattedMonthYear = req.monthYear || `${currentYear}${String(currentMonth + 1).padStart(2, '0')}`;

      console.log('Total employees to process:', employeeData.length);

      for (const employee of employeeData) {
        if (!employee.doj) continue;

        const dateOfJoining = new Date(employee.doj);
        if (dateOfJoining >= accrualCutoffDate) {
          console.log("Not eligible for accruals");
          continue;
        }

        console.log("Eligible for accruals");
        const leaveMaters = await this.getEligibleLeaveTypes(employee);
        console.log('leaveMaters:', leaveMaters);

        if (leaveMaters.length > 0) {
          for (const leave of leaveMaters) {

            const existingAllocation = await this.leaveBalanceRepo.findOne({
              where: { employeeId: employee.employeeId, leaveTypeId: leave.leaveTypeId },
            });

            if (existingAllocation) continue;

            const leaveBalanceEntity = new LeaveBalance();
            Object.assign(leaveBalanceEntity, {
              employeeId: employee.employeeId,
              employeeCode: employee.employeeCode,
              leaveTypeId: leave.leaveTypeId,
              monthYear: formattedMonthYear,
              carryForward: 0,
              monthAccumulation: leave.accumQty,
              openingBalance: leave.accumQty,
              utilized: 0,
              utilizedNextMonth: 0,
              balance: leave.accumQty
            });

            const savedLeaveBalance = await this.leaveBalanceRepo.save(leaveBalanceEntity);
            if (!savedLeaveBalance) continue;

            const monthlyLeaveLogEntity = new MonthlyLeaveBalanceLogs();
            Object.assign(monthlyLeaveLogEntity, {
              employeeId: employee.employeeId,
              employeeCode: employee.employeeCode,
              leaveTypeId: leave.leaveTypeId,
              monthYear: formattedMonthYear,
              carryForward: 0,
              monthAccumulation: leave.accumQty,
              openingBalance: leave.accumQty,
              utilized: 0,
              balance: leave.accumQty
            });

            await this.monthlyLeaveBalanceRepo.save(monthlyLeaveLogEntity);
            await this.leaveBalanceRepo.updatedEmployeesAllocatedtrue({ employeeId: employee.employeeId })
          }
        }
      }

      console.log('Final allocations processed successfully');
      return new CommonResponseModel(true, 1, 'Leave allocation processed successfully');
    } catch (error) {
      console.error('Error processing leave allocation:', error);
      return new CommonResponseModel(false, 0, 'Error processing leave allocation', error.message);
    }
  }

  private async getEligibleLeaveTypes(employee: any): Promise<LeaveMasterEntity[]> {
    const leaveMasters = await this.leaveMasterEntityRepo.find({ where: { leaveGroupId: employee.leaveGroupId } });
    return leaveMasters
  }


  async getAllLeaveBalance(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {

      const response = await this.leaveBalanceRepo.getAllLeaveBalance(req);


      return new CommonResponseModel(true, 1, 'Data Retrieved successfully', response);
    } catch (error) {
      throw error;
    }
  }

  async getAllLeaveBalanceAllocations(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {

      const response = await this.leaveBalanceRepo.getAllLeaveBalanceAllocations(req);


      return new CommonResponseModel(true, 1, 'Data Retrieved successfully', response);
    } catch (error) {
      throw error;
    }
  }

  async getAllLeaveBalanceAllocationsAllMonths(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const response = await this.leaveBalanceRepo.getAllLeaveBalanceAllocationsAllMonths(req);
      return new CommonResponseModel(true, 1, 'Data Retrieved successfully', response);
    } catch (error) {
      throw error;
    }
  }


}
