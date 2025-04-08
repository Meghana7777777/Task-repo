import { ApplyForLeavesResponseModel, ApplyForLeaveStatusEnum, ApplyLeavesReq, ApplyLeavesStatusReq, ApproveLeaveStatusReq, CommonResponseModel, EmpDataReq, EmployeeDetailsDto, ErrorResponse, MessageParameters, WhatsAppLogDto } from '@hrexpert/shared-models';
import { AttendanceServices, HolidayCalanderService, LeaveAllocationService, LeavePolicyService, TypesOfLeavesService, WeekOffLeavesService, WhatsUpService } from '@hrexpert/shared-services';

import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { EmployeeOnboardingService } from 'libs/shared-services/src/lib/employee-management';
import moment from 'moment';
import { Between, DataSource, In } from 'typeorm';
import { EmployeeDetailRepository } from '../../../../employee-management/src/app/employee-onboarding/repositorys/employee-details-repo';
import { TypesOfLeavesRepository } from '../../../../masters/src/app/types-of-leaves/repo/types-of-leave.repo';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { AttendanceEntity } from '../attendance/dto/attendance-entity';
import { AttendanceRepo } from '../attendance/dto/attendance-repo';
import { LeaveAllocationsRepository } from '../leave-allocation/repos/leave-allocation-repository';
import { ApplyForLeavesAdapter } from './adapter/apply-for-leaves.adapter';
import { ApplyForLeavesDto } from './dto/apply-for-leaves.dto';
import { ApplyLeaveBrachDto } from './dto/apply-leave-branch.dto';
import { ApplyLeavesDto } from './dto/apply-leave.dto';
import { ApplyForLeavesEntity } from './entities/apply-for-leaves.entity';
import { ExceededLeavesEntity } from './entities/exceeded-leaves.entity';
import { ApplyForLeavesRepository } from './repositories/apply-for-leaves.repository';
import { ExceededLeavesRepository } from './repositories/exceeded-leaves.repository';
import axios from 'axios';

@Injectable()
export class ApplyForLeaveService {
    constructor(
        private dataSource: DataSource,
        private applyForLeaveRepository: ApplyForLeavesRepository,

        private applyForLeavesAdapter: ApplyForLeavesAdapter,
        private employeeDetailsService: EmployeeOnboardingService,
        private wpService: WhatsUpService,

        private holidaysMasterService: HolidayCalanderService,
        private weekOfLeavesService: WeekOffLeavesService,
        private attService: AttendanceServices,
        private typeOfLeavesService: TypesOfLeavesService,
        private leaveAllocationService: LeaveAllocationService,
        @InjectRepository(LeaveAllocationsRepository)
        private allocationRepo: LeaveAllocationsRepository,
        @InjectRepository(EmployeeDetailRepository)
        private employeeRepo: EmployeeDetailRepository,
        @InjectRepository(TypesOfLeavesRepository)
        private typeOfLeaveRepo: TypesOfLeavesRepository,
        // @InjectRepository(AttendanceRepo)
        private attendanceRepo: AttendanceRepo,
        private leavePolicyService: LeavePolicyService,
        private readonly exceededLeaveRepo: ExceededLeavesRepository,


    ) { }


