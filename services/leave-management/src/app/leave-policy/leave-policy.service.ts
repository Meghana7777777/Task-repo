import { CommonResponseModel } from '@hrexpert/backend-utils';
import { AccrualPeriodEnum, CriteriaEnum, LeavePolicyReq, TypeOfEntityEnum } from '@hrexpert/shared-models';
import { EmployeeOnboardingService } from '@hrexpert/shared-services';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { LeaveAllocations } from '../leave-allocation/entities/leave-allocation-entity';
import { LeaveAllocationsRepository } from '../leave-allocation/repos/leave-allocation-repository';
import { LeaveGroupEntity } from '../leave-group/dto/leave-group-entity';
import { DateMonthReq } from './dtos/date-month-req';
import { LeavePolicyDto } from './dtos/leave-policy-dto';
import { EntitlementEntity } from './entites/entitlement-entity';
import { LeavePolicyTypeEntity } from './entites/leave-policy-type-entity';
import { LeaveTypeApplicabilityEntity } from './entites/leave-type-applicability-entity';
import { LeaveTypeGroupMapping } from './entites/leave-type-group-mapping.entity';
import { EmpDataReq, MonthlyAllocationlogEnum } from '@hrexpert/shared-models';
import { LeaveAllocationsMonthlyLogRepository } from '../leave-allocation/repos/leave-allocations-monthly-logs-repo';
import { LeaveAllocationsMonthlyLogs } from '../leave-allocation/entities/leave-allocations-monthly-logs-entity';
import { EntitlementRepository } from './repos/entitlement-repo';
import { LeavePolicyRepository } from './repos/leave-policy-repo';
import { LeaveTypeApplicabilityRepository } from './repos/leave-type-applicability-repo';

@Injectable()
export class LeavePolicyService {
  private readonly logger = new Logger(LeavePolicyService.name);

  constructor(
    private readonly transactionManager: GenericTransactionManager,
    private readonly dataSource: DataSource,
    private readonly leavePolicyRepo: LeavePolicyRepository,
    private readonly leaveApplicabilityRepo: LeaveTypeApplicabilityRepository,
    @InjectRepository(LeaveTypeGroupMapping)
    private readonly leaveTypeGroupMappingRepo: Repository<LeaveTypeGroupMapping>,
    @InjectRepository(LeaveGroupEntity)
    private readonly leaveGroupRepo: Repository<LeaveGroupEntity>,
    private readonly empService: EmployeeOnboardingService,
    private readonly entitlementRepo: EntitlementRepository,
    private readonly leaveAllocationRepo: LeaveAllocationsRepository,
    private readonly leaveAllocationsMonthlyLogRepo: LeaveAllocationsMonthlyLogRepository
  ) { }

  async createLeavePolicy(payload: LeavePolicyDto): Promise<CommonResponseModel> {
    try {
      const existingPolicy = await this.leavePolicyRepo.findOne({ where: { leaveName: payload.leaveName }, });
      if (existingPolicy) {
        return new CommonResponseModel(false, 0, 'Leave Code already exists', null);
      }

      const leavePolicy = new LeavePolicyTypeEntity();

      leavePolicy.leaveCode = payload.leaveCode;
      leavePolicy.leaveName = payload.leaveName;
      leavePolicy.leaveType = payload.leaveType;
      leavePolicy.uom = payload.uom;
      leavePolicy.validFrom = payload.validFrom;
      leavePolicy.validTo = payload.validTo;
      leavePolicy.cutOffDate = payload.cutOffDate
      leavePolicy.creditType = payload.creditType
      leavePolicy.minLimit = payload.minLimit
      leavePolicy.maxLimit = payload.maxLimit

      leavePolicy.entitlements = [];
      for (const entitlement of payload.entitlements) {
        const entitlementEntity = new EntitlementEntity();
        entitlementEntity.effectiveFrom = entitlement.effectiveFrom;
        entitlementEntity.effectiveFromUom = entitlement.effectiveFromUom;
        entitlementEntity.effectiveFromCount = entitlement.effectiveFromCount;
        entitlementEntity.isProrate = entitlement.isProrate;
        entitlementEntity.accrualLeaves = entitlement.accrualLeaves;
        entitlementEntity.accrualPeriod = entitlement.accrualPeriod;
        entitlementEntity.accrualOn = entitlement.accrualOn;
        entitlementEntity.resetPeriod = entitlement.resetPeriod;
        entitlementEntity.resetOn = entitlement.resetOn;
        entitlementEntity.isCarryForward = entitlement.isCarryForward;
        entitlementEntity.carryForwardLimit = entitlement.carryForwardLimit;
        entitlementEntity.isEncashment = entitlement.isEncashment;
        entitlementEntity.encashmentLimit = entitlement.encashmentLimit;
        entitlementEntity.accrualOnDate = entitlement.accrualOnDate
        entitlementEntity.resetOnDate = entitlement.resetOnDate
        leavePolicy.entitlements.push(entitlementEntity);
      }

      const savedPolicy = await this.leavePolicyRepo.save(leavePolicy);
      return new CommonResponseModel(true, 1, 'Leave policy created successfully', savedPolicy);
    } catch (error) {
      return new CommonResponseModel(false, 0, 'Error creating leave policy', error.message);
    }
  }

  async getAllLeavePolicies(): Promise<CommonResponseModel> {
    try {
      const leavePolicies = await this.leavePolicyRepo.find({ relations: ['entitlements'], });

      if (!leavePolicies || leavePolicies.length === 0) {
        return new CommonResponseModel(false, 0, 'No leave policies found', []);
      }

      return new CommonResponseModel(true, 1, 'Leave policies fetched successfully', leavePolicies);
    } catch (error) {
      this.logger.error(`Error fetching leave policies: ${error.message}`, error.stack);
      return new CommonResponseModel(false, 0, 'Error fetching leave policies', error.message);
    }
  }

