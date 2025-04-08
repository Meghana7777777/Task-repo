import { LeavePolicyService } from "@hrexpert/shared-services";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, In, Repository } from "typeorm";
import { LeaveTypeMasterEntity } from "./entities/leave-type.entity";
import { CommonResponseModel } from "@hrexpert/backend-utils";
import { LeaveGroupMasterEntity } from "./entities/leave-group-master.entity";
import { LeaveMasterEntity } from "./entities/leave-master.entity";
import { ConfigService } from "@nestjs/config";
import { LeaveCodeDefineEntity } from "./entities/leave-code-define.entity";
import { LeaveGeneratedCodeEntity } from "./entities/leave-generated-code.entiy";
import { LeaveGroupCodeMappingEntity } from "./entities/leave-group-code-map.entity";
import { Employee } from "services/employee-management/src/app/employee-onboarding/entities/employee-details.entity";
import { LeaveBalance } from "../leave-balance-new/entities/leaves-balance.entity";
import { NewLeaveAllocationsEntity } from "./entities/new-leave-allocations-entity";
import dayjs from "dayjs";
import { retry } from "rxjs";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class LeaveTypeService {
    private readonly logger = new Logger(LeavePolicyService.name);
    private readonly dbNames: any
    constructor(
        @InjectRepository(LeaveTypeMasterEntity)
        private readonly leaveTypeEntityRepo: Repository<LeaveTypeMasterEntity>,
        @InjectRepository(LeaveGroupMasterEntity)
        private readonly leaveGroupEntityRepo: Repository<LeaveGroupMasterEntity>,
        @InjectRepository(LeaveMasterEntity)
        private readonly leaveEntityRepo: Repository<LeaveMasterEntity>,
        private readonly configService: ConfigService,
        @InjectRepository(LeaveCodeDefineEntity)
        private readonly leaveCodeDefineEntityRepo: Repository<LeaveCodeDefineEntity>,
        @InjectRepository(LeaveGeneratedCodeEntity)
        private readonly leaveGeneratedCodeEntityRepo: Repository<LeaveGeneratedCodeEntity>,
        @InjectRepository(LeaveGroupCodeMappingEntity)
        private readonly leaveGroupCodeMappingEntityRepo: Repository<LeaveGroupCodeMappingEntity>,
        @InjectRepository(Employee)
        private readonly employeeRepo: Repository<Employee>,
        @InjectRepository(LeaveBalance)
        private readonly leaveBalanceRepo: Repository<LeaveBalance>,
        @InjectRepository(NewLeaveAllocationsEntity)
        private readonly newLeaveAllocationRepo: Repository<NewLeaveAllocationsEntity>
    ) {
        this.dbNames = this.configService.get('dbNames');
    }

    async createLeaveType(payload: any): Promise<CommonResponseModel> {
        const entity = new LeaveTypeMasterEntity();
        entity.leaveTypeName = payload.leaveTypeName;
        entity.leaveTypeCode = payload.leaveTypeCode;
        if (payload.leaveTypeId) {
            entity.leaveTypeId = payload.leaveTypeId;
        }
        const result = await this.leaveTypeEntityRepo.save(entity);
        if (result) return new CommonResponseModel(true, 1, 'Leave Type created successfully');
        return new CommonResponseModel(false, 0, 'Failed to create Leave Type');
    }

    async getAllLeaveType(): Promise<CommonResponseModel> {
        const result = await this.leaveTypeEntityRepo.find();
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Type fetched successfully', result);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave Type');
    }

    async activateOrDeactivateLeaveType(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.leaveTypeEntityRepo.findOne({ where: { leaveTypeId: req.leaveTypeId } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Leave Type found');
            }
            const update = await this.leaveTypeEntityRepo.update(
                { leaveTypeId: req.leaveTypeId },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Type deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Type already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Type activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Type already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActiveLeaveType(): Promise<CommonResponseModel> {
        const result = await this.leaveTypeEntityRepo.find({ where: { isActive: true } });
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Leave Type fetched successfully', result);
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found');
        }
    }

    // ----------------------Leave Group----------------------

    async createLeaveGroup(payload: any): Promise<CommonResponseModel> {
        const entity = new LeaveGroupMasterEntity();
        entity.leaveGroupName = payload.leaveGroupName;
        entity.leaveGroupDesc = payload.leaveGroupDesc;
        if (payload.leaveGroupId) {
            entity.leaveGroupId = payload.leaveGroupId;
        }
        const result = await this.leaveGroupEntityRepo.save(entity);
        if (result) return new CommonResponseModel(true, 1, 'Leave Group created successfully');
        return new CommonResponseModel(false, 0, 'Failed to create Leave Group');
    }

    async getAllLeaveGroup(): Promise<CommonResponseModel> {
        const result = await this.leaveGroupEntityRepo.find();
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Group fetched successfully', result);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave Group');
    }

    async activateOrDeactivateLeaveGroup(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.leaveGroupEntityRepo.findOne({ where: { leaveGroupId: req.leaveGroupId } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Leave Group found');
            }
            const update = await this.leaveGroupEntityRepo.update(
                { leaveGroupId: req.leaveGroupId },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Group deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Group already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Group activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Group already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActiveLeaveGroup(): Promise<CommonResponseModel> {
        console.log('getAllActiveLeaveGroup------------------')
        const result = await this.leaveGroupEntityRepo.find({ where: { isActive: true } });
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Group fetched successfully', result);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave Type');
    }

    // ----------------------Leave Master----------------------

    async createLeaveOld(payload: any): Promise<CommonResponseModel> {
        const entity = new LeaveMasterEntity();
        entity.leaveGroupId = payload.leaveGroupId;
        entity.leaveTypeId = payload.leaveTypeId;
        entity.accumQty = payload.accumQty;
        entity.accumPeriod = payload.accumPeriod;
        entity.collapse = payload.collapse;
        entity.collapseMonth = payload.collapseMonth;
        entity.encashLimit = payload.encashLimit;
        if (payload.leaveId) {
            entity.leaveId = payload.leaveId;
        }
        const result = await this.leaveEntityRepo.save(entity);
        if (result) return new CommonResponseModel(true, 1, 'Leave created successfully');
        return new CommonResponseModel(false, 0, 'Failed to create Leave Group');
    }

    // async createLeave(payload: any): Promise<CommonResponseModel> {
    //     const entity = new LeaveMasterEntity();
    //     entity.leaveGroupId = payload.leaveGroupId;
    //     entity.leaveTypeId = payload.leaveTypeId;
    //     entity.accumQty = payload.accumQty;
    //     entity.accumPeriod = payload.accumPeriod;
    //     entity.collapse = payload.collapse;
    //     entity.collapseMonth = payload.collapseMonth;
    //     entity.encashLimit = payload.encashLimit;
    //     if (payload.leaveId) {
    //         entity.leaveId = payload.leaveId;
    //     }

    //     console.log(entity,'-----------entity&&&&&&&&&&&&&')

    //     // Fetch leave type code from master based on leaveTypeId
    //     const leaveType = await this.leaveTypeEntityRepo.findOne({ where: { leaveTypeId: payload.leaveTypeId } });
    //     if (!leaveType) {
    //         return new CommonResponseModel(false, 0, 'Invalid Leave Type ID');
    //     }
    //     const leaveTypeCode = leaveType.leaveTypeCode;

    //     // Fetch existing leave group record from master based on leaveGroupId
    //     const leaveGroup = await this.leaveGroupEntityRepo.findOne({ where: { leaveGroupId: payload.leaveGroupId } });
    //     if (!leaveGroup) {
    //         return new CommonResponseModel(false, 0, 'Invalid Leave Group ID');
    //     }

    //     let existingCode = leaveGroup.leaveGroupCode || '';
    //     const newCodeSegment = `${leaveTypeCode}-${payload.accumQty}`;
    //     console.log(newCodeSegment,'---------newCodeSegment-------')
    //     // Check if the new code segment already exists
    //     const codeSegments = existingCode.split('/');
    //     if (!codeSegments.includes(newCodeSegment)) {
    //         existingCode = existingCode ? `${existingCode}/${newCodeSegment}` : newCodeSegment;
    //     }

    //     console.log('existingCode', existingCode);
    //     // Update leave group master with new code
    //    const update=  await this.leaveGroupEntityRepo.update(payload.leaveGroupId, { leaveGroupCode: existingCode });
    //    console.log(update,'-----------upadte in leave group')

    //     // Save the leave entity
    //     const result = await this.leaveEntityRepo.save(entity);
    //     if (result) return new CommonResponseModel(true, 1, 'Leave created successfully');
    //     return new CommonResponseModel(false, 0, 'Failed to create Leave Group');
    // }

    // async createLeave(payload: any): Promise<CommonResponseModel> {
    //     const entity = new LeaveMasterEntity();
    //     entity.leaveGroupId = payload.leaveGroupId;
    //     entity.leaveTypeId = payload.leaveTypeId;
    //     entity.accumQty = payload.accumQty;
    //     entity.accumPeriod = payload.accumPeriod;
    //     entity.collapse = payload.collapse;
    //     entity.collapseMonth = payload.collapseMonth;
    //     entity.encashLimit = payload.encashLimit;
    //     if (payload.leaveId) {
    //         entity.leaveId = payload.leaveId;
    //     }

    //     console.log(entity,'-----------entity&&&&&&&&&&&&&')

    //     // Check if the same leaveTypeId exists for the same leaveGroupId
    //     const existingLeave = await this.leaveEntityRepo.findOne({ 
    //         where: { leaveGroupId: payload.leaveGroupId, leaveTypeId: payload.leaveTypeId } 
    //     });
    //     if (existingLeave) {
    //         return new CommonResponseModel(false, 0, 'Leave Type already exists in this Leave Group');
    //     }

    //     // Fetch leave type code from master based on leaveTypeId
    //     const leaveType = await this.leaveTypeEntityRepo.findOne({ where: { leaveTypeId: payload.leaveTypeId } });
    //     if (!leaveType) {
    //         return new CommonResponseModel(false, 0, 'Invalid Leave Type ID');
    //     }
    //     const leaveTypeCode = leaveType.leaveTypeCode;

    //     // Fetch existing leave group record from master based on leaveGroupId
    //     const leaveGroup = await this.leaveGroupEntityRepo.findOne({ where: { leaveGroupId: payload.leaveGroupId } });
    //     if (!leaveGroup) {
    //         return new CommonResponseModel(false, 0, 'Invalid Leave Group ID');
    //     }

    //     let existingCode = leaveGroup.leaveGroupCode || '';
    //     const newCodeSegment = `${leaveTypeCode}-${payload.accumQty}`;
    //     console.log(newCodeSegment,'---------newCodeSegment-------')
    //     // Check if the new code segment already exists
    //     const codeSegments = existingCode.split('/');
    //     if (!codeSegments.includes(newCodeSegment)) {
    //         existingCode = existingCode ? `${existingCode}/${newCodeSegment}` : newCodeSegment;
    //     }

    //     console.log('existingCode', existingCode);
    //     // Update leave group master with new code
    //    const update=  await this.leaveGroupEntityRepo.update(payload.leaveGroupId, { leaveGroupCode: existingCode });
    //    console.log(update,'-----------upadte in leave group')

    //     // Save the leave entity
    //     const result = await this.leaveEntityRepo.save(entity);
    //     if (result) return new CommonResponseModel(true, 1, 'Leave created successfully');
    //     return new CommonResponseModel(false, 0, 'Failed to create Leave Group');
    // }


    async createLeave(payload: any): Promise<CommonResponseModel> {
        const entity = new LeaveMasterEntity();
        entity.leaveGroupId = payload.leaveGroupId;
        entity.leaveTypeId = payload.leaveTypeId;
        entity.accumQty = payload.accumQty;
        entity.accumPeriod = payload.accumPeriod;
        entity.collapse = payload.collapse;
        entity.collapseMonth = payload.collapseMonth;
        entity.encashLimit = payload.encashLimit;
        if (payload.leaveId) {
            entity.leaveId = payload.leaveId;
        }

        // Fetch leave type code from master based on leaveTypeId
        const leaveType = await this.leaveTypeEntityRepo.findOne({ where: { leaveTypeId: payload.leaveTypeId } });
        if (!leaveType) {
            return new CommonResponseModel(false, 0, 'Invalid Leave Type ID');
        }
        const leaveTypeCode = leaveType.leaveTypeCode;

        // Check if the same leaveTypeId exists for the same leaveGroupId
        const existingLeave = await this.leaveEntityRepo.findOne({
            where: { leaveGroupId: payload.leaveGroupId, leaveTypeId: payload.leaveTypeId }
        });
        if (existingLeave) {
            // If accumQty is different, update only the accumQty in leaveGroupCode and leaveMasterEntity
            if (existingLeave.accumQty !== payload.accumQty) {
                existingLeave.accumQty = payload.accumQty;
                await this.leaveEntityRepo.save(existingLeave);

                const leaveGroup = await this.leaveGroupEntityRepo.findOne({ where: { leaveGroupId: payload.leaveGroupId } });
                if (leaveGroup) {
                    let existingCode = leaveGroup.leaveGroupCode || '';
                    const codeSegments = existingCode.split('/');
                    const updatedSegments = codeSegments.map(segment => {
                        if (segment.startsWith(leaveTypeCode + '-')) {
                            return `${leaveTypeCode}-${payload.accumQty}`;
                        }
                        return segment;
                    });
                    const updatedCode = updatedSegments.join('/');

                    await this.leaveGroupEntityRepo.update(payload.leaveGroupId, { leaveGroupCode: updatedCode });
                    return new CommonResponseModel(true, 1, 'Accumulated Quantity updated successfully in Leave Group Code and Leave Master');
                }
            }
            return new CommonResponseModel(false, 0, 'Leave Type already exists in this Leave Group with the same Accumulated Quantity');
        }

        // Fetch existing leave group record from master based on leaveGroupId
        const leaveGroup = await this.leaveGroupEntityRepo.findOne({ where: { leaveGroupId: payload.leaveGroupId } });
        if (!leaveGroup) {
            return new CommonResponseModel(false, 0, 'Invalid Leave Group ID');
        }

        let existingCode = leaveGroup.leaveGroupCode || '';
        const newCodeSegment = `${leaveTypeCode}-${payload.accumQty}`;
        // Check if the new code segment already exists
        const codeSegments = existingCode.split('/');
        if (!codeSegments.includes(newCodeSegment)) {
            existingCode = existingCode ? `${existingCode}/${newCodeSegment}` : newCodeSegment;
        }

        // Update leave group master with new code
        await this.leaveGroupEntityRepo.update(payload.leaveGroupId, { leaveGroupCode: existingCode });

        // Save the leave entity
        const result = await this.leaveEntityRepo.save(entity);
        if (result) return new CommonResponseModel(true, 1, 'Leave created successfully');
        return new CommonResponseModel(false, 0, 'Failed to create Leave Group');
    }


    async getAllLeave(): Promise<CommonResponseModel> {
        const query = `Select lm.leave_group_id as leaveGroupId, lg.leave_group_name as leaveGroupName, lm.leave_type_id as leaveTypeId, lt.leave_type_name as leaveTypeName, lm.accum_qty as accumQty, lm.accum_period as accumPeriod, lm.collapse, lm.collapse_month as collapseMonth, lm.encash_limit as encashLimit, lm.is_active as isActive, lm.created_at as createdAt, lm.created_user as createdUser, lm.updated_at as updatedAt, lm.updated_user as updatedUser from ${this.dbNames.lms}.leave_master lm 
        left join ${this.dbNames.lms}.leave_group_master lg on lm.leave_group_id = lg.leave_group_id
        left join ${this.dbNames.lms}.leave_type_master lt on lm.leave_type_id = lt.leave_type_id`;
        const result = await this.leaveEntityRepo.query(query);
        // if (result.length) return new CommonResponseModel(true, 1, 'Leave fetched successfully', result);
        // const result = await this.leaveEntityRepo.find();
        if (result.length) return new CommonResponseModel(true, 1, 'Leave  fetched successfully', result);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave ');
    }

    async activateOrDeactivateLeave(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.leaveEntityRepo.findOne({ where: { leaveId: req.leaveId } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Leave  found');
            }
            const update = await this.leaveEntityRepo.update(
                { leaveId: req.leaveId },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave  deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave  already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave  activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave  already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllActiveLeave(): Promise<CommonResponseModel> {
        const result = await this.leaveEntityRepo.find({ where: { isActive: true } });
        if (result.length) return new CommonResponseModel(true, 1, 'Leave  fetched successfully', result);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave Type');
    }

    async saveLeaveCodeDefine(payload: any): Promise<CommonResponseModel> {
        const entityOne = new LeaveGeneratedCodeEntity();
        entityOne.generatedCode = payload.leaveGroupCode;
        entityOne.state = payload.state;
        if (payload.leaveGroupId) {
            entityOne.id = payload.leaveGroupId;
        }
        const resultOne = await this.leaveGeneratedCodeEntityRepo.save(entityOne);
        let arr = [];
        for (const i of payload.leaveTypeData) {
            const entity = new LeaveCodeDefineEntity();
            entity.leaveTypeId = i.leaveTypeId;
            entity.accumQty = i.accumQty;
            entity.countPerMonthYear = i.countPerMonthYear;
            entity.calculation = i.calculation;
            entity.specialInstructions = i.specialInstructions;
            entity.accumPeriod = i.accumPeriod;
            entity.collapse = i.collapse;
            entity.collapseMonth = i.collapseMonth;
            entity.encashLimit = i.encashLimit;
            entity.carryForward = i.carryForward
            entity.collapseCount = i.collapseCount
            if (payload.leaveGroupId) {
                entity.leaveGroupCodeId = payload.leaveGroupId
            } else {
                entity.leaveGroupCodeId = resultOne.id;
            }
            if (i.id) {
                entity.id = i.id;
            }
            arr.push(entity);
        }
        const result = await this.leaveCodeDefineEntityRepo.save(arr);
        if (result) return new CommonResponseModel(true, 1, 'Leave Code Define created successfully');
        return new CommonResponseModel(false, 0, 'Failed to create Leave Code Define');
    }

    async getAllGeneratedCode(): Promise<CommonResponseModel> {
        const result = await this.leaveGeneratedCodeEntityRepo.find();
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Generated Code fetched successfully', result);
        return new CommonResponseModel(false, 0, 'No data found');
    }

    async getAllActiveGeneratedCode(): Promise<CommonResponseModel> {
        const result = await this.leaveGeneratedCodeEntityRepo.find({ where: { isActive: true } });
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Generated Code fetched successfully', result);
        return new CommonResponseModel(false, 0, 'No data found');
    }

    async saveLeaveGroupCodeMapping(payload: any): Promise<CommonResponseModel> {

        const existingMappings = await this.leaveGroupCodeMappingEntityRepo.find({
            where: {
                generatedCodeId: payload.generatedCodeId,
                branchId: In(payload.branchId),
                employeeTypeId: payload.employeeTypeId,
                isActive: true
            }
        });

        if (existingMappings.length) {
            return new CommonResponseModel(false, 0, 'Leave balance already mapped for this group code and branchs');
        }

        const entities: LeaveGroupCodeMappingEntity[] = [];
        for (const branchId of payload.branchId) {
            const entity = new LeaveGroupCodeMappingEntity();
            entity.generatedCodeId = payload.generatedCodeId;
            entity.leaveGroupId = payload.leaveGroupId;
            entity.branchId = branchId
            entity.employeeTypeId = payload.employeeTypeId;
            if (payload.id) {
                entity.id = payload.id;
            }
            entities.push(entity);
        }

        const mapLeaves = await this.newLeaveAllocationAgainstBranch(payload);

        if (mapLeaves.status) {
            await this.leaveGroupCodeMappingEntityRepo.save(entities)
            return new CommonResponseModel(true, 1, mapLeaves.internalMessage);
        } else {
            return new CommonResponseModel(false, 0, mapLeaves.internalMessage);
        }
    }

    async getAllGroupCodeMapData(): Promise<CommonResponseModel> {
        const query = `SELECT lg.state, lgc.id , lg.id AS generateId, lgc.branch_id AS branchId,lgc.generated_code_id AS generatedCodeId, 
        lgc.leave_group_id AS leaveGroupId,lg.generated_code AS generatedCode,lgm.leave_group_name AS leaveGroupName,b.branch_name AS branchName,
        lgc.is_active AS isActive, lgc.created_at AS createdAt, lgc.version_flag AS versionFlag,et.name AS employeeType,lgc.employee_type_id AS employeeTypeId 
        FROM ${this.dbNames.lms}.leave_group_code_mapping lgc
        LEFT JOIN ${this.dbNames.lms}.leave_generated_code lg ON lgc.generated_code_id = lg.id
        LEFT JOIN ${this.dbNames.lms}.leave_group_master lgm ON lgc.leave_group_id = lgm.leave_group_id
        LEFT JOIN ${this.dbNames.ems}.branches b ON lgc.branch_id = b.id
        LEFT JOIN ${this.dbNames.ems}.employee_type et ON lgc.employee_type_id = et.id`;
        const result = await this.leaveGroupCodeMappingEntityRepo.query(query);
        if (result.length) return new CommonResponseModel(true, 1, 'Leave Code Define fetched successfully', result);
        return new CommonResponseModel(false, 0, 'No data found');
    }

    async activateOrDeactivateLeaveGroupCode(req: any): Promise<CommonResponseModel> {
        try {
            const exists = await this.leaveGroupCodeMappingEntityRepo.findOne({ where: { id: req.id } });
            if (!exists) {
                throw new CommonResponseModel(false, 99998, 'No Leave  found');
            }
            const update = await this.leaveGroupCodeMappingEntityRepo.update(
                { id: req.id },
                { isActive: req.isActive, updatedUser: req.updatedUser }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Group Code deactivated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Group Code  already deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Leave Group Code activated successfully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Leave Group Code already activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were made');
            }
        } catch (err) {
            return err;
        }
    }

    async codeDefineDataByLeaveGroupCode(req: any): Promise<CommonResponseModel> {
        if (!req || Object.keys(req).length === 0) {
            return new CommonResponseModel(false, 0, 'Request cannot be empty.');
        }
        const query = `SELECT lcd.id AS leaveCodeDefineId, lcd.leave_group_code_id AS leaveGroupCodeId, lcd.leave_type_id AS leaveTypeId, 
        lcd.accum_qty AS accumQty, lcd.accum_period AS accumPeriod, lcd.collapse AS collapse, lcd.collapse_month AS collapseMonth, 
        lcd.encash_limit AS encashLimit, lcd.carry_forward AS carryForward, l.leave_type_name AS leaveTypeName, l.leave_type_code AS leaveTypeCode
        FROM ${this.dbNames.lms}.leave_code_define lcd 
        LEFT JOIN ${this.dbNames.lms}.leave_type_master l ON l.leave_type_id = lcd.leave_type_id
        WHERE lcd.leave_group_code_id = ${req.leaveGroupCodeId}`
        const data = await this.leaveCodeDefineEntityRepo.query(query)
        //const data = await this.leaveCodeDefineEntityRepo.find({ where: { leaveGroupCodeId: req.leaveGroupCodeId } });
        if (data.length) return new CommonResponseModel(true, 1, 'Leave Code Define fetched successfully', data);
        return new CommonResponseModel(false, 0, 'Failed to fetch Leave Code Define');
    }

    async getEmployeesByBranchId(req: any): Promise<CommonResponseModel> {
        const empQuery = `SELECT id , employee_code AS employeeCode FROM ${this.dbNames.ems}.employee 
        WHERE branch_id = ${req.branchId} AND employee_type_id = ${req.employeeTypeId} AND is_active = 1`
        const employees = await this.employeeRepo.query(empQuery)
        const codeDefineData = await this.leaveCodeDefineEntityRepo.find({ where: { leaveGroupCodeId: req.generatedCodeId } })
        if (!employees.length || !codeDefineData.length) {
            return new CommonResponseModel(false, 0, 'No employees found')
        }
        const leaveBalances = [];
        const currentMonthYear = new Date().getFullYear().toString() +
            (new Date().getMonth() + 1).toString().padStart(2, "0");
        let existCount = []
        for (const lb of employees) {
            let existingRec = false;
            for (const cd of codeDefineData) {
                const existingRecord = await this.leaveBalanceRepo.findOne({
                    where: { employeeCode: lb.employeeCode, leaveTypeId: cd.leaveTypeId, monthYear: currentMonthYear }
                });
                if (existingRecord) {
                    existingRecord.monthAccumulation = cd.accumQty;
                    existingRecord.balance = cd.accumQty;
                    existingRecord.openingBalance = cd.accumQty;
                    existCount.push(existingRecord)
                    await this.leaveBalanceRepo.save(existingRecord);
                    // existingRec = true;
                    // continue;
                } else {
                    const entity = new LeaveBalance()
                    entity.employeeId = lb.id
                    entity.employeeCode = lb.employeeCode
                    entity.leaveTypeId = cd.leaveTypeId
                    entity.monthAccumulation = cd.accumQty
                    entity.balance = cd.accumQty
                    entity.openingBalance = cd.accumQty
                    entity.monthYear = currentMonthYear
                    leaveBalances.push(entity);
                }
            }
        }
        console.log(existCount.length, '------------existcount length')
        if (leaveBalances.length) {
            const save = await this.leaveBalanceRepo.save(leaveBalances)
            if (save) return new CommonResponseModel(true, 1, 'Leaves Allocated')
        }
        return new CommonResponseModel(false, 0, 'Something went wrong while allocating')
    }

    async newLeaveAllocationAgainstBranch(req: any): Promise<CommonResponseModel> {
        const empQuery = `
            SELECT id, employee_code AS employeeCode FROM ${this.dbNames.ems}.employee
            WHERE branch_id IN (${req.branchId.join(',')}) 
            AND employee_type_id = ? 
            AND is_active = 1
            AND leaves_allocated = 0
        `;
        const employees = await this.employeeRepo.query(empQuery, [req.employeeTypeId]);
        const codeDefineData = await this.leaveCodeDefineEntityRepo.find({
            where: { leaveGroupCodeId: req.generatedCodeId }
        });

        if (!employees.length || !codeDefineData.length) {
            return new CommonResponseModel(false, 0, "No employees or leave definitions found");
        }

        const newLeaveAllocation: NewLeaveAllocationsEntity[] = [];
        const currentYear = new Date().getFullYear().toString();

        for (const emp of employees) {
            for (const cd of codeDefineData) {
                const ent = new NewLeaveAllocationsEntity();
                ent.year = currentYear;
                ent.employeeId = emp.id;
                ent.employeeCode = emp.employeeCode;
                ent.leaveTypeId = cd.leaveTypeId;
                ent.leaveGroupCodeId = cd.leaveGroupCodeId;

                if (cd.accumPeriod === "Yearly") {
                    // Yearly leave allocation: Accumulate only in January, balance for all months
                    ent.accum1 = cd.accumQty;
                    ent.balance1 = cd.accumQty;

                    for (let i = 2; i <= 12; i++) {
                        ent[`accum${i}`] = 0; // No accumulation in other months
                        ent[`balance${i}`] = cd.accumQty; // Balance remains same
                    }
                } else {
                    // Monthly leave allocation: Set accumQty and balance for every month
                    for (let i = 1; i <= 12; i++) {
                        ent[`accum${i}`] = cd.accumQty;
                        ent[`balance${i}`] = cd.accumQty;
                    }
                }

                newLeaveAllocation.push(ent);
            }
        }

        await this.newLeaveAllocationRepo.save(newLeaveAllocation);

        await this.employeeRepo.query(
            `UPDATE ${this.dbNames.ems}.employee SET leaves_allocated = 1 WHERE id IN (${employees.map(emp => emp.id).join(',')})`
        );

        return new CommonResponseModel(true, 1, "Leaves Allocated Successfully");
    }
    
    @Cron('*/5 * * * *')
    async leaveAccumulationForNewJoineeEmployees(): Promise<CommonResponseModel> {
        try {
            const currentMonth = dayjs().format('YYYY-MM');
            const presentYear = dayjs().format('YYYY');
    
            // Fetch all leave group mappings in advance and store them in a map
            const mappedBranches = await this.leaveGroupCodeMappingEntityRepo.find();
            const branchMappingMap = new Map(
                mappedBranches.map(br => [`${br.branchId}_${br.employeeTypeId}`, br.generatedCodeId])
            );
    
            if (mappedBranches.length === 0) {
                return new CommonResponseModel(true, 0, "No branch mappings found");
            }
    
            // Fetch eligible employees based on mapped branch IDs
            const branchIds = mappedBranches.map(br => br.branchId);
            if (branchIds.length === 0) {
                return new CommonResponseModel(true, 0, "No valid branches found");
            }
    
            const employees = await this.employeeRepo.query(
                `SELECT id, employee_code AS employeeCode, branch_id AS branchId, employee_type_id AS employeeTypeId
                 FROM ${this.dbNames.ems}.employee
                 WHERE is_active = 1 AND leaves_allocated = 0 AND branch_id IN (?) AND date_of_joining NOT LIKE ?`,
                [branchIds, `%${currentMonth}%`]
            );
    
            if (employees.length === 0) {
                return new CommonResponseModel(true, 0, "No new employees require leave allocation");
            }
    
            let newLeaveAllocations: NewLeaveAllocationsEntity[] = [];
            let employeeIds: number[] = [];
    
            for (const emp of employees) {
                const generatedCodeId = branchMappingMap.get(`${emp.branchId}_${emp.employeeTypeId}`);
                if (!generatedCodeId) continue;
    
                const codeDefinedData = await this.leaveCodeDefineEntityRepo.find({
                    where: { leaveGroupCodeId: generatedCodeId },
                });
    
                for (const cd of codeDefinedData) {
                    const ent = new NewLeaveAllocationsEntity();
                    ent.year = presentYear;
                    ent.employeeId = emp.id;
                    ent.employeeCode = emp.employeeCode;
                    ent.leaveTypeId = cd.leaveTypeId;
                    ent.leaveGroupCodeId = cd.leaveGroupCodeId;
    
                    if (cd.accumPeriod === "Yearly") {
                        ent.accum1 = cd.accumQty;
                        ent.balance1 = cd.accumQty;
                        for (let i = 2; i <= 12; i++) {
                            ent[`accum${i}`] = 0;
                            ent[`balance${i}`] = cd.accumQty;
                        }
                    } else {
                        for (let i = 1; i <= 12; i++) {
                            ent[`accum${i}`] = cd.accumQty;
                            ent[`balance${i}`] = cd.accumQty;
                        }
                    }
                    newLeaveAllocations.push(ent);
                }
    
                employeeIds.push(emp.id);
            }
    
            if (newLeaveAllocations.length > 0) {
                await this.newLeaveAllocationRepo.save(newLeaveAllocations);
            }
    
            if (employeeIds.length > 0) {
                await this.employeeRepo.query(
                    `UPDATE ${this.dbNames.ems}.employee SET leaves_allocated = 1 WHERE id IN (?)`,
                    [employeeIds]
                );
            }
    
            return new CommonResponseModel(true, 1, "Leaves Allocated Successfully");
        } catch (error) {
            console.error("Error in leaveAccumulationForNewJoineeEmployees:", error);
            return new CommonResponseModel(false, 0, "Error allocating leaves");
        }
    }
    

    async leaveDetuctionTest(): Promise<CommonResponseModel> {

        const req = {
            qty: 1,
            leaveTypeId: 1,
            employeeId: 667,
            month: 4
        }
        const res = await this.leaveDeductionFromEmployee(req)
        return new CommonResponseModel(true, 1, res.internalMessage)
    }

    // async leaveDeductionFromEmployee(req: any): Promise<CommonResponseModel> {
    //     const { month, leaveTypeId, employeeId, qty } = req;
    //     const leaveAllocation = await this.newLeaveAllocationRepo.findOne({
    //         where: { leaveTypeId, employeeId }
    //     });

    //     if (!leaveAllocation) {
    //         return new CommonResponseModel(false, 0, "Leave allocation not found");
    //     }
    //     const leaveTypeHistory = await this.leaveCodeDefineEntityRepo.findOne({
    //         where: {
    //             leaveGroupCodeId: leaveAllocation.leaveGroupCodeId,
    //             leaveTypeId: leaveTypeId,
    //         }
    //     });

    //     if (!leaveTypeHistory) {
    //         return new CommonResponseModel(false, 0, "Leave type history not found");
    //     }

    //     const utilizedCol = `utilized${month}`;
    //     if (leaveTypeHistory.accumPeriod !== "Yearly") {
    //         const balanceCol = `balance${month}`;
    //         if (Number(leaveAllocation[balanceCol]) < qty) {
    //             return new CommonResponseModel(false, 0, "Insufficient leave balance");
    //         }
    //         leaveAllocation[balanceCol] = Number(leaveAllocation[balanceCol]) - qty;
    //         leaveAllocation[utilizedCol] = Number(leaveAllocation[utilizedCol] || 0) + qty;
    //     } else {
    //         for (let i = 1; i <= 12; i++) {
    //             const balanceCol = `balance${i}`;
    //             if ((Number(leaveAllocation[balanceCol]) || 0) < qty) {
    //                 return new CommonResponseModel(false, 0, `Insufficient leave balance in month ${i}`);
    //             }
    //         }
    //         for (let i = 1; i <= 12; i++) {
    //             const balanceCol = `balance${i}`;
    //             leaveAllocation[balanceCol] = Number(leaveAllocation[balanceCol]) - qty;
    //         }
    //         leaveAllocation[utilizedCol] = Number(leaveAllocation[utilizedCol] || 0) + qty;
    //     }
    //     const save = await this.newLeaveAllocationRepo.save(leaveAllocation);
    //     if (save) {
    //         return new CommonResponseModel(true, 1, "Leave deducted successfully");
    //     } else {
    //         return new CommonResponseModel(false, 0, "Something went wrong while detucting");
    //     }
    // }

    async leaveDeductionFromEmployee(req: any): Promise<CommonResponseModel> {
        const { month, leaveTypeId, employeeId, qty } = req;
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
        console.log(currentMonth, '----current minth')
        const leaveAllocation = await this.newLeaveAllocationRepo.findOne({
            where: { leaveTypeId, employeeId }
        });

        if (!leaveAllocation) {
            return new CommonResponseModel(false, 0, "Leave allocation not found");
        }

        const leaveTypeHistory = await this.leaveCodeDefineEntityRepo.findOne({
            where: {
                leaveGroupCodeId: leaveAllocation.leaveGroupCodeId,
                leaveTypeId: leaveTypeId,
            }
        });

        if (!leaveTypeHistory) {
            return new CommonResponseModel(false, 0, "Leave type history not found");
        }

        const utilizedCol = `utilized${month}`;
        console.log(month, '----current month', currentMonth)
        // ✅ New Condition: Future leave deduction for leaveTypeId 1 or 3
        if ((leaveTypeId === 1 || leaveTypeId === 3) && month > currentMonth) {
            const balanceCol = `balance${currentMonth}`; // Deduct balance from current month

            if (Number(leaveAllocation[balanceCol]) < qty) {
                return new CommonResponseModel(false, 0, `Insufficient balance in the current month (${currentMonth})`);
            }
            leaveAllocation[balanceCol] = Number(leaveAllocation[balanceCol]) - qty;
            leaveAllocation[utilizedCol] = Number(leaveAllocation[utilizedCol] || 0) + qty; // Add utilized in future month
        }
        else if (leaveTypeHistory.accumPeriod === "Monthly") {
            const balanceCol = `balance${month}`;
            if (Number(leaveAllocation[balanceCol]) < qty) {
                return new CommonResponseModel(false, 0, "Insufficient leave balance");
            }
            leaveAllocation[balanceCol] = Number(leaveAllocation[balanceCol]) - qty;
            leaveAllocation[utilizedCol] = Number(leaveAllocation[utilizedCol] || 0) + qty;
        }
        else if (leaveTypeHistory.accumPeriod === "Yearly") {
            for (let i = 1; i <= 12; i++) {
                const balanceCol = `balance${i}`;
                if ((Number(leaveAllocation[balanceCol]) || 0) < qty) {
                    return new CommonResponseModel(false, 0, `Insufficient leave balance in month ${i}`);
                }
            }
            for (let i = 1; i <= 12; i++) {
                const balanceCol = `balance${i}`;
                leaveAllocation[balanceCol] = Number(leaveAllocation[balanceCol]) - qty;
            }
            leaveAllocation[utilizedCol] = Number(leaveAllocation[utilizedCol] || 0) + qty;
        }

        const save = await this.newLeaveAllocationRepo.save(leaveAllocation);
        if (save) {
            return new CommonResponseModel(true, 1, "Leave deducted successfully");
        } else {
            return new CommonResponseModel(false, 0, "Something went wrong while deducting leave");
        }
    }


    async leaveAccumcalculation(req: any): Promise<CommonResponseModel> {
        const empLeaveHistory = await this.newLeaveAllocationRepo.find({ where: { employeeId: req.employeeId, leaveTypeId: req.leaveTypeId } })
        const leaveTypeHistory = await this.leaveCodeDefineEntityRepo.find({ where: { leaveGroupCodeId: empLeaveHistory[0]?.leaveGroupCodeId } })
        return
    }

    //ADD CRON FOR NEW JOINEE AS REQUIRED
    async leaveAccumulationForNewJoinee(): Promise<CommonResponseModel> {
        const today = dayjs();
        const fromDate = today.subtract(2, "month").date(20).format("YYYY-MM-DD");
        const toDate = today.subtract(1, "month").date(20).format("YYYY-MM-DD");
        const empQuery = `SELECT branch_id as branchId,employee_type_id as employeeTypeId, id , employee_code AS employeeCode FROM ${this.dbNames.ems}.employee 
        WHERE DATE(created_at) BETWEEN '${fromDate}' AND '${toDate}' AND is_active = 1`
        const before20JoinedEmployees = await this.employeeRepo.query(empQuery)
        const presentYear = new Date().getFullYear().toString();
        let newLeaveAllocation = [];
        for (const bj of before20JoinedEmployees) {
            const mappedCodeData = await this.leaveGroupCodeMappingEntityRepo.findOne({ where: { branchId: bj.branchId, employeeTypeId: bj.employeeTypeId } })
            if (!mappedCodeData) {
                continue;
            }
            const codeDefinedData = await this.leaveCodeDefineEntityRepo.find({ where: { leaveGroupCodeId: mappedCodeData.generatedCodeId } })
            for (const cd of codeDefinedData) {
                const ent = new NewLeaveAllocationsEntity();
                ent.year = presentYear;
                ent.employeeId = bj.id;
                ent.employeeCode = bj.employeeCode;
                ent.leaveTypeId = cd.leaveTypeId;
                ent.leaveGroupCodeId = cd.leaveGroupCodeId;
                if (cd.accumPeriod === "Yearly") {
                    ent.accum1 = cd.accumQty;
                    ent.balance1 = cd.accumQty;
                    for (let i = 2; i <= 12; i++) {
                        ent[`accum${i}`] = 0;
                        ent[`balance${i}`] = cd.accumQty;
                    }
                } else {
                    for (let i = 1; i <= 12; i++) {
                        ent[`accum${i}`] = cd.accumQty;
                        ent[`balance${i}`] = cd.accumQty;
                    }
                }
                newLeaveAllocation.push(ent);
            }
        }
        const save = await this.newLeaveAllocationRepo.save(newLeaveAllocation);
        if (save) return new CommonResponseModel(true, 1, "Leaves Allocated Successfully For New Joinees");
        return new CommonResponseModel(false, 0, "Error while allocating leaves");
    }

    async montlyCarryForwardAndCollapse11(): Promise<CommonResponseModel> {
        const codeDefinedData = await this.leaveCodeDefineEntityRepo.find()
        for (const cd of codeDefinedData) {
            const mappedCodeData = await this.leaveCodeDefineEntityRepo.findOne({ where: { leaveGroupId: cd.leaveGroupCodeId, leaveTypeId: cd.leaveTypeId } })

            //if leaveTypeId === 1 || leaveTypeId === 3 have to do sum of last month balance and this month accum and update the value in this month balance, and last month balance should add in this month carry_forward column and limit from leaveCodeDefineEntityRepo agaist the leaveTypeId from leaveCodeDefineEntityRepo and have to update in newLeaveAllocationRepo

        }

        return
    }

    async monthlyCarryForwardAndCollapse(): Promise<CommonResponseModel> {

        const codeDefinedData = await this.leaveCodeDefineEntityRepo.find();

        for (const cd of codeDefinedData) {
            // Fetch mapped code data
            const mappedCodeData = await this.leaveCodeDefineEntityRepo.findOne({
                where: { leaveGroupCodeId: cd.leaveGroupCodeId, leaveTypeId: cd.leaveTypeId },
            });

            if (!mappedCodeData) continue;

            // Leave will carry forward only EL and CL
            // if (cd.leaveTypeId !== 1 && cd.leaveTypeId !== 3) continue;

            // emp against the groupCodeId and leaveTypeId
            const employees = await this.newLeaveAllocationRepo.find({
                where: { leaveGroupCodeId: cd.leaveGroupCodeId, leaveTypeId: cd.leaveTypeId },
            });

            for (const emp of employees) {
                const currentMonth = dayjs().format('M')
                const lastMonth = Number(currentMonth) - 1;
                const currentMonthFullName = dayjs().format('MMMM')

                if (cd.accumPeriod === 'Yearly' || cd.accumPeriod === 'Daily') continue

                if (cd.collapseMonth === currentMonthFullName) continue

                const lastMonthCarriedCol = `carried${lastMonth}`;
                const lastMonthAccumCol = `accum${lastMonth}`;
                const lastMonthUtilized1Col = `utilized${lastMonth}`;
                const lastMonthBalanceCol = `balance${lastMonth}`;

                const thisMonthAccumCol = `accum${currentMonth}`;
                const thisMonthBalanceCol = `balance${currentMonth}`;
                const thisMonthCarryForwardCol = `carried${currentMonth}`;

                const lastMonthBalance = (Number(emp[lastMonthCarriedCol]) + Number(emp[lastMonthAccumCol])) - Number(emp[lastMonthUtilized1Col]) || 0;
                const thisMonthAccum = Number(emp[thisMonthAccumCol]) || 0;

                const carryForwardLimit = Number(cd.carryForward) || 0; // Carry forward limit from leaveCodeDefineEntityRepo

                // Calculate new balance
                let newBalance = lastMonthBalance + thisMonthAccum;

                // Apply carry forward limit
                let carryForward = Math.min(lastMonthBalance, carryForwardLimit);

                // Update values
                emp[thisMonthBalanceCol] = newBalance;
                emp[thisMonthCarryForwardCol] = carryForward;

                // Save updated employee leave allocation
                await this.newLeaveAllocationRepo.save(emp);
            }
        }

        return new CommonResponseModel(true, 1, "Monthly carry forward and collapse updated successfully");
    }



}