    async saveBulkLeaveExcel(req: any): Promise<CommonResponseModel> {
        const formatDate = (dateStr) => {
            const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3}Z)?$/;
            if (isoDatePattern.test(dateStr)) {
                const date = new Date(dateStr);
                const day = String(date.getDate() + 1).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            } else {
                return dateStr;
            }
        };
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            const employeeMap = await this.getEmployeeNameByCode();
            await transactionManager.startTransaction();
            const flag = new Set<boolean>();
            const columnSet = new Set<string>();
            const updatedArray = req.map((obj) => {
                const updatedObj: Record<string, any> = {};
                for (const key in obj) {
                    const newKey = key.replace(/\s/g, '').replace(/[\(\)\.]/g, '').replace(/-/g, '').replace(/#/g, '');
                    if (newKey !== '') {
                        columnSet.add(newKey);
                        updatedObj[newKey] = obj[key];
                    }
                }
                return updatedObj;
            });
            const convertedData = updatedArray.map((obj) => {
                const updatedObj: Record<string, any> = {};
                for (const key in obj) {
                    const value = obj[key];
                    updatedObj[key] = value === "" ? null : value;
                }
                return updatedObj;
            });

            const leaveTypeOfData = await this.getAllTypesOfLeavesData()
            const leaveTypeMap = new Map()
            for (const leaveType of leaveTypeOfData.data) {
                leaveTypeMap.set(leaveType.typeOfLeave, leaveType.id);
            }
            for (const data of convertedData) {
                if (data) {
                    const addObj = new ApplyForLeavesEntity();
                    addObj.employeeCode = data.EmployeeCode;
                    if (!employeeMap.has(data.EmployeeCode)) {
                        throw new ErrorResponse(0, "Employee Code Not Matched");
                    }
                    addObj.employeeId = data.empId;
                    addObj.employeeName = employeeMap.get(data.EmployeeCode).employeeName;
                    addObj.typeOfLeave = data.tlId;
                    // addObj.fromDate = data.Date ? dayjs(data.Date).startOf('day').format('YYYY-MM-DD') : undefined;
                    // addObj.toDate = data.Date ? dayjs(data.Date).startOf('day').format('YYYY-MM-DD') : undefined
                    addObj.fromDate = data.Date ? dayjs(data.Date, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined;
                    addObj.toDate = data.Date ? dayjs(data.Date, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined;
                    addObj.noOfDays = data.NoOfDays;
                    addObj.leaveReason = data.LeaveReason;
                    addObj.leaveAddress = data.LeaveAddress;
                    addObj.leaveFromDay = "Full Day";
                    addObj.leaveToDay = "Full Day";
                    addObj.status = ApplyForLeaveStatusEnum.OPEN
                    const addSave = await transactionManager.getRepository(ApplyForLeavesEntity).save(addObj);
                    if (addSave) {
                        flag.add(true);
                    } else {
                        flag.add(false);
                        console.error("Failed to save leave record for employee:", addObj.employeeCode);
                        await transactionManager.releaseTransaction();
                        break;
                    }
                }
            }

            if (!flag.has(false)) {
                await transactionManager.completeTransaction();
                return new CommonResponseModel(true, 1, "Data saved successfully");
            } else {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, "Some records failed to save");
            }
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, err.message || err);
        }
    }

    async saveExceededLeaveExcelData(data: any[]): Promise<ApplyForLeavesResponseModel> {
        try {
            const entities = data.map((item) => {
                const entity = new ExceededLeavesEntity();
                entity.employeeId = item.empId;
                entity.employeeCode = item.empCode;
                entity.leaveType = item.leaveType;
                entity.fromDate = item.Date ? dayjs(item.Date, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DD') : undefined;
                entity.toDate = item.Date ? dayjs(item.Date, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DD') : undefined;
                entity.noOfDays = item.noOfDays;
                entity.leaveReason = item.leaveReason;
                entity.leaveAddress = item.leaveAddress;
                entity.leavesAllotted = item.leavesAlloted;
                entity.leavesUsed = item.leavesUsed;
                entity.availbleLeaves = item.availbleLeaves;
                return entity;
            });
            const saveData = await this.exceededLeaveRepo.save(entities);
            if (saveData.length > 0) {
                return new CommonResponseModel(true, 1, "Exceeded Data Successfully Saved");
            } else {
                throw new ErrorResponse(0, "Exceeded Data Save Failed");
            }
        } catch (error) {
            throw error;
        }
    }

    async getExceededData(): Promise<CommonResponseModel> {
        const result = await this.exceededLeaveRepo.getAllExceedLeavesDataRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getAppliedForLeaves(req: ApplyLeavesReq): Promise<CommonResponseModel> {
        const result = await this.applyForLeaveRepository.getAppliedForLeaves(req);
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getAppliedForLeavesOpen(req: ApproveLeaveStatusReq): Promise<CommonResponseModel> {
        const result = await this.applyForLeaveRepository.getAppliedForLeavesOpen(req);
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getAppliedForLeavesApproved(req: ApproveLeaveStatusReq): Promise<CommonResponseModel> {
        const result = await this.applyForLeaveRepository.getAppliedForLeavesApproved(req);
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getAppliedForLeavesRejected(req: ApproveLeaveStatusReq): Promise<CommonResponseModel> {
        const result = await this.applyForLeaveRepository.getAppliedForLeavesRejected(req);
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async getAppliedForLeavesCancel(req: ApproveLeaveStatusReq): Promise<CommonResponseModel> {
        const result = await this.applyForLeaveRepository.getAppliedForLeavesCancel(req);
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
        } else {
            return new CommonResponseModel(true, 1, 'No data found', []);
        }
    }

    async createManualLeave1(data: ApplyForLeavesDto, isUpdate: boolean): Promise<ApplyForLeavesResponseModel> {
        try {
            const modifiedFromDate = dayjs(data.fromDate).format("YYYY-MM-DD");
            const modifiedToDate = dayjs(data.toDate).format("YYYY-MM-DD");
            const existingLeave = await this.applyForLeaveRepository.findOne({
                where: {
                    employeeId: data.employeeId,
                    status: In([ApplyForLeaveStatusEnum.APPROVED, ApplyForLeaveStatusEnum.OPEN]),
                    fromDate: Between(modifiedFromDate, modifiedToDate),
                    toDate: Between(modifiedFromDate, modifiedToDate)
                }
            });
            if (existingLeave) {
                throw new Error("Already applied for leave on this date.");
            }
            const manager = this.dataSource;
            const currDate = new Date();
            const date = currDate.getFullYear() + '-' + (Number(currDate.getMonth()) + 1) + '-' + currDate.getDate();
            const entity = new ApplyForLeavesEntity()
            entity.applyForLeavesId = data.applyForLeavesId;
            entity.employeeId = data.employeeId;
            entity.employeeCode = data.employeeCode;
            entity.employeeName = data.employeeName.trim();
            entity.typeOfLeave = data.typeOfLeave;
            entity.fromDate = data.fromDate ? dayjs(data.fromDate).startOf('day').format('YYYY-MM-DD') : undefined
            entity.toDate = data.toDate ? dayjs(data.toDate).startOf('day').format('YYYY-MM-DD') : undefined
            entity.leaveFromDay = data.leaveFromDay;
            entity.leaveToDay = data.leaveToDay;
            entity.status = ApplyForLeaveStatusEnum.OPEN
            entity.noOfDays = data.noOfDays;
            entity.leaveReason = data.leaveReason;
            entity.leaveAddress = data.leaveAddress;
            entity.remarks = data.remarks;
            const saveData = await this.applyForLeaveRepository.save(entity)
            const time = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
            const formattedFromDate = moment(data.fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(data.toDate).format('YYYY-MM-DD');
            const status = data.status
            const empReq = new EmployeeDetailsDto()
            empReq.id = data.employeeId
            const empNameResult = await this.employeeRepo.employeeNameQuery(empReq)
            const empName = empNameResult[0]?.first_name || 'Unknown';
            const leaveTypeReq = new ApplyLeavesStatusReq()
            // const leaveTypeQuery = `SELECT lt.type_of_leave FROM dev_hrms_masters.types_of_leaves lt WHERE lt.id = ${data.typeOfLeave}`;
            const leaveTypeResult = await this.typeOfLeaveRepo.leaveTypeQuery(leaveTypeReq);
            const leaveType = leaveTypeResult[0]?.type_of_leave || 'Unknown';
            const mobileDataReq = new EmployeeDetailsDto()
            mobileDataReq.reportingManager = empNameResult[0]?.reportingManager
            const mobileNumberQuery = await this.employeeRepo.mobileNumberQuery(mobileDataReq)
            const mobileNumber = mobileNumberQuery[0]?.mobile_no || 'Unknown';
            const parameters = [
                { "type": "text", "text": data.employeeCode },
                { "type": "text", "text": empName },
                { "type": "text", "text": leaveType },
                { "type": "text", "text": formattedFromDate },
                { "type": "text", "text": formattedToDate },
                { "type": "text", "text": status },
                { "type": "text", "text": data.leaveReason },
                { "type": "text", "text": date + " " + time }
            ]
            let statusFlag = true
            const req = await new MessageParameters(mobileNumber, 'leave_approval_status', parameters, "en_us")
            const messageStatus = await this.wpService.sendMessageThroughFbApi(req);
            if (!messageStatus.status) {
                statusFlag = false
            } else {
                statusFlag = true
                const companyId = 7;
                const hrmsModuleId = 2;
                const whatsapplogDto = new WhatsAppLogDto(mobileNumber, 'l', 'Schemax', companyId, hrmsModuleId)
                //await this.wtsAppBroadCatService.createWhatappLog(whatsapplogDto)
            }
            if (saveData) {
                const req = [saveData.employeeCode, saveData.toDate]
                await this.employeeDetailsService.updateLastLeave(req);
                return new CommonResponseModel(true, 1, "Leave Applied Successfully", saveData);
            }
            else {
                throw new ErrorResponse(0, "Failed While Applying Leave through Manual Creation")
            }
        } catch (error) {
            throw error;
        }
    }

    async createManualLeave(data: ApplyForLeavesDto, isUpdate: boolean): Promise<ApplyForLeavesResponseModel> {
        try {
            const empDataReq = new EmpDataReq(data.employeeId, null, null, dayjs().format('YYYYMM'), null,
                null, null, null, null, data.employeeCode
            );
            const leaveAllocations = await this.leaveAllocationService.getAllNewLeaveAllocationsLeaveTypes(empDataReq)

            if (Number(leaveAllocations.data.find((rec) => rec.leaveTypeId === Number(data.typeOfLeave)).available) < Number(data.noOfDays)) {
                return new CommonResponseModel(false, 0, "No of Days cannot exceed available leaves!");
            }

            const modifiedFromDate = dayjs(data.fromDate).format("YYYY-MM-DD");
            const modifiedToDate = dayjs(data.toDate).format("YYYY-MM-DD");
            const existingLeave = await this.applyForLeaveRepository.findOne({
                where: {
                    employeeId: data.employeeId,
                    status: In([ApplyForLeaveStatusEnum.APPROVED, ApplyForLeaveStatusEnum.OPEN]),
                    fromDate: Between(modifiedFromDate, modifiedToDate),
                    toDate: Between(modifiedFromDate, modifiedToDate)
                }
            });
            if (existingLeave) {
                return new CommonResponseModel(false, 0, "Already applied for leave on this date.");
            }
            const entity = new ApplyForLeavesEntity()
            entity.applyForLeavesId = data.applyForLeavesId;
            entity.employeeId = data.employeeId;
            entity.employeeCode = data.employeeCode;
            entity.employeeName = data.employeeName.trim();
            entity.typeOfLeave = data.typeOfLeave;
            entity.fromDate = data.fromDate ? dayjs(data.fromDate).startOf('day').format('YYYY-MM-DD') : undefined
            entity.toDate = data.toDate ? dayjs(data.toDate).startOf('day').format('YYYY-MM-DD') : undefined
            entity.leaveFromDay = data.leaveFromDay;
            entity.leaveToDay = data.leaveToDay;
            entity.status = ApplyForLeaveStatusEnum.OPEN
            entity.noOfDays = data.noOfDays;
            entity.leaveReason = data.leaveReason;
            entity.leaveAddress = data.leaveAddress;
            entity.remarks = data.remarks;
            const saveData = await this.applyForLeaveRepository.save(entity)
            if (saveData) {
                const req = [saveData.employeeCode, saveData.toDate]
                await this.employeeDetailsService.updateLastLeave(req);
                const updateReq = {
                    employeeId: data.employeeId,
                    noOfDays: data.noOfDays,
                    typeOfLeave: data.typeOfLeave,
                    leaveGroupCodeId: leaveAllocations.data.find((rec) => rec.leaveTypeId === Number(data.typeOfLeave)).leaveGroupCodeId,
                    dates: await this.getMonthDays(dayjs(data.fromDate).format('DD-MM-YYYY'), dayjs(data.toDate).format('DD-MM-YYYY'), data.leaveFromDay, data.leaveToDay, data.noOfDays),
                    CurrentMonth: dayjs().format('M')
                };
                const updateLeaves = await this.leaveAllocationService.updateNewLeaveAllocations(updateReq)

                const currDate = new Date();
                const date = currDate.getFullYear() + '-' + (Number(currDate.getMonth()) + 1) + '-' + currDate.getDate();
                const time = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
                const formattedFromDate = moment(data.fromDate).format('YYYY-MM-DD');
                const formattedToDate = moment(data.toDate).format('YYYY-MM-DD');
                const status = data.status
                const empReq = new EmployeeDetailsDto()
                empReq.id = data.employeeId
                const empNameResult = await this.employeeRepo.employeeNameQuery(empReq)
                const empName = empNameResult[0]?.first_name || 'Unknown';
                const leaveTypeReq = new ApplyLeavesStatusReq()
                const leaveTypeResult = await this.typeOfLeaveRepo.leaveTypeQuery(leaveTypeReq);
                const leaveType = leaveTypeResult[0]?.type_of_leave || 'Unknown';
                const mobileDataReq = new EmployeeDetailsDto()
                mobileDataReq.reportingManager = empNameResult[0]?.reportingManager
                const mobileNumberQuery = await this.employeeRepo.mobileNumberQuery(mobileDataReq)
                const email = mobileNumberQuery[0]?.email_id || 'Unknown';
                const rmName = mobileNumberQuery[0]?.first_name || 'Unknown';

                const emailReq = {
                    'to': [email],
                    'subject': `Leave Approval Request`,
                    'body': `
                    <html>
                    <head>
                        <meta charset="UTF-8" />
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ddd;
                                border-radius: 8px;
                                background-color: #f9f9f9;
                            }
                            .highlight {
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p><span class="highlight">To:</span> ${rmName},</p>
                            <p>Dear Sir/Madam,</p>
                            <p>Please find below the leave request details:</p>
                
                            <p><span class="highlight">Employee Code:</span> ${data.employeeCode}</p>
                            <p><span class="highlight">Employee Name:</span> ${empName}</p>
                            <p><span class="highlight">Leave Type:</span> ${leaveType}</p>
                            <p><span class="highlight">From Date:</span> ${formattedFromDate}</p>
                            <p><span class="highlight">To Date:</span> ${formattedToDate}</p>
                            <p><span class="highlight">Leave Status:</span> ${status}</p>
                            <p><span class="highlight">Reason:</span> ${data.leaveReason}</p>
                            <p><span class="highlight">Request Date:</span> ${date} ${time}</p>
                
                            <p>Kindly review and process the request at your earliest convenience.</p>
                
                            <p>Best regards,</p>
                            <p><span class="highlight">${empName}</span></p>
                        </div>
                    </body>
                    </html>
                    `
                };
                
                const response = axios.post("https://alerts.schemaxtech.in/email/send", emailReq, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (updateLeaves) {
                    return new CommonResponseModel(true, 1, "Leave Applied Successfully", saveData);
                } else {
                    return new CommonResponseModel(false, 0, "Leave Applied Failed", saveData);
                }
            }
            else {
                return new CommonResponseModel(false, 0, "Failed While Applying Leave through Manual Creation");
            }
        } catch (error) {
            throw error;
        }
    }

    async getMonthDays(fromDateStr: string, toDateStr: string, leaveFromDay: string, leaveToDay: string, noOfDays: number) {
        const fromDate = new Date(fromDateStr.split('-').reverse().join('-'))
        const toDate = new Date(toDateStr.split('-').reverse().join('-'))

        const result: { month: number; days: number }[] = []
        let remainingDays = noOfDays
        let currentDate = new Date(fromDate)

        while (currentDate <= toDate && remainingDays > 0) {
            const month = currentDate.getMonth() + 1
            const year = currentDate.getFullYear()

            const daysInMonth = new Date(year, month, 0).getDate()
            const startDay = currentDate.getDate();
            const endDay = month === toDate.getMonth() + 1 && year === toDate.getFullYear() ? toDate.getDate() : daysInMonth

            let days = endDay - startDay + 1

            if (currentDate.getTime() === fromDate.getTime()) {
                if (leaveFromDay === "First Half") days -= 0.5
                else if (leaveFromDay === "Second Half") days -= 1
            }
            if (currentDate.getTime() === toDate.getTime()) {
                if (leaveToDay === "First Half") days -= 1
                else if (leaveToDay === "Second Half") days -= 0.5
            }

            days = Math.min(days, remainingDays)
            remainingDays -= days

            const existingMonth = result.find((entry) => entry.month === month)
            if (existingMonth) {
                existingMonth.days += days
            } else {
                result.push({ month, days })
            }

            currentDate.setMonth(currentDate.getMonth() + 1, 1)
        }

        return result
    }

    async getActiveEmployeesById(): Promise<CommonResponseModel> {
        try {
            const mainData = await this.employeeDetailsService.getAllEmployeeNameAndCodeAgainstEmpId()
            return new CommonResponseModel(true, 1111, "getActiveEmployeesById Saved", mainData)
        } catch (err) {
            throw err;
        }
    }

    async getActiveEmployeesByIds(req: any): Promise<CommonResponseModel> {
        try {
            const mainData = await this.employeeDetailsService.getAllEmployeeNameAndCodeAgainstEmpIds(req)
            return new CommonResponseModel(true, 1111, "getActiveEmployeesById Saved", mainData)
        } catch (err) {
            throw err;
        }
    }

    async getEmployeeNameByCode(): Promise<Map<number, { employeeName: string; employeeId: number }>> {
        try {
            const result = await this.employeeDetailsService.getAllEmployeeNameAndCodeAgainstEmpId();
            const employeeMap = new Map<number, { employeeName: string; employeeId: number }>();
            result.data.forEach((i) => {
                employeeMap.set(Number(i.employeeCode), { employeeName: i.employeeName, employeeId: i.empId });
            });
            return employeeMap;
        } catch (err) {
            throw err;
        }
    }

    async getHolidaysDateFromHolidayMaster(): Promise<CommonResponseModel> {
        try {
            const holidaysData = await this.holidaysMasterService.getHolidaysDateData();
            const mappedHolidaysData = holidaysData.data.map((i) => ({
                ...i,
                holidayDate: dayjs(i.holidayDate).format('DD-MM-YYYY')
            }));
            return new CommonResponseModel(true, 1112, "Filtered data", mappedHolidaysData);
        } catch (err) {
            throw err;
        }
    }

    async getWeekOfDataFromWeekOfTable(): Promise<CommonResponseModel> {
        try {
            const allData = await this.weekOfLeavesService.getWeekNameFromWeekOffLeaves()
            const originalData = allData.data
            return new CommonResponseModel(true, 1113, "getWeekOf Leaves Data Saved", originalData)
        } catch (err) {
            throw err;
        }
    }

    async getAttStatusData(): Promise<CommonResponseModel> {
        try {
            const allData = await this.attService.getAttStatusByEmpIdCodeName()
            const originalData = allData.data
            return new CommonResponseModel(true, 1113, "get Att Status Data Saved", originalData)
        } catch (err) {
            throw err;
        }
    }

    async getAllTypesOfLeavesData(): Promise<CommonResponseModel> {
        try {
            const allData = await this.leavePolicyService.getAllTypesOfLeavesPolicy()
            const originalData = allData.data
            return new CommonResponseModel(true, 1113, "get types of leaves Status Data Saved", originalData)
        } catch (err) {
            throw err;
        }
    }

    async getAllLeaveAllocationsData(): Promise<CommonResponseModel> {
        try {
            const abc = await this.leaveAllocationService.getAllLeaveAllocations()
            const originalData = abc.data
            return new CommonResponseModel(true, 1113, "get leave allocation Status Data Saved", originalData)
        } catch (err) {
            throw err;
        }
    }

    async getLeaveHistory(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.applyForLeaveRepository.getLeaveHistory(req)
            if (result.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
            } else {
                return new CommonResponseModel(true, 1, 'No data found', []);
            }
        } catch (err) {
            throw err;
        }
    }


    // async getAppliedForLeavesIdById(req: ApplyLeavesStatusReq): Promise<CommonResponseModel> {
    //     try {
    //         const result = await this.applyForLeaveRepository.getAppliedForLeavesIdById(req);

    //         if (result.length > 0) {
    //             const leaveRecord = result[0];
    //             const { employeeId, fromDate, toDate, leaveCode,branchId,departmentId,desginationid,employeeCode,employeeName,divisionId } = leaveRecord;

    //             // Convert fromDate and toDate to Date objects
    //             const startDate = new Date(fromDate);
    //             const endDate = new Date(toDate);

    //             // Fetch existing attendance records for the employee between fromDate and toDate
    //             const existingAttendances = await this.attendanceRepo.find({
    //                 where: {
    //                     empId: employeeId,
    //                     date: Between(this.formatDate(startDate), this.formatDate(endDate)),
    //                 },
    //             });

    //             if (existingAttendances.length > 0) {
    //                 // Update leave status for existing attendance records
    //                 for (const attendance of existingAttendances) {
    //                     attendance.leaveStatus = leaveCode;
    //                     await this.attendanceRepo.save(attendance);
    //                 }
    //             } else {
    //                 // Insert new attendance records for each date between fromDate and toDate
    //                 for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    //                     const newAttendance = new AttendanceEntity();
    //                     newAttendance.empId = employeeId;
    //                     newAttendance.empName =employeeName
    //                     newAttendance.empCode =employeeCode
    //                     newAttendance.departmentId =departmentId
    //                     newAttendance.designationId = desginationid
    //                     newAttendance.divisionId =divisionId
    //                     newAttendance.branch =branchId
    //                     newAttendance.attnStatus = "A"
    //                     newAttendance.attendanceMonth =`${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`


    //                     newAttendance.date = this.formatDate(date); // Format date as string
    //                     newAttendance.leaveStatus = leaveCode;
    //                     await this.attendanceRepo.save(newAttendance);
    //                 }
    //             }

    //             return new CommonResponseModel(true, 1, 'Data retrieved and attendance updated successfully', result);
    //         } else {
    //             return new CommonResponseModel(true, 1, 'No data found', []);
    //         }
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    async getAppliedForLeavesIdById(req: ApplyLeavesStatusReq): Promise<CommonResponseModel> {
        try {
            const results = await this.applyForLeaveRepository.getAppliedForLeavesIdById({ applyForLeavesId: req.applyForLeavesId });
            if (results.length > 0) {
                let leaveData = {};
                for (const leaveRecord of results) {
                    const { employeeId, fromDate, toDate, leaveCode, leaveFromDay, leaveToDay, empName, employeeCode, departmentId, designationId, divisionId, branchId, leaveStatus } = leaveRecord;
                    let startDate = new Date(fromDate);
                    let endDate = new Date(toDate);
                    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                        let currentDate = d.toISOString().split('T')[0];
                        if (!leaveData[employeeId]) {
                            leaveData[employeeId] = {};
                        }
                        let leaveStatus = leaveCode;
                        if (currentDate === fromDate) {
                            leaveStatus = (leaveFromDay === 'First Half' || leaveFromDay === 'Second Half') ? `${leaveCode}/2` : leaveCode;
                        } else if (currentDate === toDate) {
                            leaveStatus = (leaveToDay === 'First Half' || leaveToDay === 'Second Half') ? `${leaveCode}/2` : leaveCode;
                        } else
                            leaveData[employeeId][currentDate] = leaveStatus;
                        const existingAttendance = await this.attendanceRepo.findOne({
                            where: {
                                empCode: employeeCode,
                                date: currentDate,
                            },
                        })
                        if (existingAttendance) {
                            existingAttendance.leaveStatus = leaveStatus;
                            await this.attendanceRepo.save(existingAttendance);
                        } else {
                            const newAttendance = new AttendanceEntity();
                            newAttendance.empId = employeeId;
                            // newAttendance.empName = empName;
                            newAttendance.empCode = employeeCode;
                            // newAttendance.departmentId = departmentId;
                            // newAttendance.designationId = designationId;
                            // newAttendance.divisionId = divisionId;
                            // newAttendance.branch = branchId;
                            newAttendance.attnStatus = "A";
                            // newAttendance.attendanceMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
                            newAttendance.date = this.formatDate(d);
                            newAttendance.leaveStatus = leaveStatus;

                            await this.attendanceRepo.save(newAttendance);
                        }
                    }
                }
                return new CommonResponseModel(true, 1, 'Data retrieved and attendance updated successfully', leaveData);
            } else {
                return new CommonResponseModel(true, 1, 'No data found', []);
            }
        } catch (err) {
            console.error("Error fetching leave data:", err);
            throw err;
        }
    }

    // Helper function to format date as 'YYYY-MM-DD'
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async updateApplyLeaveStatusApproved(@Body() req: any): Promise<CommonResponseModel> {
        try {
            const updateResult = await this.applyForLeaveRepository.update(
                { applyForLeavesId: In(req.applyForLeavesId) },
                { status: ApplyForLeaveStatusEnum.APPROVED, remarks: req.remarks }
            );
            if (updateResult.affected > 0) {
                const applyLeavesStatusReq = new ApplyLeavesStatusReq();
                // const data = new ApplyLeavesDto()
                // data.employeeId = req.employeeIds;
                // data.typeOfLeave = req.leaveTypeIds;
                // data.noOfDays = req.noOfDays;
                applyLeavesStatusReq.applyForLeavesId = req.applyForLeavesId
                const leaveDetails = await this.getAppliedForLeavesIdById(applyLeavesStatusReq);
                //const updateApproved = await this.allocationRepo.updateLeaveAllocationsApprovedBULK(data)
                return new CommonResponseModel(true, 1, 'Approved', leaveDetails);
            } else {
                return new CommonResponseModel(true, 1, 'No data found', []);
            }
        } catch (err) {
            throw err;
        }
    }

    async updateApplyLeaveStatusApprovedBulk(@Body() req: any): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource)
        await transactionManager.startTransaction();
        try {
            const data = new ApplyLeavesDto()
            const result = await transactionManager.getRepository(ApplyForLeavesEntity).update(
                { applyForLeavesId: In(req.applyForLeavesId) },
                { status: ApplyForLeaveStatusEnum.APPROVED }
            );
            if (result) {
                data.employeeId = req.employeeIds;
                data.typeOfLeave = req.leaveTypeIds;
                data.noOfDays = req.noOfDays;
            }
            const updateApproved = await this.allocationRepo.updateLeaveAllocationsApprovedBULK(data)
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1, "Approved and Detectued Successfully");
        } catch (error) {
            throw new CommonResponseModel(false, 0, "An error occurred",);
        } finally {
            await transactionManager.releaseTransaction();
        }
    }

    async updateApplyLeaveStatusRejected(@Body() req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.applyForLeaveRepository.update(
                { applyForLeavesId: In(req.applyForLeavesId) },
                { status: ApplyForLeaveStatusEnum.REJECTED, remarks: req.remarks }
            );
            if (result.affected > 0) {
                const updateRejected = await this.allocationRepo.updateNewLeaveAllocationsRejected(req)
                return new CommonResponseModel(true, 1, "Rejected Successfully");
            }
        } catch (error) {
            throw new CommonResponseModel(false, 0, "An error occurred",);
        }
    }

    async updateApplyLeaveStatusCanceled(@Body() req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.applyForLeaveRepository.update(
                { applyForLeavesId: In(req.applyForLeavesId) },
                { status: ApplyForLeaveStatusEnum.CANCEL, remarks: req.remarks }
            );

            if (result.affected > 0) {
                const updateRejected = await this.allocationRepo.updateNewLeaveAllocationsCancled(req)
                return new CommonResponseModel(true, 1, "Cancelled Successfully");
            } else {
                throw new CommonResponseModel(false, 0, "No records were updated");
            }
        } catch (error) {
            throw new CommonResponseModel(false, 0, "An error occurred",);
        }
    }

    async attendanceWiseSelectedEmployee(selectedEmployee): Promise<any> {
        console.log(selectedEmployee, "selectedEmployeeselectedEmployeeselectedEmployee")
        try {
            const activeEmployeesResponse = await this.getActiveEmployeesById();
            const attStatusResponse = await this.getAttStatusData();

            const activeEmployees = activeEmployeesResponse?.data.data || [];
            const attStatusData = attStatusResponse?.data || [];
            const attStatusModifiedData = attStatusData.map((i) => ({
                empId: i.empId,
                empCode: i.empCode,
                empName: i.empName,
                date: dayjs(i.date).format("DD-MM-YYYY"),
                attendanceStatus: i.attendanceStatus,
            }));
            console.log(attStatusModifiedData, "attStatusModifiedData")
            console.log(activeEmployees, "activeEmployees")
            const abc = attStatusModifiedData.find((a) => a.empId && a.empCode);
            const def = activeEmployees.find((a) => a.empId && a.employeeCode);

            let mhg;
            if (abc && def) {
                mhg = {
                    ...abc,
                    empId: def.empId,
                    empCode: def.employeeCode
                };
            }
            else {
                console.log("Error Thrown Data")
            }
            console.log(mhg, "mhg");
            const todaysDate = (date: Date): string => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const today = new Date();
            const submitDate = todaysDate(today);
            console.log(submitDate, "submitDatesubmitDate")

            const selectedEmployeeWithDate = {
                ...selectedEmployee,
                date: submitDate,
            };
            console.log(selectedEmployeeWithDate, "selectedEmployeeWithDate")
            const matchingEmployee = mhg.find(item =>
                item.empId === selectedEmployeeWithDate.empId &&
                item.date === selectedEmployeeWithDate.date
            );
            console.log(matchingEmployee, "mmmmmm")


            // if (!matchingEmployee) {
            //     //("No matching employee found");
            //     return true;
            // }

            // switch (matchingEmployee.attendanceStatus) {
            //     case "A":
            //         //("Attendance status: Absent");
            //         return true;
            //     case "CO":
            //     case "P":
            //         //("Attendance status: Checked Out or Present");
            //         return false;
            //     default:
            //         //("Unhandled attendance status");
            //         return false;
            // }
        } catch (error) {
            console.error("Error in attendanceWiseSelectedEmployee:", error);
            return error;
        }
    }


    async updateManualLeave(data: ApplyForLeavesDto): Promise<CommonResponseModel> {
        try {
            const manager = this.dataSource;
            const currDate = new Date();
            const date = currDate.getFullYear() + '-' + (Number(currDate.getMonth()) + 1) + '-' + currDate.getDate();

            const save = await this.applyForLeaveRepository.update({ applyForLeavesId: data.applyForLeavesId }, {
                leaveToDay: data.leaveToDay,
                leaveFromDay: data.leaveFromDay,
                noOfDays: data.noOfDays,
                leaveReason: data.leaveReason,
                leaveAddress: data.leaveAddress,
                typeOfLeave: data.typeOfLeave,
                fromDate: dayjs(data.fromDate).format('YYYY-MM-DD'),
                toDate: dayjs(data.toDate).format('YYYY-MM-DD')
            })

            const time = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
            const formattedFromDate = moment(data.fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(data.toDate).format('YYYY-MM-DD');
            const status = data.status
            const empReq = new EmployeeDetailsDto()
            const empNameResult = await this.employeeRepo.employeeNameQuery(empReq)
            const empName = empNameResult[0]?.first_name || 'Unknown';
            const leaveTypeReq = new ApplyLeavesStatusReq()
            const leaveTypeResult = await this.typeOfLeaveRepo.leaveTypeQuery(leaveTypeReq);
            const leaveType = leaveTypeResult[0]?.type_of_leave || 'Unknown';
            const mobileDataReq = new EmployeeDetailsDto()
            const mobileNumberQuery = await this.employeeRepo.mobileNumberQuery(mobileDataReq)
            const mobileNumber = mobileNumberQuery[0]?.mobile_no || 'Unknown';
            const parameters = [
                { "type": "text", "text": data.employeeCode },
                { "type": "text", "text": empName },
                { "type": "text", "text": leaveType },
                { "type": "text", "text": formattedFromDate },
                { "type": "text", "text": formattedToDate },
                { "type": "text", "text": status },
                { "type": "text", "text": data.leaveReason },
                { "type": "text", "text": date + " " + time }
            ]
            //(parameters, 99999999999999)
            let statusFlag = true
            const req = await new MessageParameters(mobileNumber, 'leave_approval_status', parameters, "en_us")
            const messageStatus = await this.wpService.sendMessageThroughFbApi(req);
            //(messageStatus)
            if (!messageStatus.status) {
                statusFlag = false
            } else {
                statusFlag = true
                const companyId = 7;
                const hrmsModuleId = 2;
                const whatsapplogDto = new WhatsAppLogDto(mobileNumber, 'l', 'Schemax', companyId, hrmsModuleId)
                // await this.wtsAppBroadCatService.createWhatappLog(whatsapplogDto)
            }

            if (save) {
                return new CommonResponseModel(true, 1, "Leave Updated SuccessFully")
            } else {
                throw new ErrorResponse(0, "Failed While Updating Leave")
            }
        } catch (error) {
            throw error;
        }
    }


    async CancleManualLeave(data: ApplyForLeavesDto): Promise<ApplyForLeavesResponseModel> {
        try {
            const save = await this.applyForLeaveRepository.update({ applyForLeavesId: data.applyForLeavesId }, { status: data.status });
            if (save) {
                return new CommonResponseModel(true, 1, "Leave Cancelled SuccessFully")
            } else {
                throw new ErrorResponse(0, "Failed While Cancel Leave ")
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllRMLeaves(req: any): Promise<CommonResponseModel> {
        try {
            const rawData = await this.applyForLeaveRepository.getAllRMLeaves(req);
            if (rawData) {
                console.log(rawData, '_____________________')
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', rawData);
            } else {
                return new CommonResponseModel(false, 0, 'Failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllRMData(): Promise<CommonResponseModel> {
        try {
            const data = await this.applyForLeaveRepository.getAllRMData();
            if (data) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            } else {
                return new CommonResponseModel(false, 0, 'Failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getReportingManagerData(req: any): Promise<CommonResponseModel> {

        try {
            const data = await this.applyForLeaveRepository.getReportingManagerData(req);
            if (data) {
                console.log(data, '++++++++++++++')
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            } else {
                return new CommonResponseModel(false, 0, 'Failed');
            }
        } catch (err) {
            console.log(err);
        }
    }


    async applyLeaveStatusApprovedByRmWhatsapp(@Body() req: any): Promise<CommonResponseModel> {
        try {
            if (!req.applyForLeavesId) {
                return new CommonResponseModel(false, 0, 'Invalid request: Missing applyForLeavesId');
            }

            const appliedLeave = await this.applyForLeaveRepository.findOne({
                where: { applyForLeavesId: req.applyForLeavesId }
            });

            if (!appliedLeave) {
                return new CommonResponseModel(false, 0, 'Leave not found');
            }

            if (appliedLeave.status === ApplyForLeaveStatusEnum.APPROVED) {
                return new CommonResponseModel(false, 0, 'Leave Already Approved');
            }

            if (appliedLeave.status === ApplyForLeaveStatusEnum.REJECTED) {
                return new CommonResponseModel(false, 0, 'Leave Already Rejected');
            }

            if (appliedLeave.status === ApplyForLeaveStatusEnum.CANCEL) {
                return new CommonResponseModel(false, 0, 'Leave Already Cancled');
            }

            const updateResult = await this.applyForLeaveRepository.update(
                { applyForLeavesId: req.applyForLeavesId },
                { status: ApplyForLeaveStatusEnum.APPROVED }
            );

            if (updateResult.affected && updateResult.affected > 0) {
                const applyLeavesStatusReq = new ApplyLeavesStatusReq();
                applyLeavesStatusReq.applyForLeavesId = [req.applyForLeavesId];

                const leaveDetails = await this.getAppliedForLeavesIdById(applyLeavesStatusReq);

                return new CommonResponseModel(true, 1, 'Leave approved successfully', appliedLeave.employeeId);
            } else {
                return new CommonResponseModel(false, 0, 'Failed to approve leave');
            }
        } catch (err) {
            console.error('Error approving leave:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }

    async applyLeaveStatusRejectedByRmWhatsapp(@Body() req: any): Promise<CommonResponseModel> {
        try {
            if (!req.applyForLeavesId) {
                return new CommonResponseModel(false, 0, 'Invalid request: Missing applyForLeavesId');
            }

            const apreq = new ApproveLeaveStatusReq
            apreq.applyForLeavesId = req.applyForLeavesId

            const appliedLeave = await this.applyForLeaveRepository.getAppliedForLeavesOpen(apreq);
            const leavedata = appliedLeave[0]

            if (!appliedLeave) {
                return new CommonResponseModel(false, 0, 'Leave not found');
            }

            if (leavedata.status === ApplyForLeaveStatusEnum.APPROVED) {
                return new CommonResponseModel(false, 0, 'Leave Already Approved');
            }

            if (leavedata.status === ApplyForLeaveStatusEnum.REJECTED) {
                return new CommonResponseModel(false, 0, 'Leave Already Rejected');
            }

            if (leavedata.status === ApplyForLeaveStatusEnum.CANCEL) {
                return new CommonResponseModel(false, 0, 'Leave Already Cancled');
            }

            const updateResult = await this.applyForLeaveRepository.update(
                { applyForLeavesId: req.applyForLeavesId },
                { status: ApplyForLeaveStatusEnum.REJECTED }
            );

            if (updateResult.affected && updateResult.affected > 0) {
                const leaveUpdateReq = {
                    applyForLeavesId: [req.applyForLeavesId],
                    employeeIds: [leavedata.employeeId],
                    leaveTypeIds: [leavedata.typeOfLeave],
                    noOfDays: [leavedata.noOfDays],
                    leaveGroupCodeId: [leavedata.leaveGroupCodeId],
                    dates: [await this.getMonthDays(
                        dayjs(leavedata.fromDate).format('DD-MM-YYYY'),
                        dayjs(leavedata.toDate).format('DD-MM-YYYY'),
                        leavedata.leaveFromDay, leavedata.leaveToDay, leavedata.noOfDays
                    )],
                    status: ApplyForLeaveStatusEnum.REJECTED,
                    createdMonth: [leavedata.createdAt]
                };

                const updateRejected = await this.allocationRepo.updateNewLeaveAllocationsRejected(leaveUpdateReq)
                return new CommonResponseModel(true, 1, 'Leave rejected', leavedata.employeeId);
            } else {
                return new CommonResponseModel(false, 0, 'Failed to reject leave');
            }
        } catch (err) {
            console.error('Error approving leave:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }


    }

    async getMobileNoByEmpCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            const appliedLeave = await this.applyForLeaveRepository.getMobileNoByEmpCode(req)
            return new CommonResponseModel(true, 1, 'mobile number', appliedLeave);
        } catch (err) {
            console.error('Error approving leave:', err);
            return new CommonResponseModel(false, 0, 'Internal server error');
        }
    }

}