  async getleavePolicyDetailsById(req: LeavePolicyReq): Promise<CommonResponseModel> {
    try {
      const leavePolicyData = await this.leavePolicyRepo.getleavePolicyDetailsById(req.leavePolicyTypeId);
      if (leavePolicyData) {
        return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', leavePolicyData);
      } else {
        return new CommonResponseModel(false, 0, 'No leavePolicyData  Data Found', null);
      }
    } catch (error) {
      console.error('Error fetching leavePolicyData :', error);
      return new CommonResponseModel(false, -1, 'An error occurred while fetching leavePolicyData ', null);
    }
  }


  async getAllLeavePoliciesWithoutRelation(): Promise<CommonResponseModel> {
    try {
      const leavePolicies = await this.leavePolicyRepo.find();

      if (!leavePolicies || leavePolicies.length === 0) {
        return new CommonResponseModel(false, 0, 'No leave policies found', []);
      }

      return new CommonResponseModel(true, 1, 'Leave policies fetched successfully', leavePolicies);
    } catch (error) {
      this.logger.error(`Error fetching leave policies: ${error.message}`, error.stack);
      return new CommonResponseModel(false, 0, 'Error fetching leave policies', error.message);
    }
  }

  async mapTypeAndGroup(req: any): Promise<CommonResponseModel> {
    try {
      if (typeof req.leaveGroupIds !== 'object' || Object.keys(req.leaveGroupIds).length === 0) {
        return new CommonResponseModel(false, 0, 'leaveTypeIds must be a non-empty object');
      }

      const mappings: LeaveTypeGroupMapping[] = [];
      const warnings: string[] = [];
      const leaveGroupIds = Object.keys(req.leaveGroupIds);

      for (const leaveGroupId of leaveGroupIds) {
        const leaveTypeIds = req.leaveGroupIds[leaveGroupId];

        if (!Array.isArray(leaveTypeIds) || leaveTypeIds.length === 0) {
          return new CommonResponseModel(false, 0, `Leave Type IDs for Leave Group ${leaveGroupId} must be a non-empty array`);
        }

        const leaveGroup = await this.leaveGroupRepo.findOne({ where: { uuid: leaveGroupId } });
        if (!leaveGroup) {
          return new CommonResponseModel(false, 0, `Invalid Leave Group ID: ${leaveGroupId}`);
        }

        for (const leaveTypeId of leaveTypeIds) {
          const leaveType = await this.leavePolicyRepo.findOne({ where: { uuid: leaveTypeId } });
          if (!leaveType) {
            return new CommonResponseModel(false, 0, `Invalid Leave Type ID: ${leaveTypeId}`);
          }

          const existingMapping = await this.leaveTypeGroupMappingRepo.findOne({
            where: {
              leavePolicyType: { uuid: leaveTypeId },
              leaveGroupId: { uuid: leaveGroupId },
            },
          });

          if (existingMapping) {
            warnings.push(`Mapping already exists between ${leaveGroup.name} and ${leaveType.leaveName}`);
            continue;
          }

          const mapping = new LeaveTypeGroupMapping();
          mapping.leavePolicyType = leaveType;
          mapping.leaveGroupId = leaveGroup;
          mappings.push(mapping);
        }
      }

      if (mappings.length > 0) {
        await this.leaveTypeGroupMappingRepo.save(mappings);
      }

      return new CommonResponseModel(true, 1, 'Mappings created successfully', { createdMappings: mappings, warnings });
    } catch (error) {
      this.logger.error('Error creating Leave Type Group Mappings', error.stack);
      return new CommonResponseModel(false, 0, 'Error creating Leave Type Group Mappings', error.message);
    }
  }


  async getLeaveGroupData(): Promise<CommonResponseModel> {
    try {
      const data = await this.leaveGroupRepo.find();
      return data.length > 0
        ? new CommonResponseModel(true, 1, 'Data retrieved', data)
        : new CommonResponseModel(false, 0, 'No data found', []);
    } catch (err) {
      throw err;
    }
  }

  async createLeaveApplicability(data: any): Promise<CommonResponseModel> {
    try {
      if (!Array.isArray(data.leaveApplicability)) {
        throw new Error('Invalid data format: leaveApplicability should be an array.');
      }

      const applicabilityRecords = [];

      for (const item of data.leaveApplicability) {
        let entityType;

        if (item.typeOfEntity === TypeOfEntityEnum.LEAVE_TYPE) {
          entityType = await this.leavePolicyRepo.findOne({ where: { uuid: item.leaveTypeId } });
        } else {
          entityType = await this.leaveGroupRepo.findOne({ where: { uuid: item.leaveTypeId } });
        }

        if (!entityType) {
          throw new Error(`Leave type not found for UUID: ${item.leaveTypeId}`);
        }

        const references = Array.isArray(item.reference) ? item.reference : [item.reference];

        for (const ref of references) {
          const existingRecord = await this.leaveApplicabilityRepo.findOne({
            where: {
              typeOfEntity: item.typeOfEntity,
              criteria: item.criteria,
              criteriaReference: ref,
              referenceId: entityType.id,
            },
          });

          if (!existingRecord) {
            const record = new LeaveTypeApplicabilityEntity();
            record.typeOfEntity = item.typeOfEntity;
            record.criteria = item.criteria;
            record.criteriaReference = ref;
            record.referenceId = entityType.id;
            applicabilityRecords.push(record);
          }
        }
      }

      if (applicabilityRecords.length > 0) {
        await this.leaveApplicabilityRepo.save(applicabilityRecords);
      }

      if (applicabilityRecords.length > 0) {
        return new CommonResponseModel(true, 1, 'Leave applicability created successfully', applicabilityRecords);
      } else {
        return new CommonResponseModel(false, 0, 'No new records added (duplicates found)', []);
      }
    } catch (err) {
      console.error(err);
      return new CommonResponseModel(false, 0, 'Error occurred while creating leave applicability records');
    }
  }



  async getLeaveApplicabilityData(): Promise<CommonResponseModel> {
    try {
      const data =
        await this.leaveApplicabilityRepo.getLeaveTypeApplicability();
      if (data?.length > 0) {
        return new CommonResponseModel(true, 1, 'Data retrieved', data);
      } else {
        return new CommonResponseModel(false, 0, 'No Data found', []);
      }
    } catch (err) {
      throw err;
    }
  }

  async createLeaveGroup(req: any, isUpdate: boolean): Promise<CommonResponseModel> {
    try {
      const findDuplicate = await this.leaveGroupRepo.find({ where: { name: req.name } })
      if (findDuplicate.length > 0) {
        return new CommonResponseModel(false, 0, 'Leave Group Already Exists')
      }
      const entity = new LeaveGroupEntity();
      entity.name = req.name;
      entity.isActive = req.isActive;
      entity.versionFlag = req.versionFlag;
      if (isUpdate) {
        entity.id = req.id
        entity.updatedUser = req.updatedUser;
      } else {
        entity.createdUser = req.createdUser;
      }
      const save = await this.leaveGroupRepo.save(entity);
      if (save) {
        return new CommonResponseModel(true, 1, 'Created successfully', save);
      } else {
        return new CommonResponseModel(false, 0, 'Something went wrong in creation', []);
      }
    } catch (err) {
      throw err;
    }
  }

  async getLeaveTypeGroupMapping(): Promise<CommonResponseModel> {
    try {
      const data = await this.leavePolicyRepo.getLeaveTypeGroupMapping()
      if (data?.length > 0) {
        return new CommonResponseModel(true, 1, 'Data Retrieved', data)
      } else {
        return new CommonResponseModel(false, 0, 'No data', [])
      }
    } catch (err) {
      throw (err)
    }
  }

  async updateLeaveActivation(): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();

      const leaveRecords = await this.leavePolicyRepo.find();

      if (leaveRecords.length === 0) {
        return new CommonResponseModel(false, 0, 'No leave records found', []);
      }

      const updatedRecords = [];
      for (const leave of leaveRecords) {
        const validFrom = leave.validFrom ? new Date(leave.validFrom) : null;
        const validTo = leave.validTo ? new Date(leave.validTo) : null;

        if (validFrom) validFrom
        if (validTo) validTo

        if (validFrom && validFrom.getTime() === currentDate.getTime() && leave.isActive !== true) {
          leave.isActive = true;
          updatedRecords.push(leave);
        }

        if (validTo && validTo.getTime() < currentDate.getTime() && leave.isActive !== false) {
          leave.isActive = false;
          updatedRecords.push(leave);
        }
      }

      await this.leavePolicyRepo.save(updatedRecords);

      return new CommonResponseModel(true, 1, 'Leave records updated successfully', updatedRecords);
    } catch (err) {
      throw err;
    }
  }

  async activateOrDeactivateLeavePolicy(req: LeavePolicyDto): Promise<CommonResponseModel> {
    try {
      const exists = await this.leavePolicyRepo.findOne({ where: { id: req.id } });
      if (!exists) {
        throw new CommonResponseModel(false, 99998, 'No LeavePolicy found');
      }

      const update = await this.leavePolicyRepo.update(
        { id: req.id },
        { isActive: req.isActive, updatedUser: req.updatedUser }
      );

      if (exists.isActive && !req.isActive) {
        if (update.affected) {
          return new CommonResponseModel(true, 1, 'LeavePolicy deactivated successfully');
        } else {
          throw new CommonResponseModel(false, 0, 'LeavePolicy already deactivated');
        }
      } else if (!exists.isActive && req.isActive) {
        if (update.affected) {
          return new CommonResponseModel(true, 1, 'LeavePolicy activated successfully');
        } else {
          throw new CommonResponseModel(false, 0, 'LeavePolicy already activated');
        }
      } else {
        return new CommonResponseModel(false, 0, 'No changes were made');
      }
    } catch (err) {
      return err;
    }
  }

  async updateLeavePolicy(payload: LeavePolicyDto): Promise<CommonResponseModel> {
    try {
      // Check if the leave policy exists
      const existingPolicy = await this.leavePolicyRepo.findOne({
        where: { id: payload.id },
        relations: ['entitlements'], // Include entitlements for updating
      });
      // Update leave policy fields
      existingPolicy.leaveCode = payload.leaveCode;
      existingPolicy.leaveName = payload.leaveName;
      existingPolicy.leaveType = payload.leaveType;
      existingPolicy.uom = payload.uom;
      existingPolicy.validFrom = new Date(dayjs(payload.validFrom).format('YYYY-MM-DD'));
      existingPolicy.validTo = new Date(dayjs(payload.validTo).format('YYYY-MM-DD'));;
      existingPolicy.cutOffDate = payload.cutOffDate;
      existingPolicy.creditType = payload.creditType;
      existingPolicy.minLimit = payload.minLimit;
      existingPolicy.maxLimit = payload.maxLimit;

      // Handle entitlements
      existingPolicy.entitlements = [];
      for (const entitlement of payload.entitlements) {
        const entitlementEntity = new EntitlementEntity();
        entitlementEntity.effectiveFrom = entitlement.effectiveFrom;
        entitlementEntity.effectiveFromUom = entitlement.effectiveFromUom;
        entitlementEntity.effectiveFromCount = entitlement.effectiveFromCount;
        entitlementEntity.isProrate = entitlement.isProrate;
        entitlementEntity.accrualLeaves = entitlement.accrualLeaves;
        entitlementEntity.accrualPeriod = entitlement.accrualPeriod;
        entitlementEntity.accrualOn = entitlement.accrualOn;
        entitlementEntity.resetPeriod = entitlement.resetPeriod;
        entitlementEntity.resetOn = entitlement.resetOn;
        entitlementEntity.isCarryForward = entitlement.isCarryForward;
        entitlementEntity.carryForwardLimit = entitlement.carryForwardLimit;
        entitlementEntity.isEncashment = entitlement.isEncashment;
        entitlementEntity.encashmentLimit = entitlement.encashmentLimit;
        entitlementEntity.accrualOnDate = entitlement.accrualOnDate;
        entitlementEntity.resetOnDate = entitlement.resetOnDate;
        existingPolicy.entitlements.push(entitlementEntity);
      }

      // Save the updated leave policy
      const updatedPolicy = await this.leavePolicyRepo.save(existingPolicy);
      return new CommonResponseModel(true, 1, 'Leave policy updated successfully', updatedPolicy);
    } catch (error) {
      return new CommonResponseModel(false, 0, 'Error updating leave policy', error.message);
    }
  }

  @Cron('0 23 * * *')
  async allocateLeavesToEmp(req?: EmpDataReq): Promise<CommonResponseModel> {
    try {
      const response: CommonResponseModel = await this.empService.getEmpDataForLeaves(req);
      console.log('Employee data received:', response.data, response.data.length);

      if (response.status && Array.isArray(response.data)) {
        return this.processLeaveAllocation(response.data);
      }

      //throw new Error('Invalid employee data received from getEmpDataForLeaves.');
    } catch (err) {
      this.logger.error('Error in allocateLeavesToEmp:', err);
      return new CommonResponseModel(false, 0, 'Error in leave allocation', err.message);
    }
  }

  async processLeaveAllocation(employeeData: any[]): Promise<CommonResponseModel> {
    try {
      const currentYear = new Date().getFullYear();
      const allocations = [];

      console.log('Total employees to process:', employeeData.length);

      for (const employee of employeeData) {
        const leaveTypes = await this.getEligibleLeaveTypes(employee);
        console.log('Processing employee:', {
          id: employee.employeeId,
          empTypeId: employee.leaveGroupId
        });

        console.log('Eligible leave types for employee:',
          leaveTypes.map(lt => ({ id: lt.id, code: lt.leaveCode }))
        ); // Add this log


        const employeeAllocations = await Promise.all(
          leaveTypes.map(async (leaveType) => {
            console.log(leaveType, '-------000000--------')
            // const isApplicable = await this.checkApplicabilityCriteria(employee, leaveType.id);
            // console.log('Leave type applicability:', { 
            //   employeeId: employee.employeeId,
            //   leaveType: leaveType.leaveCode,
            //   isApplicable 
            // }); 
            if (1) {
              const entitlement = await this.calculateLeaveEntitlement(employee, leaveType, String(currentYear));
              console.log('Calculated entitlement:', {
                employeeId: employee.employeeId,
                leaveType: leaveType.leaveCode,
                entitlement
              }); // Add this log
              console.log(entitlement, '--------sakku--------')
              if (entitlement >= 0) {
                return this.createLeaveAllocation(
                  employee.employeeId,
                  leaveType.id,
                  entitlement,
                  String(currentYear)
                );
              }
            }

            return null;
          })
        );

        allocations.push(...employeeAllocations.filter((allocation) => allocation !== null));
        let req = { id: employee.employeeId }
        await this.empService.updateLeaveAllotted(req)
      }
      console.log('Final allocations:', allocations); // Add this log
      return new CommonResponseModel(true, 1, 'Leave allocation processed successfully', allocations);
    } catch (error) {
      this.logger.error('Error processing leave allocation:', error);
      return new CommonResponseModel(false, 0, 'Error processing leave allocation', error.message);
    }
  }

  private async getEligibleLeaveTypes(employee: any): Promise<LeavePolicyTypeEntity[]> {
    console.log(employee, '--------ffffff--------')
    const mappings = await this.leaveTypeGroupMappingRepo.find({
      where: { leaveGroupId: { id: employee.leaveGroupId } },
      relations: ['leavePolicyType'],
    });
    console.log(mappings, '--------mohan--------')
    return mappings.map((mapping) => mapping.leavePolicyType);
  }

  private async checkApplicabilityCriteria(employee: any, leaveTypeId: number): Promise<boolean> {
    const applicabilityCriteria = await this.leaveApplicabilityRepo.find({
      where: { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId },
    });

    if (!applicabilityCriteria.length) {
      return true;
    }

    return applicabilityCriteria.every((criteria) => {
      const empField = this.mapCriteriaToEmployeeField(criteria.criteria);
      if (criteria.criteriaReference === 'all') {
        return true;
      }
      return employee[empField]?.toString() === criteria.criteriaReference;
    });
  }

  private mapCriteriaToEmployeeField(criteria: string): string {
    const mapping: { [key: string]: string } = {
      GENDERS: 'gender',
      MARITAL_STATUS: 'maritalStatus',
      DEPARTMENTS: 'deptId',
      DESIGNATIONS: 'desId',
      BRANCHES: 'branchId',
      ROLES: 'role',
    };
    return mapping[criteria] || '';
  }

  private async calculateLeaveEntitlement(employee: any, leaveType: LeavePolicyTypeEntity, year: string): Promise<number> {
    console.log(employee, leaveType, year, '-------jjjjjjjjj-------')
    const entitlement = await this.entitlementRepo.findOne({
      where: {
        leavePolicyType: { id: leaveType.id },
        isActive: true
      },
      relations: ['leavePolicyType']
    });

    if (!entitlement) {
      return 0;
    }

    const currentDate = dayjs();
    const joiningDate = dayjs(employee.doj);

    // Check if employee has joined (is active)
    if (joiningDate.isBefore(currentDate) || joiningDate.isSame(currentDate, 'day')) {
      return entitlement.accrualLeaves;  // Return monthly entitlement (4.0 or 0.5)
    }

    return 0;
  }

  private async createLeaveAllocation(employeeId: number, leaveTypeId: number, leavesAllotted: number, year: string): Promise<LeaveAllocations> {
    const existingAllocation = await this.leaveAllocationRepo.findOne({ where: { employeeId, leaveTypeId, year }, });

    if (existingAllocation) {
      existingAllocation.leavesAllotted = leavesAllotted;
      existingAllocation.available = leavesAllotted - existingAllocation.leavesUsed;
      return this.leaveAllocationRepo.save(existingAllocation);
    }

    const newAllocation = new LeaveAllocations();
    newAllocation.employeeId = employeeId;
    newAllocation.leaveTypeId = leaveTypeId;
    newAllocation.leavesAllotted = leavesAllotted;
    newAllocation.leavesUsed = 0;
    newAllocation.available = leavesAllotted;
    newAllocation.year = year;
    console.log(newAllocation, '00000000000000')
    const save = await this.leaveAllocationRepo.save(newAllocation);

    const newLogAllocation = new LeaveAllocationsMonthlyLogs();
    newLogAllocation.employeeId = employeeId;
    newLogAllocation.leaveTypeId = leaveTypeId;
    newLogAllocation.leavesAllotted = leavesAllotted;
    newLogAllocation.leavesUsed = 0;
    newLogAllocation.available = leavesAllotted;
    newLogAllocation.year = year;
    newLogAllocation.monthYear = dayjs().format('MMYYYY')
    newLogAllocation.leaveAllocation = save
    console.log(newAllocation, '00000000000000')
    return this.leaveAllocationsMonthlyLogRepo.save(newAllocation);
  }


  async accrueLeaves(): Promise<CommonResponseModel> {
    try {
      this.logger.log("Starting leave accrual process...");

      const employees: CommonResponseModel = await this.empService.getEmpDataForLeaves();

      console.log(employees, '--------------------------------------')

      for (const employee of employees.data) {
        const { employeeId, leaveGroupId, doj, branchId, desId, depId, gender, maritalStatus, role, divId } = employee;

        if (!leaveGroupId) {
          this.logger.warn(`Employee ${employeeId} has no leave group assigned - skipping leave accrual`);
          continue;
        }

        this.logger.debug(`Processing employee ${employeeId} with leave group ${leaveGroupId}`);

        const entitlements = await this.entitlementRepo.find({
          where: { leavePolicyType: { leaveTypeGroup: { leaveGroupId } } },
          relations: ["leavePolicyType"],
        });

        if (!entitlements || entitlements.length === 0) {
          this.logger.warn(`No leave entitlements found for leave group ${leaveGroupId} - skipping employee ${employeeId}`);
          continue;
        }

        for (const entitlement of entitlements) {
          const { leavePolicyType, accrualLeaves, accrualPeriod, accrualOnDate, isProrate } = entitlement;

          const accruedLeave = parseFloat(accrualLeaves.toString());
          if (isNaN(accruedLeave)) {
            this.logger.error(`Invalid accrualLeaves value (${accrualLeaves}) for leave type ${leavePolicyType.leaveName}`);
            continue;
          }

          const isApplicable = await this.leaveApplicabilityRepo.findOne({
            where: this.buildApplicabilityWhereClause(leavePolicyType.id, gender, maritalStatus, depId, role, branchId, desId),
          });

          if (!isApplicable) {
            this.logger.warn(`Leave ${leavePolicyType.leaveName} is not applicable for employee ${employeeId}`);
            continue;
          }

          if (isProrate && !this.isEligibleForProratedLeave(doj, leavePolicyType.cutOffDate)) {
            this.logger.warn(`Employee ${employeeId} joined after cut-off date for ${leavePolicyType.leaveName} - skipping allocation`);
            continue;
          }

          const currentYear = new Date().getFullYear().toString();
          let leaveAllocation = await this.leaveAllocationRepo.findOne({
            where: {
              employeeId: employeeId,
              leaveTypeId: leavePolicyType.id,
              year: currentYear
            },
          });

          if (leaveAllocation) {
            const currentAllotted = parseFloat(leaveAllocation.leavesAllotted.toString());
            const currentAvailable = parseFloat(leaveAllocation.available.toString());

            if (isNaN(currentAllotted) || isNaN(currentAvailable)) {
              this.logger.error(`Invalid existing leave values for employee ${employeeId} - ${leavePolicyType.leaveName}`);
              continue;
            }

            leaveAllocation.leavesAllotted = currentAllotted + accruedLeave;
            leaveAllocation.available = currentAvailable + accruedLeave;
          } else {
            leaveAllocation = this.leaveAllocationRepo.create({
              employeeId: employeeId,
              leaveTypeId: leavePolicyType.id,
              year: currentYear,
              leavesAllotted: accruedLeave,
              leavesUsed: 0,
              available: accruedLeave,
            });
          }

          try {
            await this.leaveAllocationRepo.save(leaveAllocation);
            this.logger.log(`Accrued ${accruedLeave} leave(s) for Employee ${employeeId} under ${leavePolicyType.leaveName}`);

            await this.empService.updateLeaveAllotted({ id: employee.employeeId });
          } catch (saveError) {
            this.logger.error(`Failed to save allocation for employee ${employeeId}: ${saveError.message}`);
            continue;
          }
        }
      }

      this.logger.log("Leave accrual process completed successfully.");
      return new CommonResponseModel(true, 1, 'Leave accrual process completed');

    } catch (error) {
      this.logger.error("Critical error in leave accrual process", error.stack);
      throw new Error('Failed to complete leave accrual process');
    }
  }

  private buildApplicabilityWhereClause(
    leaveTypeId: number,
    gender: string,
    maritalStatus: string,
    departmentId: string,
    role: string,
    branchId: string,
    designationId: string
  ) {
    return [
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.GENDERS, criteriaReference: gender },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.GENDERS, criteriaReference: "all" },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.MARITAL_STATUS, criteriaReference: maritalStatus },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.MARITAL_STATUS, criteriaReference: "all" },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.DEPARTMENTS, criteriaReference: departmentId },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.DEPARTMENTS, criteriaReference: "all" },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.ROLES, criteriaReference: role },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.ROLES, criteriaReference: "all" },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.BRANCHES, criteriaReference: branchId },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.BRANCHES, criteriaReference: "all" },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.DESIGNATIONS, criteriaReference: designationId },
      { typeOfEntity: TypeOfEntityEnum.LEAVE_TYPE, referenceId: leaveTypeId, criteria: CriteriaEnum.DESIGNATIONS, criteriaReference: "all" },
    ];
  }

  private isEligibleForProratedLeave(doj: string, cutOffDate: number): boolean {
    const joinDate = new Date(doj);
    const currentDate = new Date();

    return (
      joinDate.getFullYear() < currentDate.getFullYear() ||
      (joinDate.getFullYear() === currentDate.getFullYear() &&
        joinDate.getDate() <= cutOffDate)
    );
  }

  @Cron('30 23 * * *') // runs every day at 11:30 PM
  async resetLeaves(req?: DateMonthReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentMonth = req.month ? req.month : currentDate.getMonth() + 1;
      const currentDay = req.date ? req.date : currentDate.getDate();

      this.logger.log(`Starting leave reset process for ${currentDay}/${currentMonth}`);

      const entitlementData = await this.entitlementRepo.getResetData(currentDay);

      if (!entitlementData || entitlementData.length === 0) {
        this.logger.warn(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
        throw new Error(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
      }

      let updatedRecords = [];

      for (const entitlement of entitlementData) {
        this.logger.debug(`Processing entitlement for LeaveType ID: ${entitlement.leaveTypeId}`);

        if (entitlement.resetPeriod === AccrualPeriodEnum.MONTHLY) {
          if (currentDay !== entitlement.resetOnDate) continue;
        } else {
          const resetMonths = entitlement.resetOn.split(',').map(Number);
          if (!(resetMonths.includes(currentMonth) && currentDay === entitlement.resetOnDate)) {
            continue;
          }
        }

        const updateResult = await this.leaveAllocationRepo.update(
          { leaveTypeId: entitlement.leaveTypeId },
          {
            leavesAllotted: 0.0,
            available: 0.0,
            // leavesAllotted: entitlement.accrualLeaves,
            // available: entitlement.accrualLeaves,
            leavesUsed: 0.0,
          },
        );

        if (updateResult.affected > 0) {
          this.logger.log(`LeaveType ID ${entitlement.leaveTypeId} reset successfully`);
          updatedRecords.push({
            leaveTypeId: entitlement.leaveTypeId,
            leaveType: entitlement.leaveType,
            updatedFields: {
              leavesAllotted: 0.0,
              available: 0.0,
              // leavesAllotted: entitlement.accrualLeaves,
              // available: entitlement.accrualLeaves,
              leavesUsed: 0.0,
            },
          });
        } else {
          this.logger.warn(`No records updated for LeaveType ID ${entitlement.leaveTypeId}`);
        }
      }

      this.logger.log(`Leave reset process completed. ${updatedRecords.length} records updated.`);

      return new CommonResponseModel(true, 1, 'Leaves reset successfully', updatedRecords);
    } catch (err) {
      this.logger.error('Error in leave reset process', err.stack);
      throw new Error(`Leave reset failed: ${err.message}`);
    }
  }

  @Cron('15 23 * * *') // runs every day at 11:15 PM 
  async accumulateLeaves(req?: DateMonthReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentMonth = req?.month ?? currentDate.getMonth() + 1;
      const currentDay = req?.date ?? currentDate.getDate();
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const currentYear = currentDate.getFullYear();
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const prevMonthYear = `${previousMonth.toString().padStart(2, '0')}${prevYear}`;
      const currentMonthYear = `${currentMonth.toString().padStart(2, '0')}${currentYear}`;

      this.logger.log(`Starting leave accrual process for ${currentDay}/${currentMonth}`);

      const entitlementData = await this.entitlementRepo.getAccrualData(currentDay);

      if (!entitlementData || entitlementData.length === 0) {
        this.logger.warn(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
        throw new Error(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
      }

      let updatedRecords = [];

      for (const entitlement of entitlementData) {
        this.logger.debug(`Processing entitlement for LeaveType ID: ${entitlement.leaveTypeId}`);

        if (entitlement.accrualPeriod === AccrualPeriodEnum.MONTHLY) {
          if (currentDay !== entitlement.accrualOnDate) continue;
        } else {
          const resetMonths = entitlement.accrualOn.split(',').map(Number);
          if (!(resetMonths.includes(currentMonth) && currentDay === entitlement.accrualOnDate)) {
            continue;
          }
        }

        // Update leave allocation
        await this.leaveAllocationRepo.update(
          { leaveTypeId: entitlement.leaveTypeId },
          {
            leavesAllotted: () => `leavesAllotted + ${entitlement.accrualLeaves}`,
            available: () => `available + ${entitlement.accrualLeaves}`,
          }
        );

        // Fetch all updated records
        const updatedLeaveAllocations = await this.leaveAllocationRepo.find({
          where: { leaveTypeId: entitlement.leaveTypeId },
        });

        if (!updatedLeaveAllocations.length) {
          throw new Error("No records found for the given leaveTypeId");
        }


        // Process logs for each record
        const savePromises = updatedLeaveAllocations.map(async (record) => {
          const preMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
            employeeId: record.employeeId,
            leaveTypeId: record.leaveTypeId,
            leavesAllotted: record.leavesAllotted - entitlement.accrualLeaves,
            available: record.available - entitlement.accrualLeaves,
            monthYear: prevMonthYear,
            leaveAllocation: record,
            logType: MonthlyAllocationlogEnum.CLOSING_BALANCE
          });
          await this.leaveAllocationsMonthlyLogRepo.save(preMonthNewRecord);

          const currMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
            employeeId: record.employeeId,
            leaveTypeId: record.leaveTypeId,
            leavesAllotted: record.leavesAllotted,
            leavesUsed: record.leavesUsed,
            available: record.available,
            monthYear: currentMonthYear,
            leaveAllocation: record,
            logType: MonthlyAllocationlogEnum.OPENING_BALANCE
          });
          return this.leaveAllocationsMonthlyLogRepo.save(currMonthNewRecord);

        });

        const saveResults = await Promise.all(savePromises);

        if (saveResults.some((res) => res !== null)) {
          this.logger.log(`LeaveType ID ${entitlement.leaveTypeId} accrual successfully`);
          updatedRecords.push({
            leaveTypeId: entitlement.leaveTypeId,
            leaveType: entitlement.leaveType,
            updatedFields: {
              leavesAllotted: `+${entitlement.accrualLeaves}`,
              available: `+${entitlement.accrualLeaves}`,
            },
          });
        } else {
          this.logger.warn(`No records updated for LeaveType ID ${entitlement.leaveTypeId}`);
        }
      }

      this.logger.log(`Leave accrual process completed. ${updatedRecords.length} records updated.`);

      return new CommonResponseModel(true, 1, 'Leaves accrued successfully', updatedRecords);
    } catch (err) {
      this.logger.error('Error in leave accrual process', err.stack);
      throw new Error(`Leave accrual failed: ${err.message}`);
    }
  }


  async getActiveLeaveType(): Promise<CommonResponseModel> {
    const data = await this.leavePolicyRepo.find({
      where: {
        isActive: true
      }
    });

    if (data.length > 0) {
      return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
    }
    return new CommonResponseModel(true, 1, 'No active getActiveLeaveType found', []);
  }



  async getLeaveCodeById(req: LeavePolicyDto): Promise<CommonResponseModel> {
    console.log(req, "req")
    const data = await this.leavePolicyRepo.find({
      where: {
        leaveCode: req.leaveCode
      }
    });

    if (data.length > 0) {
      return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
    }
    return new CommonResponseModel(true, 1, 'No active branches found', []);
  }

  async getAllTypesOfLeavesPolicy(): Promise<CommonResponseModel> {
    try {
      const allData = await this.leavePolicyRepo.getAllLeaveTypeRepo()
      return new CommonResponseModel(true, 1113, "get types of leaves Status Data Saved", allData)
    } catch (err) {
      throw err;
    }
  }


  async leavesAccumlating(req?: DateMonthReq): Promise<CommonResponseModel> {
    try {
      const currentDate = new Date();
      const currentMonth = req.month ? req.month : currentDate.getMonth() + 1;
      const currentDay = req.date ? req.date : currentDate.getDate();
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const currentYear = currentDate.getFullYear();
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const prevMonthYear = `${previousMonth.toString().padStart(2, '0')}${prevYear}`;
      const currentMonthYear = `${currentMonth.toString().padStart(2, '0')}${currentYear}`;

      this.logger.log(`Starting leave reset process for ${currentDay}/${currentMonth}`);

      const entitlementData = await this.entitlementRepo.getResetData(currentDay);

      if (!entitlementData || entitlementData.length === 0) {
        this.logger.warn(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
        throw new Error(`No entitlement data found for day ${currentDay} and month ${currentMonth}`);
      }

      let updatedRecords = [];

      for (const entitlement of entitlementData) {
        this.logger.debug(`Processing entitlement for LeaveType ID: ${entitlement.leaveTypeId}`);

        if (entitlement.resetPeriod === AccrualPeriodEnum.YEARLY) {
          if (currentDay !== entitlement.resetOnDate) {
            await this.monthlyAccumulateLeaves(req, entitlement)
            continue
          };
        } else {
          const resetMonths = entitlement.resetOn.split(',').map(Number);
          if (!(resetMonths.includes(currentMonth) && currentDay === entitlement.resetOnDate)) {
            await this.monthlyAccumulateLeaves(req, entitlement)
            continue;
          }
        }

        // Fetch all updated records
        const updatedLeaveAllocations = await this.leaveAllocationRepo.find({
          where: { leaveTypeId: entitlement.leaveTypeId },
        });

        if (!updatedLeaveAllocations.length) {
          throw new Error("No records found for the given leaveTypeId");
        }

        // Process logs for each record
        const savePromises = updatedLeaveAllocations.map(async (record) => {
          const preMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
            employeeId: record.employeeId,
            leaveTypeId: record.leaveTypeId,
            leavesAllotted: record.leavesAllotted,
            available: record.available,
            monthYear: prevMonthYear,
            leaveAllocation: record,
            logType: MonthlyAllocationlogEnum.CLOSING_BALANCE
          });
          await this.leaveAllocationsMonthlyLogRepo.save(preMonthNewRecord);

          const currMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
            employeeId: record.employeeId,
            leaveTypeId: record.leaveTypeId,
            leavesAllotted: 0.0,
            leavesUsed: 0.0,
            available: 0.0,
            monthYear: currentMonthYear,
            leaveAllocation: record,
            logType: MonthlyAllocationlogEnum.OPENING_BALANCE
          });
          return this.leaveAllocationsMonthlyLogRepo.save(currMonthNewRecord);

        });

        const saveResults = await Promise.all(savePromises);

        const updateResult = await this.leaveAllocationRepo.update(
          { leaveTypeId: entitlement.leaveTypeId },
          {
            leavesAllotted: 0.0,
            available: 0.0,
            leavesUsed: 0.0,
          },
        );

      }
      return new CommonResponseModel(true, 1, 'Leaves accumulate successfully');
    } catch (err) {
      this.logger.error('Error in leave reset process', err.stack);
      throw new Error(`Leave reset failed: ${err.message}`);
    }
  }

  async monthlyAccumulateLeaves(req: DateMonthReq, entitlement: any): Promise<CommonResponseModel> {
    const currentDate = new Date();
    const currentMonth = req?.month ?? currentDate.getMonth() + 1;
    const currentDay = req?.date ?? currentDate.getDate();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const currentYear = currentDate.getFullYear();
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const prevMonthYear = `${previousMonth.toString().padStart(2, '0')}${prevYear}`;
    const currentMonthYear = `${currentMonth.toString().padStart(2, '0')}${currentYear}`;

    let updatedRecords = [];

    if (entitlement.accrualPeriod === AccrualPeriodEnum.MONTHLY) {
      if (currentDay !== entitlement.accrualOnDate) {
        this.logger.log("Skipping accrual as today is not the scheduled date.");
        return new CommonResponseModel(true, 0, "Skipping accrual as today is not the scheduled date.", []);
      }
    } else {
      const resetMonths = entitlement.accrualOn.split(',').map(Number);
      if (!(resetMonths.includes(currentMonth) && currentDay === entitlement.accrualOnDate)) {
        this.logger.log("Skipping accrual as today is not within the scheduled accrual months.");
        return new CommonResponseModel(true, 0, "Skipping accrual as today is not within the scheduled accrual months.", []);
      }
    }

    // Update leave allocation
    await this.leaveAllocationRepo.update(
      { leaveTypeId: entitlement.leaveTypeId },
      {
        leavesAllotted: () => `leavesAllotted + ${entitlement.accrualLeaves}`,
        available: () => `available + ${entitlement.accrualLeaves}`,
      }
    );

    // Fetch all updated records
    const updatedLeaveAllocations = await this.leaveAllocationRepo.find({
      where: { leaveTypeId: entitlement.leaveTypeId },
    });

    if (!updatedLeaveAllocations.length) {
      this.logger.warn("No records found for the given leaveTypeId.");
      return new CommonResponseModel(false, 0, "No leave records found for update.", []);
    }

    // Process logs for each record
    const savePromises = updatedLeaveAllocations.map(async (record) => {
      const preMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
        employeeId: record.employeeId,
        leaveTypeId: record.leaveTypeId,
        leavesAllotted: record.leavesAllotted - entitlement.accrualLeaves,
        available: record.available - entitlement.accrualLeaves,
        monthYear: prevMonthYear,
        leaveAllocation: record,
        logType: MonthlyAllocationlogEnum.CLOSING_BALANCE
      });
      await this.leaveAllocationsMonthlyLogRepo.save(preMonthNewRecord);

      const currMonthNewRecord = this.leaveAllocationsMonthlyLogRepo.create({
        employeeId: record.employeeId,
        leaveTypeId: record.leaveTypeId,
        leavesAllotted: record.leavesAllotted,
        leavesUsed: record.leavesUsed,
        available: record.available,
        monthYear: currentMonthYear,
        leaveAllocation: record,
        logType: MonthlyAllocationlogEnum.OPENING_BALANCE
      });
      return this.leaveAllocationsMonthlyLogRepo.save(currMonthNewRecord);
    });

    const saveResults = await Promise.all(savePromises);

    if (saveResults.some((res) => res !== null)) {
      this.logger.log(`LeaveType ID ${entitlement.leaveTypeId} accrual successfully completed.`);
      updatedRecords.push({
        leaveTypeId: entitlement.leaveTypeId,
        leaveType: entitlement.leaveType,
        updatedFields: {
          leavesAllotted: `+${entitlement.accrualLeaves}`,
          available: `+${entitlement.accrualLeaves}`,
        },
      });
    } else {
      this.logger.warn(`No records updated for LeaveType ID ${entitlement.leaveTypeId}.`);
    }

    return new CommonResponseModel(true, 1, "Leaves accrued successfully", updatedRecords);
  }

  async updateLeavesAccumulation(req: any): Promise<CommonResponseModel> {
    for (const record of req.rows) {
      const existingAllocation = await this.leaveAllocationRepo.findOne({
        where: { id: record.leaveAllocationId },
      });

      if (existingAllocation) {
        await this.leaveAllocationRepo.update(record.leaveAllocationId, {
          leavesAllotted: record.total,
          leavesUsed: record.used,
          available: record.available,
        });
      }
    }

    return new CommonResponseModel(true, 1, "Leaves accrued successfully");
  }

}








