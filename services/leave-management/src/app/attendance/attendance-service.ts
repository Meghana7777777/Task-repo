import { ApplyLeavesStatusReq, AppyCoODUploadColumns, AttenCoOffDto, AttnAdjustmentCreateReq, CommonResponseModel, CreateAttendanceSwipeResponse, DashboardReq, EmailRequest, EmployeeCodeReq, EmployeeDetailsDto, EmployeeViewResponseModel, EmployeIdReq, ErrorResponse, HolidayReqForGenerateSwipe, lateMinReq, LeavePolicyDto, MessageParameters, OTBulkApprovalReq, ReportingManagerReq, UnitIdReq } from '@hrexpert/shared-models';
import { EmailSendingService, EmpAttendanceSrcCardReq, EmployeeFilterReq, EmployeeOnboardingService, HolidayCalanderService, LeavePolicyService, MonthWIseEmpReportReq, PayrollAttendanceSharedService, ShiftService, TypesOfLeavesService, WeekOffLeavesService, WhatsUpService } from '@hrexpert/shared-services';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { ApprovalStatusEnum, CartonShortageStatus, LateMinRecordsEnum, LateMinRecStatusEnum } from 'libs/shared-models/src/lib/enums';
import moment from 'moment';
import { Between, DataSource, In, Repository } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { ShiftChangeRepository } from '../shift-change/repository/shift-change-repo';
import { TeamCalenderRepository } from '../team-calender/repository/team-calender.repository';
import { AttendanceLogRepo } from './dto/attedance-log-repo';
import { AttendanceAdjustment } from './dto/attendance-adjustment.entity';
import { AttendanceAdjustRequest } from './dto/attendance-adjustment.request';
import { AttendanceDto } from './dto/attendance-dto';
import { AttendanceEntity } from './dto/attendance-entity';
import { AttendanceRepo } from './dto/attendance-repo';
import { AttendanceSwipes } from './dto/attendance-swipes-entity';
import { AttnAdjustLogReq } from './dto/attn-adjust-log.request';
import { AttendanceUpdateRequest } from './dto/attn-update.request';
import { CreateAttendanceSwipeDto } from './dto/create-attendance-swipes.dto';
import { MonthReq } from './dto/month-req';
import { OTApprovalLog } from './dto/ot-approval-log';
import { OTApprovalLogRepo } from './dto/ot-approval-log-repo';
import { OTBulkApprovalDto } from './dto/ot-bulkapproval-dto';
import { PayRollAttnDto } from './dto/payroll-attendance-dto';
import { ApplyCoOdUploadEntity } from './entity/apply-co-od-upload.entity';
import { ConsolidatedAttendanceLogEntity } from './entity/consoladate-attendance-logs.entity';
import { AppyCoOdUploadRepository } from './repo/apply-co-od-upload.repo';
import { AttendanceAdjustmentRepoRepository } from './repo/attendance-adjustment-repo';
import { AttendanceSwipesRepository } from './repo/attendance-swipes.repository';
import { ConsolidatedAttendanceLogRepository } from './repo/consolidated-attendance-log.repository';
// import { EmpAttendanceSrcCard } from './dto/emp-attedance-score-card';
import * as XLSX from 'xlsx';
import { LeaveAllocations } from '../leave-allocation/entities/leave-allocation-entity';
import { LeaveAllocationsLog } from '../leave-allocation/entities/leave-allocation-log.entity';
import { AttendanceStatusRepository } from '../attendance-status-configuration/repositories/attendance-status-repo';
import { TypesOfLeavesDTO } from 'services/masters/src/app/types-of-leaves/dto/types-of-leave.dto';
import { LeaveAllocationsRepository } from '../leave-allocation/repos/leave-allocation-repository';
import { EmployeeReq } from '../leave-allocation/dto/leave-history-report-dto';
import { AttendanceDateDto } from './dto/attendance-date-dto';
import { AttendanceDateBetweenDto } from './attendance-date-between-dto';
import axios from 'axios';
import { log } from 'console';
import { LeaveTypeMasterEntity } from '../leave-type-master/entities/leave-type.entity';
import { NewLeaveAllocationsEntity } from '../leave-type-master/entities/new-leave-allocations-entity';
import { EmployeeDetailRepository } from 'services/employee-management/src/app/employee-onboarding/repositorys/employee-details-repo';
import isBetween from 'dayjs/plugin/isBetween';
import { LateMinMomentRecordsRepository } from './repo/late-min-moment-records.repo';
import { lateMinutesRecordsEntity } from './entity/late-minutes-moment-records-entity';

dayjs.extend(isBetween);

@Injectable()
export class AttendanceService {

    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        private attendanceRepo: AttendanceRepo,
        private attendanceSwipesRepo: AttendanceSwipesRepository,
        private employeeService: EmployeeOnboardingService,
        private holidayService: HolidayCalanderService,
        private otApprovalLogRepo: OTApprovalLogRepo,
        private applyCoOdRepo: AppyCoOdUploadRepository,
        private consolidatedAttendanceLogRepo: ConsolidatedAttendanceLogRepository,
        private attnLogRepo: AttendanceLogRepo,
        private teamCalnderRepo: TeamCalenderRepository,
        private shiftsService: ShiftService,
        private whatsService: WhatsUpService,
        private weekOffService: WeekOffLeavesService,
        private attnAdjustmentRepo: AttendanceAdjustmentRepoRepository,
        private shiftChangeRepo: ShiftChangeRepository,
        private empService: EmployeeOnboardingService,
        private payrollAttnService: PayrollAttendanceSharedService,
        private attendanceStatusRepository: AttendanceStatusRepository,
        private leavePolicyService: LeavePolicyService,
        private leaveAllocation: LeaveAllocationsRepository,
        private emailSerive: EmailSendingService,
        @InjectRepository(LeaveTypeMasterEntity)
        private readonly leaveTypeEntityRepo: Repository<LeaveTypeMasterEntity>,
        @InjectRepository(NewLeaveAllocationsEntity)
        private readonly newLeaveAllocationRepo: Repository<NewLeaveAllocationsEntity>,
        private lateMinMomentRecordsRepo: LateMinMomentRecordsRepository,



    ) { }

    private getDaysAndDates(year: string, month: string): { day: string; date: string }[] {
        const daysInMonth = dayjs(`${year}-${month}`).daysInMonth();
        const result = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = dayjs(`${year}-${month}-${day.toString().padStart(2, '0')}`);
            result.push({
                day: date.format('dddd'), // Day name
                date: date.format('YYYY-MM-DD'), // Full date
            });
        }

        return result;
    }

    // async getAllEmpMonthWiseData(req: MonthWIseEmpReportReq, isExcel: boolean): Promise<CommonResponseModel> {
    //     const { year, month, page = 1, pageSize = 10 } = req;

    //     const empCodeData = await this.empService.getActiveEmployeeList();
    //     const activeEmployees = empCodeData?.data || [];
    //     const empCodes = activeEmployees.map((emp) => emp.employeeCode);

    //     const [rawData, totalCount] = await this.attendanceRepo.getAllEmpMonthWiseData({
    //         ...req,
    //         empCodes,
    //         page,
    //         pageSize,
    //     }, isExcel);

    //     if (!Array.isArray(rawData)) {
    //         return new CommonResponseModel(false, 0, 'Invalid data format', { data: [], totalCount: 0 });
    //     }

    //     if (rawData.length === 0) {
    //         return new CommonResponseModel(false, 0, 'No data found', { data: [], totalCount: 0 });
    //     }
    //     const totalDays = dayjs(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    //     const data = [];

    //     for (const rec of rawData) {
    //         const findEmployeAttendenceData = await this.attendanceRepo.getAttendceWithEmpIdAndDate(req.month, req.year, rec.emp_id);
    //         const daysAndDates = [];

    //         let presentCount = 0;
    //         let leaveCount = 0;
    //         let absentCount = 0;
    //         let coCount = 0;
    //         let odCount = 0;
    //         let wpCount = 0;
    //         let woCount = 0;
    //         let otHours = 0;
    //         let holidayCount = 0;
    //         let hpCount = 0;
    //         let payDays = 0;
    //         let allowanceDays = 0;
    //         for (const attendance of findEmployeAttendenceData) {
    //             const status = attendance.attn_status?.trim().toUpperCase();
    //             const leaveStatus = attendance.leave_status?.trim().toUpperCase();
    //             const day = dayjs(attendance.date).format('dddd');
    //             const date = dayjs(attendance.date).format('DD');

    //             daysAndDates.push({
    //                 [day + " " + date]: status + (leaveStatus !== "A" ? ` (${leaveStatus})` : '')
    //             });

    //             if (status === 'P') {
    //                 presentCount += 1;
    //             } else if (status === 'P/2') {
    //                 presentCount += 0.5;
    //                 absentCount += 0.5;
    //             } else if (status === 'A') {
    //                 absentCount += 1;
    //             }

    //             if (leaveStatus !== 'A' && status == 'A') {
    //                 if (leaveStatus.endsWith('/2')) {
    //                     leaveCount += 0.5; // Half-day leave
    //                 } else {
    //                     leaveCount += 1; // Full-day leave
    //                 }
    //             }

    //             if (status === 'CO') {
    //                 coCount++;
    //             } else if (status === 'OD') {
    //                 odCount++;
    //             }
    //             else if (['W', 'w'].includes(status)) {
    //                 woCount += 1;
    //             } else if (['WP', 'wp'].includes(status)) {
    //                 wpCount += 1;
    //             } else if (['WP/2', 'wp/2'].includes(status)) {
    //                 wpCount += 0.5;
    //                 woCount += 0.5;
    //             } else if (status === 'OT') {
    //                 otHours++;
    //             } else if (['H', 'h'].includes(status)) {
    //                 holidayCount += 1;
    //             } else if (['HP', 'hp'].includes(status)) {
    //                 hpCount += 1;
    //             } else if (['HP/2', 'hp/2'].includes(status)) {
    //                 hpCount += 0.5;
    //                 holidayCount += 0.5
    //             }
    //         }
    //         const monthDays = totalDays;
    //         if (rec.employeeType === 'EMPLOYEE') {
    //             if (presentCount === 0 && woCount === 0 && wpCount === 0 && hpCount === 0 && holidayCount === 0) {
    //                 payDays = 0;
    //             } else {
    //                 if (monthDays <= 30) {
    //                     payDays = 30 - absentCount;
    //                 } else if (monthDays === 31) {
    //                     payDays = absentCount <= 15 ? 30 - absentCount : 31 - absentCount;
    //                 }
    //             }
    //         } else if (rec.employeeType === 'WORKER') {
    //             payDays = presentCount + woCount + holidayCount + wpCount + hpCount;
    //             allowanceDays = wpCount + hpCount;
    //         } else if (rec.employeeType === 'KARLAM WORKER') {
    //             payDays = presentCount + leaveCount + woCount + wpCount + holidayCount + hpCount;
    //             allowanceDays = wpCount + hpCount;
    //         }

    //         allowanceDays = wpCount + hpCount;

    //         const result = daysAndDates.reduce((a, c) => Object.assign(a, c), {});

    //         data.push({
    //             id: rec.emp_id,
    //             empCode: rec.empCode,
    //             empName: rec.empName,
    //             employeeType: rec.employeeType,
    //             department: rec.department,
    //             divisionName: rec.divisionName,
    //             branches: rec.branchName,
    //             attendanceMonthAndYear: rec.attendance_month,
    //             daysAndDates: result,
    //             P: presentCount,
    //             A: absentCount,
    //             "WP": wpCount,
    //             "WO": woCount,
    //             "H": holidayCount,
    //             "HP": hpCount,
    //             od: odCount,
    //             l: leaveCount,
    //             co: coCount,
    //             nop: 0,
    //             lop: 0,
    //             totalDays: totalDays,
    //             totalPayableDays: payDays,
    //             totalAllowanceDays: allowanceDays,
    //         });
    //     }

    //     return new CommonResponseModel(true, 1, 'Data retrieved successfully', data, totalCount);
    // }

    async getAllEmpMonthWiseData(req: MonthWIseEmpReportReq, isExcel: boolean): Promise<CommonResponseModel> {
        const { year, month, page = 1, pageSize = 10, attendanceMonth } = req;

        const empCodeData = await this.empService.getActiveEmployeeList({ employeeTypeId: req.employeeTypeId });
        const activeEmployees = empCodeData?.data || [];
        const empCodes = activeEmployees.map((emp) => emp.employeeCode);

        const [rawData, totalCount] = await this.attendanceRepo.getAllEmpMonthWiseData({
            ...req,
            empCodes,
            page,
            pageSize,
        }, isExcel);

        if (!Array.isArray(rawData)) {
            return new CommonResponseModel(false, 0, 'Invalid data format', { data: [], totalCount: 0 });
        }

        if (rawData.length === 0) {
            return new CommonResponseModel(false, 0, 'No data found', { data: [], totalCount: 0 });
        }
        const totalDays = dayjs(`${year}-${month}`, 'YYYY-MM').daysInMonth();
        const data = [];

        for (const rec of rawData) {
            const findEmployeAttendenceData = await this.attendanceRepo.getAttendceWithEmpIdAndDate(req.month, req.year, rec.emp_id);
            const daysAndDates = [];
            let presentCount = 0;
            let leaveCount = 0;
            let absentCount = 0;
            let coCount = 0;
            let odCount = 0;
            let wpCount = 0;
            let woCount = 0;
            let otHours = 0;
            let holidayCount = 0;
            let hpCount = 0;
            let payDays = 0;
            let allowanceDays = 0;
            let countOfAbsentData = 0;
            for (const attendance of findEmployeAttendenceData) {
                const status = attendance.attn_status?.trim().toUpperCase();
                const leaveStatus = attendance.leave_status?.trim().toUpperCase();
                const day = dayjs(attendance.date).format('dddd');
                const date = dayjs(attendance.date).format('DD');

                daysAndDates.push({
                    [day + " " + date]: status + (leaveStatus !== "A" ? ` (${leaveStatus})` : '')
                });

                if (status === 'P') {
                    presentCount += 1;
                } else if (status === 'P/2') {
                    presentCount += 0.5;
                    countOfAbsentData += 0.5;
                }

                if (status === 'A') {
                    countOfAbsentData += 1;
                } else if (status === null || status === undefined) {
                    countOfAbsentData += 1;
                }

                if (leaveStatus !== 'A' || leaveStatus == null) {
                    if (leaveStatus.endsWith('/2')) {
                        leaveCount += 0.5
                    } else {
                        leaveCount += 1
                    }
                }
                absentCount = countOfAbsentData - leaveCount
                if (status === 'CO') {
                    coCount++;
                } else if (status === 'OD') {
                    odCount++;
                }
                else if (['W', 'w'].includes(status)) {
                    woCount += 1;
                } else if (['WP', 'wp'].includes(status)) {
                    wpCount += 1;
                } else if (['WP/2', 'wp/2'].includes(status)) {
                    wpCount += 0.5;
                    woCount += 0.5;
                } else if (status === 'OT') {
                    otHours++;
                } else if (['H', 'h'].includes(status)) {
                    holidayCount += 1;
                } else if (['HP', 'hp'].includes(status)) {
                    hpCount += 1;
                } else if (['HP/2', 'hp/2'].includes(status)) {
                    hpCount += 0.5;
                    holidayCount += 0.5
                }
            }
            const monthDays = totalDays;
            if (rec.employeeType === 'EMPLOYEE') {
                if (presentCount == 0) {
                    payDays = 0;
                } else {
                    const payDaysTemp = presentCount + woCount + holidayCount + wpCount + hpCount + leaveCount;
                    console.log(payDaysTemp, "payDaysTemp")
                    if (monthDays <= 30) {
                        payDays = 30 - countOfAbsentData + leaveCount;
                    } else if (monthDays === 31) {
                        payDays = 30 - countOfAbsentData + leaveCount;
                    }
                }
            } else if (rec.employeeType === 'WORKER') {
                payDays = presentCount + woCount + holidayCount + wpCount + hpCount;
                allowanceDays = wpCount + hpCount;
            } else if (rec.employeeType === 'KARLAM WORKER') {
                payDays = presentCount + leaveCount + woCount + wpCount + holidayCount + hpCount + leaveCount;
                allowanceDays = wpCount + hpCount;
            }

            allowanceDays = wpCount + hpCount;

            const result = daysAndDates.reduce((a, c) => Object.assign(a, c), {});

            data.push({
                id: rec.emp_id,
                empCode: rec.empCode,
                empName: rec.empName,
                employeeType: rec.employeeType,
                department: rec.department,
                divisionName: rec.divisionName,
                branches: rec.branchName,
                attendanceMonthAndYear: rec.attendance_month,
                daysAndDates: result,
                P: presentCount,
                A: absentCount,
                "WP": wpCount,
                "WO": woCount,
                "H": holidayCount,
                "HP": hpCount,
                od: odCount,
                l: leaveCount,
                co: coCount,
                nop: 0,
                lop: 0,
                totalDays: totalDays,
                totalPayableDays: payDays,
                totalAllowanceDays: allowanceDays,
                totalLateMins: rec.totalLateMins,
                exemptionMins: Number(presentCount) * 5,
                afterDeductionMins: Number(Number(presentCount) * 5) - Number(rec.totalLateMins),
                deductionInDays: Number(Number(presentCount) * 5) - Number(rec.totalLateMins) < 0 ? (await this.deductionInDays(presentCount, rec.totalLateMins)).toFixed(1) : 0,
                clAvailable: rec.available,
                finalDeductionInDays: Number(Number(presentCount) * 5) - Number(rec.totalLateMins) < 0 ? ((Math.abs(await this.deductionInDays(presentCount, rec.totalLateMins))) - Number(rec.available)).toFixed(1) : 0

            });
        }

        return new CommonResponseModel(true, 1, 'Data retrieved successfully', data, totalCount);
    }

    async deductionInDays(presentCount: number, totalLateMins: number): Promise<any> {
        const result = Math.abs((Number(presentCount) * 5 - Number(totalLateMins)) / 60)

        const decimalPart = result % 1;

        if (decimalPart >= 0.1 && decimalPart <= 0.5) {
            return Math.floor(result) + 0.5;
        } else if (decimalPart > 0.5) {
            return Math.ceil(result);
        } else {
            return Math.floor(result);
        }
    };

    async getAllEmpWeekWiseData(req: MonthWIseEmpReportReq, isExcel: boolean): Promise<CommonResponseModel> {
        const { year, month, page = 1, pageSize = 10 } = req;
        // console.log(`Page: ${page}, PageSize: ${pageSize}`);
        const empCodeData = await this.empService.getActiveEmployeeList();
        const activeEmployees = empCodeData?.data || [];
        const empCodes = activeEmployees.map((emp) => emp.employeeCode);

        const [rawData, totalCount] = await this.attendanceRepo.getAllEmpWeekWiseData({
            ...req,
            empCodes,
            page,
            pageSize,
        }, isExcel);

        if (!Array.isArray(rawData)) {
            // console.error('Invalid rawData format:', rawData);
            return new CommonResponseModel(false, 0, 'Invalid data format', { data: [], totalCount: 0 });
        }

        if (rawData.length === 0) {
            return new CommonResponseModel(false, 0, 'No data found', { data: [], totalCount: 0 });
        }

        const data = []
        for (const rec of rawData) {
            const findEmployeAttendenceData = await this.attendanceRepo.getAttendanceWeekWiseWithEmpIdAndDate(req.month, req.year, rec.emp_id, req.attnFromDate, req.attnToDate)
            const daysAndDates = []
            let presentCount = 0;
            let leaveCount = 0;
            let absentCount = 0;
            let coCount = 0;
            let odCount = 0;
            let wpCount = 0;
            let woCount = 0;
            let otHours = 0;
            let holidayCount = 0;
            let hpCount = 0;
            let payDays = 0;
            let allowanceDays = 0;
            for (const attendence of findEmployeAttendenceData) {
                const status = attendence.attn_status?.trim().toUpperCase()
                const day = dayjs(attendence.date).format('dddd');
                const date = dayjs(attendence.date).format('DD');
                daysAndDates.push({
                    [day + " " + date]: status
                });

                if (status === 'P') {
                    presentCount++;
                }
                if (status === 'A') {
                    absentCount++;
                }
                if (status === 'L') {
                    leaveCount++;
                }
                if (status === 'CO') {
                    coCount++;
                }
                if (status === 'OD') {
                    odCount++;
                }
                if (['WP', 'W', 'w', 'wp'].includes(status)) {
                    wpCount++;
                }
                if (status === 'OT') {
                    otHours++;
                }
                if (['H', 'HP', 'h', 'hp'].includes(status)) {
                    holidayCount++;
                }
                if (['HP', 'hp'].includes(status)) {
                    hpCount++;
                }
            }
            if (rec.employeeType === 'WEEKLY EMPLOYEE') {
                payDays = presentCount + woCount + holidayCount + wpCount + hpCount;
                allowanceDays = wpCount + hpCount
            }
            allowanceDays = wpCount + hpCount;
            // console.log(findEmployeAttendenceData,'findEmployeAttendenceData');
            // console.log(daysAndDates, rec.empName)
            const result = daysAndDates.reduce((a, c) => Object.assign(a, c), {});
            data.push({
                id: rec.emp_id,
                empCode: rec.empCode,
                empName: rec.empName,
                employeeType: rec.employeeType,
                department: rec.department,
                divisionName: rec.divisionName,
                branches: rec.branchName,
                attendanceMonthAndYear: rec.attendance_month,
                daysAndDates: result,
                P: presentCount,
                "W / WP": wpCount,
                "PH / PHP": holidayCount,
                od: odCount,
                l: leaveCount,
                co: coCount,
                nop: 0,
                lop: absentCount,
                totalDays: presentCount,
                totalPayableDays: payDays,
                totalAllowanceDays: allowanceDays,

            });
        }

        return new CommonResponseModel(true, 1, 'Data retrieved successfully', data, totalCount);
    }

    // async excelDownload(values): Promise<Buffer> {
    //     console.log(values, '-------------------sssssss----------');
    //     const res = await this.getAllEmpMonthWiseData(values, true);
    //     console.log(res.data, '-------------------sssssss----------');
    //     // Transform data to include daysAndDates as separate columns
    //     const transformedData = res.data.map(item => {
    //         const daysAndDatesFlattened = item.daysAndDates
    //             ? Object.fromEntries(
    //                 Object.entries(item.daysAndDates).map(([key, value]) => [`Day ${key}`, value])
    //             )
    //             : {};

    //         return { ...item, ...daysAndDatesFlattened };
    //     });

    //     // Create a worksheet
    //     const ws = XLSX.utils.json_to_sheet(transformedData);

    //     // Create a workbook
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    //     // Save the workbook to a buffer
    //     const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    //     return buffer;
    // }

    async excelDownload(values): Promise<Buffer> {
        const res = await this.getAllEmpMonthWiseData(values, true);

        if (!res.data || res.data.length === 0) {
            throw new Error('No data available for export.');
        }

        const startingColumns = [
            { title: 'Employee Code', dataIndex: 'empCode' },
            { title: 'Employee Name', dataIndex: 'empName' },
            { title: 'Department', dataIndex: 'department' },
            { title: 'Division', dataIndex: 'divisionName' },
            { title: 'Branch', dataIndex: 'branches' },
        ];

        const endingColumns = [
            { title: 'P', dataIndex: 'P' },
            { title: 'W', dataIndex: 'WO' },
            { title: 'WP', dataIndex: 'WP' },
            { title: 'H', dataIndex: 'H' },
            { title: 'HP', dataIndex: 'HP' },
            { title: 'OD', dataIndex: 'od' },
            { title: 'L', dataIndex: 'l' },
            //{ title: 'CO', dataIndex: 'co' },
            { title: 'NOP', dataIndex: 'nop' },
            { title: 'A', dataIndex: 'A' },
            { title: "Late Mins", dataIndex: "totalLateMins", },
            { title: "Exempt Mins", dataIndex: "exemptionMins", },
            { title: "Post Deduct Mins", dataIndex: "afterDeductionMins", },
            { title: "Deduct Days", dataIndex: "deductionInDays", },
            { title: "CL", dataIndex: "clAvailable", },
            { title: "Final Deduct Days", dataIndex: "finalDeductionInDays", },
            { title: 'Total Days', dataIndex: 'totalDays' },
            { title: 'Total Payable Days', dataIndex: 'totalPayableDays' },
        ];

        const daysAndDates = await this.getDaysAndDates(values.year, values.month);
        const formattedDynamicColumns = daysAndDates.map(dateInfo => ({
            title: `${dateInfo.day} ${dateInfo.date.split('-')[2]}`,
            dataIndex: `${dateInfo.day} ${dateInfo.date.split('-')[2]}`,
            render: (text) => text || "-",
            align: "center",
            width: 30,
        }));

        const allColumns = [...startingColumns, ...formattedDynamicColumns, ...endingColumns];

        const processedData = res.data.map((record, index) => {
            const updatedRecord: Record<string, any> = { Sno: index + 1 };

            allColumns.forEach(({ dataIndex, title }) => {
                if (dataIndex in record) {
                    updatedRecord[title] = record[dataIndex];
                } else if (record.daysAndDates && dataIndex in record.daysAndDates) {
                    updatedRecord[title] = record.daysAndDates[dataIndex];
                } else {
                    updatedRecord[title] = "-";
                }
            });

            return updatedRecord;
        });

        const ws = XLSX.utils.json_to_sheet(processedData);
        const adjustColumnWidths = (data: any[]) => {
            if (!data.length) return [];
            return Object.keys(data[0]).map((key) => {
                const maxLength = Math.max(
                    key.length,
                    ...data.map((row) => row[key] ? row[key].toString().length : 0)
                );
                return { wch: maxLength + 5 };
            });
        };
        ws["!cols"] = adjustColumnWidths(processedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

        return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    }

    async getAllAttendance(req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        const countReq = new EmployeeFilterReq()
        const data = await this.attendanceRepo.getAllAttendance(req)
        // const totalCount = await this.attendanceRepo.countAllEmployees(countReq);
        if (data.length > 0) {
            data.forEach((item: any) => {
                const fromDate = new Date(item.attendanceDate);
                const localTimeFromDate = new Date(fromDate.getTime() - new Date().getTimezoneOffset() * 60000);
                item.attendanceDate = localTimeFromDate.toISOString().split('T')[0];
            });

            // return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            return new EmployeeViewResponseModel(
                true,
                1,
                'Data retrieved successfully',
                data,
            );

        } else {
            return new EmployeeViewResponseModel(
                false,
                11,
                'Data not found as per your filtration',
            );
        }
    }

    async createAttendanceSwipes(data: CreateAttendanceSwipeDto[]): Promise<CreateAttendanceSwipeResponse> {

        try {
            const swipeRecords = data.map((swipe) =>
                this.attendanceSwipesRepo.create(swipe),
            );
            const savedAttenDanceLogSwipeEntity = await this.attendanceSwipesRepo.save(swipeRecords);
            for (const swipe of savedAttenDanceLogSwipeEntity) {
                await this.insertConsolidatedLog(swipe);
            }
            return new CreateAttendanceSwipeResponse("Swipes saved sucessfully", 1111);
        } catch (error) {
            if (error.code === '23505') {
                // Assuming 23505 is a unique violation code (e.g., duplicated entry for card_number)
                throw new BadRequestException('Duplicate entry detected for one or more swipe records.');
            } else {
                // Log the error for debugging purposes
                console.error(`Failed to save attendance swipes: ${error.message}`, error);
                throw new InternalServerErrorException('An error occurred while saving the attendance swipe data.');
            }
        }
    }

    async insertConsolidatedLog(attnLog: AttendanceSwipes) {
        // Fetch the consolidated log for the employee and swipe date
        let consolidatedLog = await this.consolidatedAttendanceLogRepo.findOne({
            where: { employeeCode: attnLog.employeeNumber, logDate: attnLog.swipeDate },
        });

        // If the consolidated log does not exist, create a new one
        if (!consolidatedLog) {
            consolidatedLog = new ConsolidatedAttendanceLogEntity();
            consolidatedLog.employeeName = attnLog.employeeName;
            consolidatedLog.employeeCode = attnLog.employeeNumber;
            consolidatedLog.logDate = attnLog.swipeDate;
            consolidatedLog.totalHours = "00:00"; // Initialize total hours
            consolidatedLog = await this.consolidatedAttendanceLogRepo.save(consolidatedLog);
        }

        // Update the consolidated log with the swipe data
        await this.updateInTimeRecords(attnLog, consolidatedLog);
    }

    async updateInTimeRecords(attnLog: AttendanceSwipes, consolidatedLog: ConsolidatedAttendanceLogEntity) {
        if (!consolidatedLog) {
            throw new ErrorResponse(13343, 'khdkfhsakdhkshdkhsad')
        }
        const logDate: any = moment(`${attnLog.swipeDate} ${attnLog.swipeTime}`, 'YYYY-MM-DD HH:mm:ss').toDate();

        let totalHours = moment.duration(consolidatedLog.totalHours || '00:00');
        // Insert the in  punches into the consolidated log
        for (let i = 1; i <= 6; i++) {
            if (attnLog.inOut.toLowerCase() === 'in') {
                if (!consolidatedLog[`inTime${i}`]) {
                    consolidatedLog[`inTime${i}`] = logDate;
                    break;
                }
            }
        }

        // Adjust for missing "in" punches between two "out" punches
        for (let i = 1; i <= 5; i++) {
            if (consolidatedLog[`outTime${i}`] && !consolidatedLog[`inTime${i + 1}`]) {
                // let inTimeZero = new Date(consolidatedLog[`outTime${i}`]);
                // inTimeZero.setHours(0, 0, 0, 0);
                consolidatedLog[`inTime${i + 1}`] = '-';
                break;
            }
        }


        for (let i = 1; i <= 5; i++) {
            if (consolidatedLog[`inTime${i}`] && !consolidatedLog[`outTime${i}`] && consolidatedLog[`inTime${i + 1}`]) {
                // Use a placeholder string with "zeroed" date and time
                consolidatedLog[`outTime${i}`] = '-'; // Custom format as a string
                break;
            }
        }

        // Ensure the latest out punch is recorded correctly
        if (attnLog.inOut.toLowerCase() === 'out') {
            for (let i = 1; i <= 6; i++) {
                if (!consolidatedLog[`outTime${i}`] && consolidatedLog[`inTime${i}`]) {
                    consolidatedLog[`outTime${i}`] = logDate;

                    // Calculate the hours for this in/out pair and add to totalHours
                    const inTime = moment(consolidatedLog[`inTime${i}`]);
                    const outTime = moment(consolidatedLog[`outTime${i}`]);

                    if (!(inTime.hours() === 0 && inTime.minutes() === 0)) {
                        const duration = moment.duration(outTime.diff(inTime));
                        totalHours.add(duration);
                    }

                    consolidatedLog.totalHours = this.formatDuration(totalHours);
                    break;
                }
            }
        }


        await this.consolidatedAttendanceLogRepo.save(consolidatedLog);
    }

    private formatDuration(duration: moment.Duration): string {
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    async processSwipes() {
        const rawSwipes = await this.attendanceSwipesRepo.find()
        for (const swipe of rawSwipes) {
            // const isInSwipeExist = await this.attendanceRepo.find({ where: { empId: swipe.employeeName } })
        }
    }

    async generateAttendanceRecords(req: AttendanceDateDto): Promise<CommonResponseModel> {
        try {
            const employeeListRes = await this.employeeService.getAllActiveEmpForAttendances();
            const { data: employees } = employeeListRes;

            if (!employees || employees.length === 0) {
                return new CommonResponseModel(false, 4001, "No active employees found.");
            }

            const generationDate = dayjs(req.date).format("YYYY-MM-DD");
            const currentYearMonth = dayjs(req.date).format("YYYY-MM-DD");

            const branchEmployeeMap = new Map();
            employees.forEach((emp) => {
                if (!branchEmployeeMap.has(emp.branchId)) {
                    branchEmployeeMap.set(emp.branchId, []);
                }
                branchEmployeeMap.get(emp.branchId)?.push(emp);
            });

            // Fetch holidays for all branches
            const holidayPromises = Array.from(branchEmployeeMap.keys()).map((branchId) => {
                const holidayReq = new HolidayReqForGenerateSwipe(branchId, generationDate);
                return this.holidayService.getActiveWeekOffAndHolidays(holidayReq);
            });

            const holidayResults = await Promise.all(holidayPromises);
            const holidayMap = new Map();

            holidayResults.forEach((res, index) => {
                const branchId = Array.from(branchEmployeeMap.keys())[index];
                const holidaysAndWeekOffs = res?.data || [];

                holidaysAndWeekOffs.forEach((h) => {
                    holidayMap.set(`${h.holidayDate}-${branchId}`, h.type.toUpperCase());
                });
            });

            // Fetch existing attendance records **once** to avoid multiple DB calls
            const employeeCodes = employees.map(emp => emp.employeeCode);
            const existingAttendances = await this.attendanceRepo.find({
                where: {
                    empCode: In(employeeCodes),
                    date: generationDate,
                },
            });

            // Normalize existing records: Convert only "w" prefixed codes to uppercase
            const existingAttendanceSet = new Set(
                existingAttendances.map(att => `${normalizeEmpCode(att.empCode)}-${att.date}`)
            );

            const attendanceRecords = [];

            for (const emp of employees) {
                const holidayKey = `${generationDate}-${emp.branchId}`;
                const dayType = holidayMap.get(holidayKey);
                let attendanceStatus = "A";

                if (dayType === "WEEK OFF") {
                    attendanceStatus = "W"; // Week-off
                } else if (["PUBLIC HOLIDAY", "NATIONAL HOLIDAY", "OPTIONAL HOLIDAY"].includes(dayType)) {
                    attendanceStatus = "H"; // Holiday
                }

                // Normalize empCode selectively
                const normalizedEmpCode = normalizeEmpCode(emp.employeeCode);

                // Skip if attendance already exists
                if (existingAttendanceSet.has(`${normalizedEmpCode}-${generationDate}`)) {
                    // console.log(`Skipping existing attendance for Employee: ${emp.employeeId}, Date: ${generationDate}`);
                    continue;
                }

                attendanceRecords.push({
                    attnStatus: attendanceStatus,
                    date: generationDate,
                    empId: emp.employeeId,
                    empCode: normalizedEmpCode, // Store it in normalized format
                    empName: emp.employeeName,
                    inTime: null,
                    outTime: null,
                    freezeStatus: "N",
                    leaveStatus: "A",
                    departmentId: emp.departmentId,
                    designationId: emp.designationId,
                    divisionId: emp.divisionId,
                    attendanceMonth: currentYearMonth,
                    branch: emp.branchId,
                    shift: emp.shift || null,
                });
            }

            if (attendanceRecords.length > 0) {
                const batchSize = 500;
                for (let i = 0; i < attendanceRecords.length; i += batchSize) {
                    const batch = attendanceRecords.slice(i, i + batchSize);
                    await this.attendanceRepo.save(batch);
                }
                // console.log("Attendance records saved successfully.");
            } else {
                console.log("No new attendance records to save.");
            }

            return new CommonResponseModel(true, 1111, "Attendance records created successfully");
        } catch (error) {
            console.error("Error generating attendance records:", error);
            return new CommonResponseModel(false, 5001, "An error occurred while generating attendance records.");
        }
    }
    async generateAttendanceRecordsForDateRange(dto: AttendanceDateBetweenDto): Promise<CommonResponseModel> {
        try {
            let { fromDate, toDate } = dto;
            let startDate = dayjs(fromDate);
            const endDate = dayjs(toDate);

            if (endDate.isBefore(startDate)) {
                return new CommonResponseModel(false, 4002, "Invalid date range.");
            }

            while (!startDate.isAfter(endDate)) {
                await this.generateAttendanceRecords({ date: startDate.format("YYYY-MM-DD") });
                startDate = startDate.add(1, "day");
            }

            return new CommonResponseModel(true, 1112, "Attendance records created successfully for the given date range.");
        } catch (error) {
            console.error("Error generating attendance records for date range:", error);
            return new CommonResponseModel(false, 5002, "An error occurred while generating attendance records.");
        }
    }

    // @Cron('00 23 * * *')
    // async generateNextDayAttendanceRecords(): Promise<CommonResponseModel> {
    //     // Fetch active employees
    //     const employeeListRes = await this.employeeService.getAllActiveEmpForAttendance();
    //     const { data: employees } = employeeListRes;

    //     // Calculate next day's date
    //     const nextDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    //     const currentYearMonth = dayjs().add(1, 'day').format('YYYYMM');

    //     // Fetch holidays and week-offs
    //     // const holidays = await this.holidayService.getActiveHolidays();
    //     // const isHoliday = holidays?.data?.some((holiday) => holiday.holidayDate === nextDate) ?? false;

    //     const req = new DashboardReq();

    //     const weekOffRes = await this.weekOffService.getAllWeekOffLeaves(req);
    //     const { data: weekOffs } = weekOffRes;
    //     const weekOffMap = new Map(
    //         weekOffs.map((wo) => [wo.employeeId, wo.weekName.toUpperCase()])
    //     );

    //     // Determine if the next day is Sunday
    //     const nextDayName = dayjs(nextDate).format('dddd').toUpperCase();
    //     const isSunday = nextDayName === 'SUNDAY';

    //     // Create attendance records for the next day
    //     const attendanceRecords = employees.map((emp) => {
    //         const empWeekOffDay = weekOffMap.get(emp.employeeId);
    //         let attendanceStatus = 'A'; // Default to Absent

    //         // if (isHoliday) {
    //         //     attendanceStatus = 'H'; // Holiday
    //         // } else if (empWeekOffDay === nextDayName || (isSunday && !empWeekOffDay)) {
    //         //     attendanceStatus = 'W'; // Week-off
    //         // }

    //         return {
    //             attnStatus: attendanceStatus,
    //             date: nextDate,
    //             empId: emp.employeeId,
    //             empCode: emp.employeeCode,
    //             empName: emp.employeeName,
    //             inTime: null,
    //             outTime: null,
    //             freezeStatus: "N",
    //             leaveStatus: "A",
    //             departmentId: emp.departmentId,
    //             designationId: emp.designationId,
    //             divisionId: emp.divisionId,
    //             attendanceMonth: currentYearMonth,
    //             branch: emp.branchId,
    //         };
    //     });

    //     // Save records to the database
    //     await this.attendanceRepo.save(attendanceRecords);
    //     return new CommonResponseModel(true, 1111, "Attendance records created successfully");
    // }

    @Cron('00 23 * * *')
    async generateNextDayAttendanceRecords(): Promise<CommonResponseModel> {
        try {
            const employeeListRes = await this.employeeService.getAllActiveEmpForAttendances();
            const { data: employees } = employeeListRes;

            if (!employees || employees.length === 0) {
                return new CommonResponseModel(false, 4001, "No active employees found.");
            }

            const nextDate = dayjs().add(1, "day").format("YYYY-MM-DD");
            const currentYearMonth = dayjs().add(1, "day").format("YYYYMM");

            const branchEmployeeMap = new Map();
            employees.forEach((emp) => {
                if (!branchEmployeeMap.has(emp.branchId)) {
                    branchEmployeeMap.set(emp.branchId, []);
                }
                branchEmployeeMap.get(emp.branchId).push(emp);
            });

            const holidayPromises = Array.from(branchEmployeeMap.keys()).map((branchId) => {
                const req = new HolidayReqForGenerateSwipe(branchId, nextDate);
                return this.holidayService.getActiveWeekOffAndHolidays(req);
            });
            const holidayResults = await Promise.all(holidayPromises);

            const holidayMap = new Map();
            holidayResults.forEach((res, index) => {
                const branchId = Array.from(branchEmployeeMap.keys())[index];
                const holidaysAndWeekOffs = res?.data || [];

                holidaysAndWeekOffs.forEach((h) => {
                    holidayMap.set(`${h.holidayDate}-${branchId}`, h.type.toUpperCase());
                });
            });

            const employeeIds = employees.map((emp) => emp.employeeId);
            const existingAttendances = await this.attendanceRepo.find({
                where: {
                    empId: In(employeeIds),
                    date: nextDate,
                },
            });

            // Map existing attendance records by employeeId for fast lookup
            const existingAttendanceMap = new Map();
            existingAttendances.forEach((attendance) => {
                existingAttendanceMap.set(attendance.empCode, attendance);
            });

            // Create attendance records for the next day
            const attendanceRecords = [];
            for (const emp of employees) {
                const holidayKey = `${nextDate}-${emp.branchId}`;
                const dayType = holidayMap.get(holidayKey);
                let attendanceStatus = "A";

                if (dayType === "WEEK OFF") {
                    attendanceStatus = "W"; // Week-off
                } else if (
                    dayType === "PUBLIC HOLIDAY" ||
                    dayType === "NATIONAL HOLIDAY" ||
                    dayType === "OPTIONAL HOLIDAY"
                ) {
                    attendanceStatus = "H"; // Holiday
                } else {
                    attendanceStatus = "A"; // Default to absent
                }

                if (existingAttendanceMap.has(emp.employeeCode)) {
                    // console.log(`Attendance already exists for Employee: ${emp.employeeId}, Date: ${nextDate}`);
                    continue;
                }

                attendanceRecords.push({
                    attnStatus: attendanceStatus,
                    date: nextDate,
                    empId: emp.employeeId,
                    empCode: emp.employeeCode,
                    empName: emp.employeeName,
                    inTime: null,
                    outTime: null,
                    freezeStatus: "N",
                    leaveStatus: "A",
                    departmentId: emp.departmentId,
                    designationId: emp.designationId,
                    divisionId: emp.divisionId,
                    attendanceMonth: currentYearMonth,
                    branch: emp.branchId,
                    shift: emp.shift ? emp.shift : null
                });
            }

            if (attendanceRecords.length > 0) {
                const batchSize = 500;
                for (let i = 0; i < attendanceRecords.length; i += batchSize) {
                    const batch = attendanceRecords.slice(i, i + batchSize);
                    await this.attendanceRepo.save(batch);
                }
                console.log("Attendance records saved successfully.");
            } else {
                console.log("No new attendance records to save.");
            }

            return new CommonResponseModel(true, 1111, "Attendance records created successfully");
        } catch (error) {
            console.error("Error generating attendance records for the next day:", error);
            return new CommonResponseModel(false, 5001, "An error occurred while generating attendance records.");
        }
    }


    async generateAttendanceRecordsForThisMonthTillNow(req: AttendanceDateBetweenDto): Promise<CommonResponseModel> {
        try {
            const employeeListRes = await this.employeeService.getAllActiveEmpForAttendances();
            const { data: employees } = employeeListRes;

            if (!employees || employees.length === 0) {
                return new CommonResponseModel(false, 4001, "No active employees found.");
            }

            const startDate = dayjs(req.fromDate);
            const endDate = dayjs(req.toDate);

            // Precompute all dates for the range
            const dates = [];
            for (
                let currentDate = startDate;
                currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day");
                currentDate = currentDate.add(1, "day")
            ) {
                dates.push(currentDate.format("YYYY-MM-DD"));
            }

            // Get existing attendance records for the given date range
            const employeeIds = employees.map((emp) => emp.employeeId);
            const existingAttendances = await this.attendanceRepo.find({
                where: {
                    empId: In(employeeIds),
                    date: In(dates),
                },
            });

            // Store existing records in a Set for quick lookup
            const existingAttendanceSet = new Set(
                existingAttendances.map((rec) => `${rec.empId}-${rec.date}`)
            );

            const attendanceRecords = [];
            for (const date of dates) {
                const monthlyFormat = dayjs(date).format("YYYYMM");

                for (const emp of employees) {
                    if (existingAttendanceSet.has(`${emp.employeeId}-${date}`)) {
                        continue;
                    }

                    attendanceRecords.push({
                        attnStatus: "A",
                        date,
                        empId: emp.employeeId,
                        empCode: emp.employeeCode,
                        empName: emp.employeeName,
                        inTime: null,
                        outTime: null,
                        freezeStatus: "N",
                        leaveStatus: "A",
                        departmentId: emp.departmentId,
                        designationId: emp.designationId,
                        divisionId: emp.divisionId,
                        attendanceMonth: monthlyFormat,
                        branch: emp.branchId,
                    });
                }
            }

            // Bulk insert records in batches
            if (attendanceRecords.length > 0) {
                const BATCH_SIZE = 500;
                const savePromises = [];
                for (let i = 0; i < attendanceRecords.length; i += BATCH_SIZE) {
                    const batch = attendanceRecords.slice(i, i + BATCH_SIZE);
                    savePromises.push(this.attendanceRepo.save(batch));
                }
                await Promise.all(savePromises);
            } else {
                console.log("No new attendance records to save.");
            }

            return new CommonResponseModel(true, 1111, "Attendance records created successfully from February 2nd till now");
        } catch (error) {
            console.error("Error generating attendance records:", error);
            return new CommonResponseModel(false, 5001, "An error occurred while generating attendance records.");
        }
    }

    async getAllAbsentsReport(req: AttendanceDto): Promise<CommonResponseModel> {
        const data = await this.attendanceRepo.getAllAbsentsReport(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }


    async attendanceAdjustment(files: Express.Multer.File[], attnAdjustLogReq: any): Promise<CommonResponseModel> {

        const transManager = new GenericTransactionManager(this.dataSource);
        const req = new AttendanceAdjustRequest();
        req.empId = attnAdjustLogReq.empId;
        req.date = attnAdjustLogReq.date;
        const appliedDate = new Date();

        // Fetch attendance data
        const attnData = await this.getAdjustmentData(req);

        // If attnData is missing, log a warning but proceed with creating a record
        if (!attnData || !attnData.data) {
            return new CommonResponseModel(false, 11109, "Attendance data not found, proceeding with manual adjustment record.");
        }

        // Check freeze status if attnData exists
        if (attnData?.data?.freezeStatus === "Y") {
            return new CommonResponseModel(false, 11109, "Attendance adjustment is frozen and cannot be updated for this employee on the specified date.");
        }

        // Start a transaction
        await transManager.startTransaction();

        try {
            // Check if an adjustment record already exists
            const attnAdjust = await transManager.getRepository(AttendanceAdjustment).findOne({
                where: { employeeId: attnAdjustLogReq.empId, date: req.date },
            });

            if (attnAdjust) {
                // Update existing adjustment record
                const attnAdjustUpdate = await transManager.getRepository(AttendanceAdjustment).update(
                    { employeeId: attnAdjustLogReq.empId, date: req.date },
                    {
                        inTime: attnAdjustLogReq.inTime,
                        outTime: attnAdjustLogReq.outTime,
                        presentStatus: attnAdjustLogReq.presentStatus,
                        reason: attnAdjustLogReq.reason,
                        remarks: attnAdjustLogReq.remarks,
                        updatedUser: attnAdjustLogReq.user,
                        status: ApprovalStatusEnum.OPEN,
                        employeeCode: attnAdjustLogReq.employeeCode,
                        employeeName: attnAdjustLogReq.employeeName,
                        shift: attnAdjustLogReq.shift,
                        filePath: files[0]?.path || null,
                        fileName: files[0]?.filename || null,
                        originalFileName: files[0]?.originalname || null,
                        fileType: files[0]?.mimetype || null,
                    }
                );

                if (attnAdjustUpdate.affected) {
                    const currDate = new Date();
                    const date = currDate.getFullYear() + '-' + (Number(currDate.getMonth()) + 1) + '-' + currDate.getDate();
                    const time = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
                    const inTime = moment(attnAdjustLogReq.inTime).format('YYYY-MM-DD HH:mm');
                    const outTime = moment(attnAdjustLogReq.outTime).format('YYYY-MM-DD HH:mm');
                    const status = attnAdjustLogReq.presentStatus
                    const empReq = new EmployeeDetailsDto()
                    empReq.employeeCode = attnAdjustLogReq.employeeCode
                    const empNameResult = await this.attnAdjustmentRepo.employeeNameQuery(empReq)
                    const empName = empNameResult[0]?.first_name || 'Unknown';
                    const mobileDataReq = new EmployeeDetailsDto()
                    mobileDataReq.reportingManager = empNameResult[0]?.reportingManager
                    const mobileNumberQuery = await this.attnAdjustmentRepo.mobileNumberQuery(mobileDataReq)
                    const email = mobileNumberQuery[0]?.email_id || 'Unknown';
                    const rmName = mobileNumberQuery[0]?.first_name || 'Unknown';
                    
                    const emailReq = {
                        'to': [email],
                        'subject': `Updated Attendance Adjustment Approval Request`,
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
                                    color: #2c3e50;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <p><span class="highlight">To:</span> ${rmName},</p>
                                <p>Dear Sir/Madam,</p>
                                <p>An attendance adjustment request has been submitted by <span class="highlight">${empName}</span>.</p>
                                <p><strong>Employee Code:</strong> ${attnAdjustLogReq.employeeCode}</p>
                                <p><strong>In Time:</strong> ${inTime}</p>
                                <p><strong>Out Time:</strong> ${outTime}</p>
                                <p><strong>Status:</strong> ${status}</p>
                                <p><strong>Reason:</strong> ${attnAdjustLogReq.reason}</p>
                                <p><strong>Requested On:</strong> ${date} ${time}</p>
                    
                                <p>Kindly review and process the request at your earliest convenience.</p>
                    
                                <p>Best regards,</p>
                                <p><span class="highlight">${empName}</span></p>
                            </div>
                        </body>
                        </html>`
                    };
                    
                    
                    const response = axios.post("https://alerts.schemaxtech.in/email/send", emailReq, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
    
                    await transManager.completeTransaction();
                    return new CommonResponseModel(true, 11105, "Attendance adjustment updated for this employee for the date " + req.date);
                } else {
                    await transManager.releaseTransaction();
                    return new CommonResponseModel(false, 11106, 'Something went wrong in attendance update');
                }
            } else {
                // Create a new adjustment record even if attnData is missing
                const attnLogEntity = new AttendanceAdjustment();
                attnLogEntity.employeeId = attnAdjustLogReq.empId;
                attnLogEntity.employeeCode = attnAdjustLogReq.employeeCode;
                attnLogEntity.employeeName = attnAdjustLogReq.employeeName;
                attnLogEntity.attendaceId = attnData?.data?.id || null;
                attnLogEntity.date = attnAdjustLogReq.date;
                attnLogEntity.oldInTime = attnData?.data?.inTime || null;
                attnLogEntity.inTime = attnAdjustLogReq.inTime;
                attnLogEntity.oldOutTime = attnData?.data?.outTime || null;
                attnLogEntity.outTime = attnAdjustLogReq.outTime;
                attnLogEntity.presentStatus = attnAdjustLogReq.presentStatus;
                attnLogEntity.departmentId = attnData?.data?.departmentId || null;
                attnLogEntity.shiftGroup = attnData?.data?.shiftGroup || null;
                attnLogEntity.unitId = attnAdjustLogReq.branchId;
                attnLogEntity.shift = attnAdjustLogReq.shift;
                attnLogEntity.reason = attnAdjustLogReq.reason;
                attnLogEntity.remarks = attnAdjustLogReq.remarks;
                attnLogEntity.appliedDate = appliedDate;
                attnLogEntity.createdUser = attnAdjustLogReq.user;
                attnLogEntity.filePath = files[0]?.path || null;
                attnLogEntity.fileName = files[0]?.filename || null;
                attnLogEntity.originalFileName = files[0]?.originalname || null;
                attnLogEntity.fileType = files[0]?.mimetype || null;

                const savedAttenLogEntity = await transManager.getRepository(AttendanceAdjustment).save(attnLogEntity);

                if (savedAttenLogEntity) {
                    const currDate = new Date();
                    const date = currDate.getFullYear() + '-' + (Number(currDate.getMonth()) + 1) + '-' + currDate.getDate();
                    const time = currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds();
                    const inTime = moment(attnAdjustLogReq.inTime).format('YYYY-MM-DD HH:mm');
                    const outTime = moment(attnAdjustLogReq.outTime).format('YYYY-MM-DD HH:mm');
                    const status = attnAdjustLogReq.presentStatus
                    const empReq = new EmployeeDetailsDto()
                    empReq.employeeCode = attnAdjustLogReq.employeeCode
                    const empNameResult = await this.attnAdjustmentRepo.employeeNameQuery(empReq)
                    const empName = empNameResult[0]?.first_name || 'Unknown';
                    const mobileDataReq = new EmployeeDetailsDto()
                    mobileDataReq.reportingManager = empNameResult[0]?.reportingManager
                    const mobileNumberQuery = await this.attnAdjustmentRepo.mobileNumberQuery(mobileDataReq)
                    const email = mobileNumberQuery[0]?.email_id || 'Unknown';
                    const rmName = mobileNumberQuery[0]?.first_name || 'Unknown';
                    
                    const emailReq = {
                        'to': [email],
                        'subject': `Attendance Adjustment Approval Request`,
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
                                    color: #2c3e50;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <p><span class="highlight">To:</span> ${rmName},</p>
                                <p>Dear Sir/Madam,</p>
                                <p>An attendance adjustment request has been submitted by <span class="highlight">${empName}</span>.</p>
                                <p><strong>Employee Code:</strong> ${attnAdjustLogReq.employeeCode}</p>
                                <p><strong>In Time:</strong> ${inTime}</p>
                                <p><strong>Out Time:</strong> ${outTime}</p>
                                <p><strong>Status:</strong> ${status}</p>
                                <p><strong>Reason:</strong> ${attnAdjustLogReq.reason}</p>
                                <p><strong>Requested On:</strong> ${date} ${time}</p>
                    
                                <p>Kindly review and process the request at your earliest convenience.</p>
                    
                                <p>Best regards,</p>
                                <p><span class="highlight">${empName}</span></p>
                            </div>
                        </body>
                        </html>`
                    };
                    
                    
                    const response = axios.post("https://alerts.schemaxtech.in/email/send", emailReq, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
    
                    await transManager.completeTransaction();
                    return new CommonResponseModel(true, 11101, 'Attendance adjustment applied successfully', savedAttenLogEntity.id);
                } else {
                    await transManager.releaseTransaction();
                    return new CommonResponseModel(false, 11106, 'Something went wrong in attendance saving');
                }
            }
        } catch (error) {
            await transManager.releaseTransaction();
            console.error('Error in attendanceAdjustment:', error);
            throw new Error('Failed to update attendance adjustment');
        }
    }

    async getAdjustmentData(req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        try {
            if (req.empId) {
                const attEntity = await this.attendanceRepo.findOne({ where: { empId: req.empId, date: (req.date) } });
                if (attEntity) {
                    return new CommonResponseModel(true, 11108, 'Active Employees retrived', attEntity);
                } else {
                    return new CommonResponseModel(false, 99998, 'Data Not Found')
                }
            }
        } catch (err) {
            return err;
        }
    }

    async getAttnAdjustTableData(req: UnitIdReq): Promise<CommonResponseModel> {
        const transManager = new GenericTransactionManager(this.dataSource);
        await transManager.startTransaction();
        const datas = await transManager.getRepository(AttendanceAdjustment).find({ where: { unitId: req.unitId }, order: { appliedDate: 'DESC' } });
        if (datas) {
            await transManager.completeTransaction();
        } else {
            await transManager.releaseTransaction()
        }
        const response = [];
        for (const data of datas) {
            response.push(data);
        }
        if (response) {
            return new CommonResponseModel(true, 11107, 'Data retrieved successfully', response);
        } else {
            await transManager.releaseTransaction();
            return new CommonResponseModel(false, 11106, ' Data not Found ');
        }
    }

    async updateAttendance(attnUpdateReq: AttendanceUpdateRequest): Promise<CommonResponseModel> {
        const date = attnUpdateReq.date;
        const employeeId = attnUpdateReq.empId;
        const transManager = new GenericTransactionManager(this.dataSource);
        const currDate = new Date();
        const empRecord = await this.attendanceRepo.getEmpAttendanceRecordByDate(date, employeeId);
        if (empRecord) {
            await transManager.startTransaction();
            if (attnUpdateReq.status == ApprovalStatusEnum.APPROVED) {
                const attenUpdate = await transManager.getRepository(AttendanceEntity).update({ empId: employeeId, date: date }, { attnStatus: attnUpdateReq.presentStatus, inTime: attnUpdateReq.inTime, outTime: attnUpdateReq.outTime });
                if (attenUpdate.affected) {
                    const attenAdjUpdate = await transManager.getRepository(AttendanceAdjustment).update({ employeeId: employeeId, date: date }, { status: ApprovalStatusEnum.APPROVED, updatedUser: attnUpdateReq.user });
                    if (attenAdjUpdate.affected) {
                        await transManager.completeTransaction();
                        return new CommonResponseModel(true, 11101, 'Attendance Approved and Updated Successfully');
                    } else {
                        await transManager.releaseTransaction();
                        return new CommonResponseModel(false, 11101, 'Something went wrong in attendance adjustment updation');
                    }
                } else {
                    await transManager.releaseTransaction();
                    return new CommonResponseModel(false, 11101, 'Something went wrong in attendance updation');
                }
            } else if (attnUpdateReq.status == ApprovalStatusEnum.REJECTED) {
                const rejUpdate = await transManager.getRepository(AttendanceAdjustment).update({ employeeId: employeeId, date: date }, { status: ApprovalStatusEnum.REJECTED, updatedUser: attnUpdateReq.user });
                if (rejUpdate.affected) {
                    await transManager.completeTransaction();
                    return new CommonResponseModel(true, 11101, 'Attendance Rejected Successfully');
                } else {
                    await transManager.releaseTransaction();
                    return new CommonResponseModel(false, 11101, 'Something went wrong in rejection of attendance');
                }
            }
        }
        else {
            return new CommonResponseModel(false, 11106, 'Record already updated for this Employee');
        }
    }

    async createOdCo(formData: any): Promise<CommonResponseModel> {

        const transactionManager = new GenericTransactionManager(this.dataSource);
        const columnMapping = {
            "Employee Code": "employee_code",
            "Type": "type",
            "From Date": "from_date",
            "To Date": "to_date",
            "No of Days": "no_of_days",
            "Leave Reason": "leave_reason"
        };
        const updateEmpName = await this.getEmployeeNameByCode()

        try {
            await transactionManager.startTransaction();
            const flag = new Set<boolean>();
            const updatedArray = formData.map((obj) => {
                const updatedObj = {};
                for (const key in obj) {
                    const mappedKey = columnMapping[key] || key;
                    if (mappedKey) {
                        updatedObj[mappedKey] = obj[key];
                    }
                }
                return updatedObj;
            });

            const difference = Object.keys(columnMapping).filter((element) => !AppyCoODUploadColumns.includes(columnMapping[element]));
            if (difference.length > 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 1110, "Excel columns don't match. Please attach the correct file.");
            }

            const convertedData = updatedArray.map((obj) => {
                const updatedObj = {};
                for (const key in obj) {
                    const value = obj[key];
                    updatedObj[key] = value === "" ? null : value;
                }
                return updatedObj;
            });

            const savedData = [];
            for (const data of convertedData) {
                if (data) {
                    const addObj = new ApplyCoOdUploadEntity();
                    addObj.employeeCode = data['employee_code'];
                    addObj.type = data['type'];
                    addObj.fromDate = dayjs(data['from_date']).format('YYYY-MM-DD') ? dayjs(data['from_date']).format('YYYY-MM-DD') : undefined;
                    addObj.toDate = dayjs(data['to_date']).format('YYYY-MM-DD') ? dayjs(data['to_date']).format('YYYY-MM-DD') : undefined;
                    addObj.noOfDays = data['no_of_days'];
                    addObj.leaveReason = data['leave_reason'];
                    const employeeData = updateEmpName.get(Number(data['employee_code']));
                    if (employeeData) {
                        addObj.employeeName = employeeData.employeeName;
                        addObj.employeeId = employeeData.empId;
                    }
                    const addSave = await transactionManager.getRepository(ApplyCoOdUploadEntity).save(addObj);
                    if (!addSave) {
                        flag.add(false);
                        await transactionManager.releaseTransaction();
                        break;
                    }
                    savedData.push(addObj);
                }
            }

            for (const savedObj of savedData) {
                try {
                    await this.attendanceRepo.attendanceCOOD(savedObj);
                } catch (err) {
                    console.error("Error while updating attendance for:", savedObj, err);
                    flag.add(false);
                    await transactionManager.releaseTransaction();
                    break;
                }
            }

            if (!flag.has(false)) {
                await transactionManager.completeTransaction();
                return new CommonResponseModel(true, 1, 'Data saved successfully');
            } else {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Something went wrong');
            }
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Something went wrong');
        }
    }

    async getApplyCoOdUploadData(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.applyCoOdRepo.getApplyCoOdUploadData(req)

            if (result) {
                result.forEach((item: any) => {
                    const fromDate = new Date(item.fromDate);
                    const toDate = new Date(item.toDate);
                    const localTimeFromDate = new Date(fromDate.getTime() - new Date().getTimezoneOffset() * 60000);
                    const localTimeToDate = new Date(toDate.getTime() - new Date().getTimezoneOffset() * 60000);
                    item.fromDate = localTimeFromDate.toISOString().split('T')[0];
                    item.toDate = localTimeToDate.toISOString().split('T')[0];
                });
                return new CommonResponseModel(true, 1, 'Data retrieved', result)
            } else {
                return new CommonResponseModel(false, 0, 'No data found')
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Something went wrong', err)
        }
    }

    async getEmployeeNameByCode(): Promise<Map<number, { employeeName: string; empId: number }>> {
        try {
            const result = await this.employeeService.getAllEmployeeNameAndCodeAgainstEmpId();
            const employeeMap = new Map<number, { employeeName: string; empId: number }>();

            result.data.forEach((i) => {
                employeeMap.set(Number(i.employeeCode), {
                    employeeName: i.employeeName,
                    empId: Number(i.empId),
                });
            });

            return employeeMap;
        } catch (err) {
            throw err;
        }
    }

    async updateApplyCoOdUpload(req: any): Promise<CommonResponseModel> {
        try {
            const updateEmpName = await this.getEmployeeNameByCode()
            const employeeData = updateEmpName.get(Number(req.employeeCode));
            const result = await this.applyCoOdRepo.update({ applyOdCoId: req.applyOdCoId }, {
                employeeCode: req.employeeCode, type: req.type, fromDate: req.fromDate, toDate: req.toDate, noOfDays: req.noOfDays, leaveReason: req.leaveReason, employeeId: employeeData.empId, employeeName: employeeData.employeeName
            })
            if (result) {
                return new CommonResponseModel(true, 1, 'Data retrieved', result)
            } else {
                return new CommonResponseModel(false, 0, 'No data found')
            }
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Something went wrong', err)
        }
    }

    async getAllForBulkOTApproval(req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        try {
            const data = await this.attendanceRepo.getAllForBulkOTApproval(req)
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

    async getLateAndEarlyEntryEmployees(req: AttendanceDto): Promise<CommonResponseModel> {
        // console.log(req, "req")
        try {
            const data = await this.attendanceRepo.getLateAndEarlyEntryEmployees(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }

        } catch (err) {
            throw err
        }


    }

    async getAllForBulkOTApplyApprove(req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        try {
            const data = await this.attendanceRepo.getAllForBulkOTApplyApprove(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data Retried Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }

        }
        catch (err) {
            throw err
        }
    }

    async updateBulkOTApproval(req?: OTBulkApprovalDto[]): Promise<CommonResponseModel> {
        try {
            const results = [];
            for (const res of req) {
                // const update = await this.attendanceRepo.update(
                //     { empId: res.employeeId, date: res.date },
                //     {
                //         spclOThrs: res.editedFinalOtHours
                //             ? res.editedFinalOtHours
                //             : res.finalOtHours,
                //         otStatus: 1,
                //     }
                // );
                // if (update.affected) {
                const entity = new OTApprovalLog();
                entity.empId = res.employeeId;
                entity.reason = res.reason;
                entity.finalOtHours = res.editedFinalOtHours
                    ? res.editedFinalOtHours
                    : res.finalOtHours;
                entity.date = res.date;
                entity.departmentId = res.departmentId;
                entity.designationId = res.designationId;
                entity.divisionId = res.divisionId;
                entity.divisionName = res.divisionName;
                entity.branch_id = res.branch_id;
                entity.branches = res.branches;
                entity.shiftType = res.shiftType;
                entity.department = res.department;
                entity.empCode = res.empCode;
                entity.status = "OPEN"
                entity.inTime = res.inTime;
                entity.outTime = res.outTime;
                const save = await this.otApprovalLogRepo.save(entity);
                if (save) {
                    results.push({ success: true, employeeId: res.employeeId });
                } else {
                    results.push({ success: false, employeeId: res.employeeId });
                }
                // } else {
                //     results.push({ success: false, employeeId: res.employeeId });
                // }
            }
            const allSuccess = results.every((result) => result.success);
            if (allSuccess) {
                return new CommonResponseModel(true, 1, "OT Apply Process Done");
            } else {
                return new CommonResponseModel(false, 0, "Some updates failed");
            }
        } catch (err) {
            throw err
        }
    }

    async getAttStatusByEmpIdCodeName(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.attendanceRepo.getAttStatusDataRepo(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Att Data Retrived Sucessfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'Att No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }

    async getWorkingHoursReport(req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        const data = await this.attendanceRepo.getWorkingHoursReport(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);
    }

    // async attendanceUpload(formData: any): Promise<CommonResponseModel> {
    //     const transactionManager = new GenericTransactionManager(this.dataSource);
    //     const missingEmployeeCodes: string[] = [];
    //     try {
    //         const flag = new Set<boolean>();
    //         await transactionManager.startTransaction();
    //         const columnArray = [];
    //         const requiredColumns = ["EmployeeCode", "Date", "Shift", "InTime", "OutTime"];


    //         // Transform the data to the correct format
    //         const updatedArray = formData.map((obj) => {
    //             const updatedObj = {};

    //             const formattedDate = obj.Date
    //             const formattedInTime = obj['In Time']
    //             const formattedOutTime = obj['Out Time']
    //             const calculateTotalHours = (inTime: string, outTime: string): string => {
    //                 const inTimeMoment = moment(inTime, 'YYYY-MM-DD HH:mm:ss');
    //                 const outTimeMoment = moment(outTime, 'YYYY-MM-DD HH:mm:ss');

    //                 if (!inTimeMoment.isValid() || !outTimeMoment.isValid()) {
    //                     return '00:00:00';
    //                 }

    //                 const diffInMillis = outTimeMoment.diff(inTimeMoment);
    //                 const duration = moment.duration(diffInMillis);

    //                 const diffInHours = Math.floor(duration.asHours());
    //                 const diffInMinutes = duration.minutes();
    //                 const diffInSeconds = duration.seconds();

    //                 return `${diffInHours.toString().padStart(2, '0')}:${diffInMinutes.toString().padStart(2, '0')}:${diffInSeconds.toString().padStart(2, '0')}`;
    //             };

    //             const totalHours = calculateTotalHours(formattedInTime, formattedOutTime);

    //             for (const key in obj) {
    //                 const newKey = key
    //                     .replace(/\s/g, '')
    //                     .replace(/[\(\)\.]/g, '')
    //                     .replace(/-/g, '');

    //                 if (newKey !== '') {
    //                     columnArray.push(newKey);
    //                     if (newKey === 'Date') {
    //                         updatedObj[newKey] = formattedDate;
    //                     } else if (newKey === 'InTime') {
    //                         updatedObj[newKey] = formattedInTime;
    //                     } else if (newKey === 'OutTime') {
    //                         updatedObj[newKey] = formattedOutTime;
    //                     } else if (newKey === 'Shift') {
    //                         const shiftValue = obj[key].toUpperCase();
    //                         // if (!/^[A-E]$/.test(shiftValue)) {
    //                         //     throw new Error(`Invalid shift value: ${shiftValue}.`);
    //                         // }
    //                         updatedObj[newKey] = shiftValue;
    //                     } else if(newKey === 'EmployeeCode'){
    //                         updatedObj[newKey] = obj['Employee Code'];
    //                     } else {
    //                         updatedObj[newKey] = obj[key];
    //                     }
    //                 }
    //             }

    //             // Add TotalHours to the updated object
    //             updatedObj['TotalHours'] = totalHours;

    //             return updatedObj;
    //         });
    //         console.log(updatedArray, '-------ffododkdk--------')
    //         // Check for missing columns
    //         for (const column of requiredColumns) {
    //             if (!columnArray.includes(column)) {
    //                 await transactionManager.releaseTransaction();
    //                 return new CommonResponseModel(false, 1111, `${column} column is missing ☹️`);
    //             }
    //         }

    //         // Validate the format of Date, In Time, and Out Time
    //         for (const row of updatedArray) {
    //             const date = moment(row.Date, true);
    //             const inTime = moment(row.InTime, true);
    //             const outTime = moment(row.OutTime, true);

    //             // Check if the date and datetime values are valid
    //             if (!date.isValid()) {
    //                 await transactionManager.releaseTransaction();
    //                 return new CommonResponseModel(false, 1112, `Invalid format for Date`);
    //             }

    //             if (!inTime.isValid()) {
    //                 await transactionManager.releaseTransaction();
    //                 return new CommonResponseModel(false, 1113, `Invalid format for In Time`);
    //             }

    //             if (!outTime.isValid()) {
    //                 await transactionManager.releaseTransaction();
    //                 return new CommonResponseModel(false, 1114, `Invalid format for Out Time`);
    //             }
    //         }

    //         const convertedData = updatedArray.map((obj) => {
    //             const updatedObj = {};
    //             for (const key in obj) {
    //                 const value = obj[key];
    //                 updatedObj[key] = value === '' ? null : value;
    //             }
    //             return updatedObj;
    //         });

    //         // Validate each row
    //         for (const data of convertedData) {
    //             if (!data.EmployeeCode) {
    //                 await transactionManager.releaseTransaction();
    //                 return new CommonResponseModel(false, 1112, 'Missing EmployeeCode in one of the rows');
    //             }
    //         }

    //         for (const data of convertedData) {
    //             if (data.EmployeeCode != null && data.Date != null) {
    //                 // Step 1: Update AttendanceEntity
    //                 const existedAttendance = await this.attendanceRepo.findOne({ where: { empCode: data.EmployeeCode, date: data.Date } });

    //                 if (existedAttendance) {
    //                     const updateAttendance = await transactionManager.getRepository(AttendanceEntity).update(
    //                         { id: existedAttendance.id },
    //                         { inTime: data.InTime, outTime: data.OutTime, shift: data.Shift }
    //                     );
    //                     if (updateAttendance.affected) {
    //                         // Step 2: Update or Insert ConsolidatedAttendanceLogEntity
    //                         let existingLog = await this.attnAdjustmentRepo.findOne({
    //                             where: { employeeCode: data.EmployeeCode, appliedDate: data.Date },
    //                         });

    //                         if (existingLog) {
    //                             // Clear specific columns before updating
    //                             const clearData = {
    //                                 inTime: null,
    //                                 outTime: null,

    //                                 shift: null,
    //                                 totalHours: null,
    //                             };

    //                             const clearResult = await transactionManager.getRepository(AttendanceAdjustment)
    //                                 .update({ id: existingLog.id }, clearData);

    //                             if (clearResult.affected) {
    //                                 // Apply new updates after clearing
    //                                 const updateLog = {
    //                                     inTime1: data.InTime,
    //                                     outTime1: data.OutTime,
    //                                     shift: data.Shift,
    //                                     totalHours: data.TotalHours,
    //                                     manual: CartonShortageStatus.YES
    //                                 };

    //                                 const updateLogResult = await transactionManager.getRepository(AttendanceAdjustment)
    //                                     .update({ id: existingLog.id }, updateLog);

    //                                 if (updateLogResult.affected) {
    //                                     flag.add(true);
    //                                 } else {
    //                                     flag.add(false);
    //                                     await transactionManager.releaseTransaction();
    //                                     return new CommonResponseModel(false, 0, 'Failed to update the consolidated log');
    //                                 }
    //                             } else {
    //                                 flag.add(false);
    //                                 await transactionManager.releaseTransaction();
    //                                 return new CommonResponseModel(false, 0, 'Failed to clear the consolidated log');
    //                             }
    //                         } else {
    //                             // Insert new record in ConsolidatedAttendanceLogEntity if no record is found
    //                             const insertLog = {
    //                                 employeeCode: data.EmployeeCode,
    //                                 appliedDate: data.Date,
    //                                 inTime: data.InTime,
    //                                 outTime: data.OutTime,
    //                                 shift: data.Shift,
    //                                 employeeId: existedAttendance.empId,
    //                                 attendaceId: existedAttendance.id,
    //                                 status: ApprovalStatusEnum.OPEN,
    //                                 employeeName: existedAttendance.empName,
    //                                 date: existedAttendance.date
    //                                 // oldInTime:existedAttendance.inTime,
    //                                 // oldOutTime:existedAttendance.outTime


    //                             };

    //                             const insertLogResult = await transactionManager.getRepository(AttendanceAdjustment)
    //                                 .insert(insertLog);

    //                             if (insertLogResult.identifiers.length > 0) {
    //                                 flag.add(true);
    //                             } else {
    //                                 flag.add(false);
    //                                 await transactionManager.releaseTransaction();
    //                                 return new CommonResponseModel(false, 0, 'Failed to insert the new consolidated log');
    //                             }
    //                         }
    //                     } else {
    //                         flag.add(false);
    //                         await transactionManager.releaseTransaction();
    //                         return new CommonResponseModel(false, 0, 'Failed to update the attendance record');
    //                     }
    //                 } else {
    //                     // Track missing employee codes for attendance
    //                     missingEmployeeCodes.push(data.EmployeeCode);
    //                 }
    //             }
    //         }

    //         if (missingEmployeeCodes.length > 0) {
    //             await transactionManager.releaseTransaction();
    //             return new CommonResponseModel(false, 1116, `${missingEmployeeCodes.join(', ')}, on ${formData.Date}`);
    //         }

    //         if (!flag.has(false)) {
    //             await transactionManager.completeTransaction();
    //             return new CommonResponseModel(true, 1, `Data updated successfully`);
    //         } else {
    //             await transactionManager.releaseTransaction();
    //             return new CommonResponseModel(false, 0, 'Something went wrong');
    //         }
    //     } catch (err) {
    //         await transactionManager.releaseTransaction();
    //         return new CommonResponseModel(false, 0, `Error: ${err.message}`);
    //     }
    // }

    async attendanceUpload(formData: any): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        const missingEmployeeCodes: string[] = [];
        try {
            const flag = new Set<boolean>();
            await transactionManager.startTransaction();
            const columnArray = [];
            const requiredColumns = ["EmployeeCode", "Date", "InTime", "OutTime", "AttendanceStatus"];
            // Transform the data to the correct format
            const updatedArray = formData.map((obj) => {
                const updatedObj = {};

                const formattedDate = obj.Date
                const formattedInTime = obj['In Time']
                const formattedOutTime = obj['Out Time']
                const calculateTotalHours = (inTime: string, outTime: string): string => {
                    const inTimeMoment = moment(inTime, 'YYYY-MM-DD HH:mm:ss');
                    const outTimeMoment = moment(outTime, 'YYYY-MM-DD HH:mm:ss');

                    if (!inTimeMoment.isValid() || !outTimeMoment.isValid()) {
                        return '00:00:00';
                    }

                    const diffInMillis = outTimeMoment.diff(inTimeMoment);
                    const duration = moment.duration(diffInMillis);

                    const diffInHours = Math.floor(duration.asHours());
                    const diffInMinutes = duration.minutes();
                    const diffInSeconds = duration.seconds();

                    return `${diffInHours.toString().padStart(2, '0')}:${diffInMinutes.toString().padStart(2, '0')}:${diffInSeconds.toString().padStart(2, '0')}`;
                };

                const totalHours = calculateTotalHours(formattedInTime, formattedOutTime);

                for (const key in obj) {
                    const newKey = key
                        .replace(/\s/g, '')
                        .replace(/[\(\)\.]/g, '')
                        .replace(/-/g, '');

                    if (newKey !== '') {
                        columnArray.push(newKey);
                        if (newKey === 'Date') {
                            updatedObj[newKey] = formattedDate;
                        } else if (newKey === 'InTime') {
                            updatedObj[newKey] = formattedInTime;
                        } else if (newKey === 'OutTime') {
                            updatedObj[newKey] = formattedOutTime;
                        } else if (newKey === 'AttendanceStatus') {
                            updatedObj[newKey] = obj['Attendance Status'];
                        } else if (newKey === 'EmployeeCode') {
                            updatedObj[newKey] = obj['Employee Code'];
                        } else {
                            updatedObj[newKey] = obj[key];
                        }
                    }
                }

                // Add TotalHours to the updated object
                updatedObj['TotalHours'] = totalHours;

                return updatedObj;
            });
            // Check for missing columns
            for (const column of requiredColumns) {
                if (!columnArray.includes(column)) {
                    await transactionManager.releaseTransaction();
                    return new CommonResponseModel(false, 1111, `${column} column is missing ☹️`);
                }
            }

            // Validate the format of Date, In Time, and Out Time
            for (const row of updatedArray) {
                const date = moment(row.Date, true);
                const inTime = moment(row.InTime, true);
                const outTime = moment(row.OutTime, true);

                // Check if the date and datetime values are valid
                if (!date.isValid()) {
                    await transactionManager.releaseTransaction();
                    return new CommonResponseModel(false, 1112, `Invalid format for Date`);
                }

                if (!inTime.isValid()) {
                    await transactionManager.releaseTransaction();
                    return new CommonResponseModel(false, 1113, `Invalid format for In Time`);
                }

                if (!outTime.isValid()) {
                    await transactionManager.releaseTransaction();
                    return new CommonResponseModel(false, 1114, `Invalid format for Out Time`);
                }
            }

            const convertedData = updatedArray.map((obj) => {
                const updatedObj = {};
                for (const key in obj) {
                    const value = obj[key];
                    updatedObj[key] = value === '' ? null : value;
                }
                return updatedObj;
            });

            // Validate each row
            for (const data of convertedData) {
                if (!data.EmployeeCode) {
                    await transactionManager.releaseTransaction();
                    return new CommonResponseModel(false, 1112, 'Missing EmployeeCode in one of the rows');
                }
            }

            for (const data of convertedData) {
                if (data.EmployeeCode != null && data.Date != null) {
                    const req = { employeeCode: data.EmployeeCode }

                    const empCodeData = await this.empService.getEmpByCode(req);

                    // Step 1: Get AttendanceEntity
                    const existedAttendance = await this.attendanceRepo.findOne({ where: { empCode: data.EmployeeCode, date: data.Date } });
                    console.log(existedAttendance, "11111111111111111111")

                    if (existedAttendance && existedAttendance?.freezeStatus === 'Y') {
                        //  Track missing employee codes for attendance adjustment
                        missingEmployeeCodes.push(data.EmployeeCode);
                    } else {
                        // Step 2: Update or Insert ConsolidatedAttendanceLogEntity
                        let existingLog = await this.attnAdjustmentRepo.findOne({
                            where: { employeeCode: data.EmployeeCode, date: data.Date },
                        });

                        if (existingLog) {
                            // Clear specific columns before updating
                            const clearData = {
                                inTime: null,
                                outTime: null,
                                presentStatus: null,
                            };

                            const clearResult = await transactionManager.getRepository(AttendanceAdjustment)
                                .update({ id: existingLog.id }, clearData);

                            if (clearResult.affected) {
                                // Apply new updates after clearing
                                const updateLog = {
                                    date: data.Date,
                                    inTime: data.InTime,
                                    outTime: data.OutTime,
                                    presentStatus: data.AttendanceStatus,
                                    attendaceId: existedAttendance.id
                                };

                                const updateLogResult = await transactionManager.getRepository(AttendanceAdjustment)
                                    .update({ id: existingLog.id }, updateLog);

                                if (updateLogResult.affected) {
                                    flag.add(true);
                                } else {
                                    flag.add(false);
                                    await transactionManager.releaseTransaction();
                                    return new CommonResponseModel(false, 0, 'Failed to update the consolidated log');
                                }
                            } else {
                                flag.add(false);
                                await transactionManager.releaseTransaction();
                                return new CommonResponseModel(false, 0, 'Failed to clear the consolidated log');
                            }
                        } else {
                            // Insert new record in ConsolidatedAttendanceLogEntity if no record is found
                            const insertLog = {
                                employeeCode: data.EmployeeCode,
                                inTime: data.InTime,
                                outTime: data.OutTime,
                                attendaceId: existedAttendance.id,
                                oldOutTime: existedAttendance.outTime,
                                oldInTime: existedAttendance.inTime,
                                presentStatus: data.AttendanceStatus,
                                employeeId: empCodeData.data.employeeId,
                                status: ApprovalStatusEnum.OPEN,
                                employeeName: empCodeData.data.firstName,
                                date: data.Date
                            };

                            const insertLogResult = await transactionManager.getRepository(AttendanceAdjustment)
                                .insert(insertLog);

                            if (insertLogResult.identifiers.length > 0) {
                                flag.add(true);
                            } else {
                                flag.add(false);
                                await transactionManager.releaseTransaction();
                                return new CommonResponseModel(false, 0, 'Failed to insert the new consolidated log');
                            }
                        }
                    }
                }
            }

            if (missingEmployeeCodes.length > 0) {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 1116, `${missingEmployeeCodes.join(', ')}, for these employee Codes attendance got freeze`);
            }

            if (!flag.has(false)) {
                await transactionManager.completeTransaction();
                return new CommonResponseModel(true, 1, `Data updated successfully`);
            } else {
                await transactionManager.releaseTransaction();
                return new CommonResponseModel(false, 0, 'Something went wrong');
            }
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, `Error: ${err.message}`);
        }
    }

    async getWorkingHoursReportWithDetails(req: AttendanceDto): Promise<CommonResponseModel> {
        try {
            const data = await this.attendanceRepo.getWorkingHoursReportWithDetails(req);
            if (data) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            } else {
                return new CommonResponseModel(false, 0, 'No data found', []);
            }
        } catch (err) {
            console.error('Error fetching working hours report:', err);
            return new CommonResponseModel(false, 0, 'Error occurred while fetching data', []);
        }
    }

    async getEmpAttendenceScoreData(req: EmpAttendanceSrcCardReq): Promise<CommonResponseModel> {
        const data = await this.attendanceRepo.getEmpAttendenceScoreData(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', []);

    }

    // async getlogData(): Promise<any> {
    //     const query = await this.attnLogRepo.createQueryBuilder('a')
    //         .select(` MIN(CASE WHEN direction = 'IN' THEN TIME(log_date) END) AS inTime,
    //     MIN(CASE WHEN direction = 'OUT' THEN TIME(log_date) END) AS outTime,MIN(CASE WHEN direction = 'IN' THEN (log_date) END)  AS loginInTime,
    //     MIN(CASE WHEN direction = 'OUT' THEN (log_date) END) AS logOutTime,a.attendace_log_id as attendanceLogId,a.log_date as logDate,a.employee_id as employeeId,a.employee_code as employeeCode,a.direction,a.status,a.employee_name as employeeName`)
    //         .where(`a.status=0`)
    //         .groupBy(`a.employee_id,DATE(a.log_date)`)
    //         .orderBy(`a.employee_id`)
    //     return await query.getRawMany();

    // }

    // async updateSwipesFromDevice(): Promise<CommonResponseModel> {
    //     const transactionManager = new GenericTransactionManager(this.dataSource);
    //     try {
    //         const attnLogData = await this.getlogData()
    //         // console.log(attnLogData,'#############')
    //         let attnUpdate
    //         for (const rec of attnLogData) {
    //             // console.log(rec,'Recordddd')

    //             const shiftChngReqData = await this.shiftChangeRepo.approvedShiftOfEmp(moment(rec.logDate).format('YYYY-MM-DD'),rec.employeeId)
    //             console.log(shiftChngReqData,'shift change req data')

    //             ///// finding data in shiftchange req if finds data get from shift change req
    //             if(shiftChngReqData.length >0){
    //                 console.log('data get from shift change req' )
    //                 const attnLogUpdate = await this.attnLogRepo.update({ employeeId: rec.employeeId, logDate:In([rec.loginInTime,rec.logOutTime]) }, { status: true })

    //                 if(attnLogUpdate.affected){
    //                     attnUpdate = await this.attendanceRepo.update({ empId: rec.employeeId, date: moment(rec.logDate).format('YYYY-MM-DD') }, { shift: shiftChngReqData[0].toShift, inTime: rec.loginInTime, outTime: rec.logOutTime, attnStatus: 'P' })
    //                 }else{
    //                     await transactionManager.releaseTransaction()
    //                     return new CommonResponseModel(false,0,'Some Thing Went Wrong')
    //                 }
    //             }
    //             else{
    //                 console.log('Else Conditions came hereee')
    //                 const req = new EmployeIdReq(rec.employeeId)
    //                 const empData = await this.employeeService.getEmpById(req)
    //                 if (empData.data.length > 0) {
    //                 const teamCalReq = new ShiftReq()
    //                 teamCalReq.shiftGroup = empData.data.shiftGroup
    //                 teamCalReq.logDate = rec.logDate
    //                 // console.log(teamCalReq,'team calnder request ')
    //                 const teamCalData = await this.teamCalnderRepo.shiftsbyDateandShiftGroup(teamCalReq)
    //                 console.log(teamCalData,'team calnder data')
    //                 if (teamCalData.length > 0) {
    //                     console.log('tem calnder in')
    //                     //// shift updated from team clander data 
    //                     const attnLogUpdate = await this.attnLogRepo.update({ employeeId: rec.employeeId, logDate:In([rec.loginInTime,rec.logOutTime])}, { status: true })
    //                     if (attnLogUpdate.affected) {
    //                         attnUpdate = await this.attendanceRepo.update({ empId: rec.employeeId, date: moment(rec.logDate).format('YYYY-MM-DD') }, { shift: teamCalData[0].shift, inTime: rec.loginInTime, outTime: rec.logOutTime, attnStatus: 'P' })
    //                     }

    //                 } else {

    //                     //// details get from shifts masters 
    //                     const shiftreq = new ShiftReq()
    //                     shiftreq.logDate = rec.logDate
    //                     const shiftData = await this.shiftsService.getAllShidtDetailsAgaisntLogDate(shiftreq)
    //                     console.log(shiftData, 'shift dataaaaa')
    //                     if (shiftData.data.length > 0) {
    //                         const attnLogUpdate = await this.attnLogRepo.update({ employeeId: rec.employeeId, logDate:In([rec.loginInTime,rec.logOutTime]) }, { status: true })
    //                         if (attnLogUpdate.affected) {
    //                             attnUpdate = await this.attendanceRepo.update({ empId: rec.employeeId, date: moment(rec.logDate).format('YYYY-MM-DD') }, { shift: shiftData.data[0].id, inTime: rec.loginInTime, outTime: rec.logOutTime, attnStatus: 'P' })
    //                             console.log(attnUpdate, 'atendance updateee')
    //                         }else{
    //                           await transactionManager.releaseTransaction();
    //                         }
    //                     } else {
    //                         ///// no shift found so taking shift x data with attendance log details
    //                         const attnLogUpdate = await this.attnLogRepo.update({ employeeId: rec.employeeId, logDate:In([rec.loginInTime,rec.logOutTime]) }, { status: true })
    //                         if (attnLogUpdate.affected) {
    //                             attnUpdate = await this.attendanceRepo.update({ empId: rec.employeeId, date: moment(rec.logDate).format('YYYY-MM-DD') }, { shift: 6, inTime: rec.loginInTime, outTime: rec.logOutTime, attnStatus: 'P' })
    //                         }else{
    //                             await transactionManager.releaseTransaction();
    //                         }

    //                     }
    //                 }
    //             } else {
    //                 ////  when emp not exist in log then emp data instered in attendance table
    //                 const entity = new AttendanceEntity()
    //                 entity.date = moment(rec.logDate).format('YYYY-MM-DD')
    //                 entity.empId = rec.employeeId
    //                 entity.empCode = rec.employeeCode
    //                 entity.empName = rec.employeeName
    //                 entity.attnStatus = 'P'
    //                 entity.inTime = rec.loginInTime
    //                 entity.outTime = rec.logOutTime
    //                 entity.departmentId = 1
    //                 entity.designationId = 1
    //                 const save = await this.attendanceRepo.save(entity)
    //                 if (save) {
    //                     const attnLogUpdate = await this.attnLogRepo.update({ employeeId: rec.employeeId, logDate:In([rec.loginInTime,rec.logOutTime])}, { status: true })
    //                 }else{
    //                 await transactionManager.releaseTransaction();
    //                 }
    //             }
    //             }

    //         }

    //     } catch (err) {
    //         await transactionManager.releaseTransaction();
    //         return new CommonResponseModel(false, 0, 'Something Went Wrong', err)

    //     }
    // }

    async sendAttendanceStatus(): Promise<CommonResponseModel> {
        try {
            const currDate = new Date();
            const formattedCurrDate = moment(currDate).format('YYYY-MM-DD')
            const formattedPreviousDate = currDate.toISOString().split('T')[0];
            const formattedDateTime = moment(currDate).format('YYYY-MM-DD hh:mmA');

            const branchesQuery = `SELECT id, branch_name AS branchName FROM hrms_masters.branches`
            const branchData = await this.dataSource.query(branchesQuery)

            const consolidatedMessages: string[] = [];
            const phoneNumber = { 1: 9491091889 }

            for (const data of branchData) {
                const empCountQuery = `
                SELECT  COUNT(e.id) AS empCount, b.id AS branchId, b.branch_name AS branchName
                FROM hrms_ems.employee e
                LEFT JOIN hrms_masters.branches b ON b.id = e.branch
                WHERE b.id = ${data.id}`

                const empPresentQuery = `
                SELECT COUNT(DISTINCT a.emp_id) as empCount,a.date, e.branch
                FROM hrms_lms.attendance a
                LEFT JOIN hrms_ems.employee e ON e.id = a.emp_id
                WHERE e.branch = ${data.id} AND a.date = '${formattedPreviousDate}' AND a.attn_status = 'P'`

                const empAbsentQuery = `
                SELECT COUNT(DISTINCT a.emp_id) as empCount,a.date, e.branch
                FROM hrms_lms.attendance a
                LEFT JOIN hrms_ems.employee e ON e.id = a.emp_id
                WHERE e.branch = ${data.id} AND a.date = '${formattedPreviousDate}' AND a.attn_status = 'A'`

                const empLeaveQuery = `
                SELECT COUNT(DISTINCT a.emp_id) as empCount,a.date, e.branch
                FROM hrms_lms.attendance a
                LEFT JOIN hrms_ems.employee e ON e.id = a.emp_id
                WHERE e.branch = ${data.id} AND a.date = '${formattedPreviousDate}' AND a.attn_status = 'L'`

                const empLessWorkingHoursQuery = `
                SELECT COUNT(DISTINCT a.emp_id) as empCount,a.date, e.branch
                FROM hrms_lms.attendance a
                LEFT JOIN hrms_ems.employee e ON e.id = a.emp_id
                WHERE e.branch = ${data.id} AND a.date = '${formattedPreviousDate}' AND TIMESTAMPDIFF(HOUR, a.in_time, a.out_time) < 8`

                const totalEmp = await this.dataSource.query(empCountQuery)
                const totalPresentEmp = await this.dataSource.query(empPresentQuery)
                const totalAbsentEmp = await this.dataSource.query(empAbsentQuery)
                const totalLeaveEmp = await this.dataSource.query(empLeaveQuery)
                const empLessWorkingHours = await this.dataSource.query(empLessWorkingHoursQuery)

                const message = `Generated On: ${formattedDateTime} \\n Attendance Date: ${formattedPreviousDate} \\n Plant: ${data.branchName} \\n Total Employees: ${totalEmp[0]?.empCount} \\n Present: ${totalPresentEmp[0]?.empCount} \\n Absent: ${totalAbsentEmp[0]?.empCount} \\n Leave: ${totalLeaveEmp[0]?.empCount} \\n Less Than 8 Hours: ${empLessWorkingHours[0]?.empCount}`;

                consolidatedMessages.push(message);

                const adminPhoneQuery = `
                SELECT mobile_no 
                FROM hrms_ems.employee 
                WHERE branch = ${data.id} `
                const adminData = await this.dataSource.query(adminPhoneQuery);
                for (const admin of adminData) {
                    await this.whatsService.kmkHrmsCommonTemplete(9491091889, message, 'daily_attendence_status');
                }
            }

            return new CommonResponseModel(true, 1, 'Sent Successfully')
        } catch (err) {
            throw (err)
        }
    }

    // async getAllAttnAdjustmentData(): Promise<CommonResponseModel> {
    //     const data = await this.attnAdjstmntRepo.getAllAttnAdjustmentData()
    // async getAllEmpMonthWiseData(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
    //     const data = await this.attendanceRepo.getAllEmpMonthWiseData(req)
    //     if (data) {
    //         return new CommonResponseModel(true, 1, 'Data retrived successfully', data);
    //     }
    //     return new CommonResponseModel(true, 1, 'No data found', [])
    // }

    async getAllAttnAdjustmentData(req: UnitIdReq): Promise<CommonResponseModel> {
        const data = await this.attnAdjustmentRepo.getAllAttnAdjustmentData(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data retrived successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', [])

    }


    async getAllAttnAdjustmentId(req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        try {
            const results = await this.attnAdjustmentRepo.getAllAttnAdjustmentId(req);

            if (results.length > 0) {
                for (const leaveRecord of results) {
                    const {
                        employeeId,
                        inTime,
                        outTime,
                        presentStatus,
                        branchId,
                        departmentId,
                        desginationid,
                        employeeCode,
                        employeeName,
                        divisionId,
                    } = leaveRecord;

                    // Convert fromDate and toDate to Date objects
                    const startDate = new Date(inTime);
                    const endDate = new Date(outTime);

                    // Fetch existing attendance records for the employee between fromDate and toDate
                    const existingAttendances = await this.attendanceRepo.find({
                        where: {
                            empId: employeeId,
                            date: Between(this.formatDate(startDate), this.formatDate(endDate)),
                        },
                    });

                    if (existingAttendances.length > 0) {
                        // Update leave status for existing attendance records
                        for (const attendance of existingAttendances) {
                            attendance.attnStatus = presentStatus;
                            await this.attendanceRepo.save(attendance);
                        }
                    } else {
                        // Insert new attendance records for each date between fromDate and toDate
                        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                            const newAttendance = new AttendanceEntity();
                            newAttendance.empId = employeeId;
                            newAttendance.empName = employeeName;
                            newAttendance.empCode = employeeCode;
                            newAttendance.departmentId = departmentId;
                            newAttendance.designationId = desginationid;
                            newAttendance.divisionId = divisionId;
                            newAttendance.branch = branchId;
                            newAttendance.inTime = inTime;
                            newAttendance.outReader = outTime
                            newAttendance.attnStatus = "A";
                            newAttendance.attendanceMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
                            newAttendance.date = this.formatDate(date); // Format date as string
                            newAttendance.attnStatus = presentStatus;

                            await this.attendanceRepo.save(newAttendance);
                        }
                    }
                }

                return new CommonResponseModel(true, 1, 'Data retrieved and attendance updated successfully', results);
            } else {
                return new CommonResponseModel(true, 1, 'No data found', []);
            }
        } catch (err) {
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

    // async updatBulkAttendanceApproval(req: any): Promise<CommonResponseModel> {
    //     console.log(req,"req")
    //     try {
    //         for (const res of req) {

    //             const attendanceAdjUpdate = await this.attnAdjustmentRepo.update(
    //                 { employeeId: res.employeeId },
    //                 { status: res.status } // Use the status from the request
    //             );
    //             if (attendanceAdjUpdate.affected) {
    //                 // Update attendance only for APPROVED status
    //                 if (res.status === ApprovalStatusEnum.APPROVED) {
    //                     await this.attendanceRepo.update(
    //                         {
    //                             empId: res.employeeId,
    //                             date: moment(res.attnAdjstDate).format('YYYY-MM-DD'),
    //                         },
    //                         {
    //                             attnStatus: req.presentStatus,
    //                             manualEntry: 'YES',
    //                             inTime: moment(res.inTime).format('YYYY-MM-DD HH:mm:ss'),
    //                             outTime: moment(res.outTime).format('YYYY-MM-DD HH:mm:ss'),
    //                             shift: res.shift,
    //                         }
    //                     );
    //                 }

    //             }
    //         }
    //         return new CommonResponseModel(true, 1, 'Bulk attendance updated successfully');
    //     } catch (err) {
    //         return new CommonResponseModel(false, 0, 'Something went wrong', err);
    //     }
    // }
    async updatBulkAttendanceApproval(req: any): Promise<CommonResponseModel> {
        try {

            // Check if req is empty
            if (!req || !Array.isArray(req) || req.length === 0) {
                return new CommonResponseModel(false, 0, "Request data is empty", []);
            }

            for (const res of req) {

                // Update attendance adjustment status
                const attendanceAdjUpdate = await this.attnAdjustmentRepo.update(
                    { employeeId: res.employeeId, id: res.attnAdjstId },
                    { status: res.status }
                );

                if (attendanceAdjUpdate.affected) {
                    // Proceed if status is APPROVED
                    if (res.status === ApprovalStatusEnum.APPROVED) {
                        const formattedDate = moment(res.attnAdjstDate).format("YYYY-MM-DD");

                        // Check if a record already exists
                        let existingAttendance = await this.attendanceRepo.findOne({
                            where: { empId: res.employeeId, date: formattedDate, id: res.attendanceId },
                        });

                        if (existingAttendance) {
                            // If record exists, update it
                            await this.attendanceRepo.update(
                                { empId: res.employeeId, date: formattedDate, id: res.attendanceId },
                                {
                                    attnStatus: res.presentStatus,
                                    manualEntry: "YES",
                                    inTime: moment(res.inTime).toDate(),  // Fixed type issue
                                    outTime: moment(res.outTime).toDate(), // Fixed type issue
                                    shift: res.shift,
                                }
                            );
                        } else {
                            // Fetch employee details
                            const employeeReq = new EmployeeReq()
                            employeeReq.employeeId = res.employeeId
                            const empResponse = await this.empService.getEmpById(employeeReq);

                            if (!empResponse || !empResponse.status) {
                                console.error(`Employee details not found for ID: ${res.employeeId}`);
                                continue; // Skip inserting if no details found
                            }

                            const empDetails = empResponse.data;

                            // Create new attendance entity
                            const newAttendanceEntity = new AttendanceEntity();
                            newAttendanceEntity.empId = res.employeeId;
                            newAttendanceEntity.empCode = res.empCode;
                            newAttendanceEntity.empName = res.empName;
                            newAttendanceEntity.date = formattedDate;
                            newAttendanceEntity.attnStatus = res.presentStatus;
                            newAttendanceEntity.manualEntry = "YES";
                            newAttendanceEntity.inTime = moment(res.inTime).toDate();  // Fixed type issue
                            newAttendanceEntity.outTime = moment(res.outTime).toDate(); // Fixed type issue
                            newAttendanceEntity.shift = res.shift;
                            newAttendanceEntity.designationId = empDetails.designationId || null;
                            newAttendanceEntity.departmentId = empDetails.departmentId || null;
                            newAttendanceEntity.divisionId = empDetails.divisionId || null;
                            newAttendanceEntity.branch = empDetails.branchId || null;
                            newAttendanceEntity.createdAt = new Date(); // Removed incorrect semicolon
                            newAttendanceEntity.attendanceMonth = moment(res.attnAdjstDate).format("YYYYMM")
                            newAttendanceEntity.leaveStatus = "A"
                            await this.attendanceRepo.save(newAttendanceEntity);
                        }
                    }
                }
            }

            return new CommonResponseModel(true, 1, "Bulk attendance updated successfully");
        } catch (err) {
            console.error("Error in updatBulkAttendanceApproval:", err);
            return new CommonResponseModel(false, 0, "Something went wrong", err);
        }
    }

    async updateFreezeStatus(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);

        try {
            await transactionManager.startTransaction();
            const filter: any = { attendanceMonth: req.date };
            if (req.branch) {
                filter.branch = req.branch === "ALL" ? "" : req.branch;
            }
            const existingRecord = await this.attendanceRepo.findOne({ where: filter });
            if (existingRecord && existingRecord.freezeStatus === "Y" && req.status === "Y") {
                return new CommonResponseModel(false, 0, "Attendance is already frozen. Please unfreeze before proceeding.");
            }
            await this.attendanceRepo.update(filter, { freezeStatus: req.status });
            if (req.status === "Y") {
                await this.payrollAttnService.createPayrollAttendance(req);
            }
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1111, 'Attendance freeze status updated successfully');
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Something went wrong', err);
        } finally {
            await transactionManager.releaseTransaction();
        }
    }

    async updateFreezeStatusForWeeklyWorker(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        const transactionManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionManager.startTransaction();
            const filter: any = { date: Between(req.attnFromDate, req.attnToDate) };
            if (req.branch) {
                filter.branch = req.branch === "ALL" ? "" : req.branch;
            }
            if (req.employeeId) {
                filter.empId = req.employeeId;
            }
            if (req.division) {
                filter.divisionId = req.division;
            }
            if (req.department) {
                filter.departmentId = req.department;
            }
            const existingRecord = await this.attendanceRepo.findOne({ where: filter });
            if (existingRecord && existingRecord.freezeStatus === "Y" && req.status === "Y") {
                return new CommonResponseModel(false, 0, "Attendance is already frozen. Please unfreeze before proceeding.");
            }
            await this.attendanceRepo.update(filter, { freezeStatus: req.status });
            if (req.status === "Y") {
                await this.payrollAttnService.createPayrollAttendanceForWeekly(req);
            }
            await transactionManager.completeTransaction();
            return new CommonResponseModel(true, 1111, 'Attendance freeze status updated successfully');
        } catch (err) {
            await transactionManager.releaseTransaction();
            return new CommonResponseModel(false, 0, 'Something went wrong', err);
        } finally {
            await transactionManager.releaseTransaction();
        }
    }

    async getAllAdjustments(req: AttendanceAdjustRequest): Promise<any> {
        return await this.attendanceRepo.getAllAttnAdjustment(req);
    }
    //over all top 5 leaves
    @Cron('00 00 18 * * 6')
    async absentStatusWhatsApi(status?: boolean, zone?: string) {
        try {
            const absenteData = await this.attendanceRepo.absentStatusWhatsApi();
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
            let textReport = `*Generated on* : ${year}-${month}-${date} ${hours}:${minutes}:${seconds} \\n \\n*Month* : ${monthName} - ${year} \\n \\n`

            if (absenteData.length > 0) {
                absenteData.forEach((row: any) => {
                    const empName = row.empName;
                    const totalAbsent = String(row.totalAbsent);
                    textReport += `*Emp Name* :  ${empName.padEnd(20, ' ')}\\n*Absent* : ${totalAbsent}\\n`;
                    textReport += '\\n';
                });
                textReport = textReport.replace(/\s{5,}/g, '    ');
                const phoneNumbers = [8977774446];
                for (const phoneNumber of phoneNumbers) {
                    await this.whatsService.aabsentLeaveStatusWhatsappApi(
                        phoneNumber,
                        textReport,
                        'top_five_absents'
                    );
                }
                return new CommonResponseModel(true, 1, 'MessageSended')
            } else {
                return new CommonResponseModel(false, 0, 'no data')

            }
        } catch (error) {
            console.error('Error sending bot alert:', error);
        }
    }

    // over all top 10 leaves 
    //    @Cron('0 0 18 L * *')
    async leaveStatusWhatsApi(status?: boolean, zone?: string) {
        try {
            const leaveData = await this.attendanceRepo.leaveStatusWhatsApiRepo();
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);



            let textReport = `*Generated on* : ${year}-${month}-${date} ${hours}:${minutes}:${seconds} \\n \\n*Month* : ${monthName} - ${year} \\n \\n`

            if (leaveData.length > 0) {
                leaveData.forEach((row: any) => {
                    const empName = row.empName;
                    const totalLeave = String(row.totalLeave);
                    textReport += `*Emp Name* :  ${empName.padEnd(20, ' ')}\\n*Leave* : ${totalLeave}\\n`;
                    textReport += '\\n';
                });
                textReport = textReport.replace(/\s{5,}/g, '    ');
                const phoneNumbers = [9393957871, 8977774446, 6281481725];
                for (const phoneNumber of phoneNumbers) {
                    await this.whatsService.aabsentLeaveStatusWhatsappApi(
                        phoneNumber,
                        textReport,
                        'top_ten_leaves'
                    );
                }
                return new CommonResponseModel(true, 1, 'Message send Successfully')
            } else {
                return new CommonResponseModel(false, 0, 'No Data')
            }
        } catch (error) {
            console.error('Error sending bot alert:', error);
        }
    }

    @Cron('00 30 17 * * *')
    //@Cron('00 10 * * *')
    async attedanceStatusWhatsappAlert(status?: boolean, zone?: string): Promise<any> {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const countData = await this.attendanceRepo.attedanceStatusWhatsappAlertRepo();
            // const lessTop5WorkingHours = await this.attendanceRepo.attendanceStatusWhatsappAlertTop5LessWorkingHours();
            // const lessTop10WorkingHours = await this.attendanceRepo.attendnaceStatusWhatsappAlertLessWrokingHours();
            // const totalEmployees = await this.employeeService.attendanceWhatsappAlertCountEmployee();
            // const countEmployee = await this.employeeService.attendanceWhatsappAlertCountEmployee();

            const branches: any = {};
            countData.forEach((row: any) => {
                const branchName = row.branchName || 'Not Specified';
                if (!branches[branchName]) {
                    branches[branchName] = {};
                }
                if (!branches[branchName][row.shiftType]) {
                    branches[branchName][row.shiftType] = [];
                }
                branches[branchName][row.shiftType].push(row);
            });
            // console.log(countEmployee, 'countEmployee');
            //const phoneNumbers = [6281481725, 8977774446, 6281173347];
            const phoneNumbers = [8977774446, 6281173347, 9390397853];

            let totalEmployeeCount = 0
            let totalPresent = 0
            let totalWfh = 0
            let totalAbsent = 0
            let totalLeave = 0
            let TotalInPunchMissing = 0
            let TotalOutPunchMissing = 0

            for (const branch in branches) {
                for (const shift in branches[branch]) {
                    let textReport = `*Generated on* : ${date}-${month}-${year} ${hours}:${minutes}:${seconds}\\n`;
                    textReport += `*Attendance Date* : ${date}-${month}-${year}\\n`;
                    textReport += `*Branch* : ${branch}\\n`;
                    textReport += `*Shift* : ${shift}\\n`;
                    // Attendance data for the shift
                    branches[branch][shift].forEach((row: any) => {
                        textReport += `*Total Employees* : ${row.countEmpName || 0}\\n`;
                        textReport += `*Present* : ${row.attnStatus || 0}\\n`;
                        textReport += `*WFH* : ${row.wfhStatus || 0}\\n`;
                        textReport += `*Absent* : ${row.absentStatus || 0}\\n`;
                        textReport += `*Leaves* : ${row.leaveStatus || 0}\\n`;
                        textReport += `*In Punch Missing* : ${row.inPunching || 0}\\n`;
                        textReport += `*Out Punch Missing* : ${row.outPunching || 0}\\n`;

                        totalEmployeeCount += row.countEmpName
                        totalPresent += row.attnStatus
                        totalWfh += row.wfhStatus
                        totalAbsent += row.absentStatus
                        totalLeave += row.leaveStatus
                        TotalInPunchMissing += row.inPunching
                        TotalOutPunchMissing += row.outPunching

                    });

                    // Less working hours for the shift
                    // const lessWorkingHoursForShift = lessTop10WorkingHours.find(
                    //     (row: any) => row.branchName === branch && row.shiftType === shift
                    // );
                    // const totalRecordsWithLessThan8Hours = lessWorkingHoursForShift
                    //     ? lessWorkingHoursForShift.totalRecordsWithLessThan8Hours
                    //     : 0;
                    // textReport += `*Less Working Hours (<8 hrs)*: ${totalRecordsWithLessThan8Hours}\n`;

                    // // Top 5 less working hours for the shift
                    // const top5ForShift = lessTop5WorkingHours.filter(
                    //     (row: any) => row.branchName === branch && row.shiftType === shift
                    // );
                    // if (top5ForShift.length > 0) {
                    //     textReport += `*Top 5 Less Working Hours*:\n`;
                    //     top5ForShift.forEach((row: any, index: number) => {
                    //         textReport += `${index + 1}. ${row.employeeName} (${row.totalDuration})\n`;
                    //     });
                    // } else {
                    //     textReport += `*Top 5 Less Working Hours*: None\n`;
                    // }


                    for (const phoneNumber of phoneNumbers) {
                        await this.whatsService.aabsentLeaveStatusWhatsappApi(
                            phoneNumber,
                            textReport,
                            'attendance_management_system'
                        );
                        // console.log(`Message sent to ${phoneNumber} for branch ${branch}, shift ${shift}`);
                    }
                }
            }

            let textMsgReport = `*Generated on* : ${date}-${month}-${year} ${hours}:${minutes}:${seconds}\\n`;
            textMsgReport += `*Attendance Date* : ${date}-${month}-${year}\\n`;
            textMsgReport += `*Branch* : All VRPL Branches \\n`;
            textMsgReport += `*Shift* : others \\n`;
            textMsgReport += `*Total Employees* : ${totalEmployeeCount || 0}\\n`;
            textMsgReport += `*Present* : ${totalPresent || 0}\\n`;
            textMsgReport += `*WFH* : ${totalWfh || 0}\\n`;
            textMsgReport += `*Absent* : ${totalAbsent || 0}\\n`;
            textMsgReport += `*Leaves* : ${totalLeave || 0}\\n`;
            textMsgReport += `*In Punch Missing* : ${TotalInPunchMissing || 0}\\n`;
            textMsgReport += `*Out Punch Missing* : ${TotalOutPunchMissing || 0}\\n`;

            for (const phoneNumber of phoneNumbers) {
                await this.whatsService.aabsentLeaveStatusWhatsappApi(
                    phoneNumber,
                    textMsgReport,
                    'attendance_management_system'
                );
                // console.log(`Message sent to ${phoneNumber}`);
            }

            return new CommonResponseModel(true, 1, 'Messages Sent for all Branch and Shift-wise Data');
        } catch (err) {
            return new CommonResponseModel(false, 0, 'Error in sending WhatsApp messages');
        }
    }

    //direction-wise
    // @Cron('*/15 * * * *')
    // async processAttendanceFromSwipe(): Promise<CommonResponseModel> {
    //     try {
    //         const records = await this.attendanceSwipesRepo.getAttendanceNewSwipes();
    //         if (records.length === 0) {
    //             return new CommonResponseModel(false, 11101, 'No logs found');
    //         }

    //         for (const record of records) {
    //             const empCode = record.employeeNumber;
    //             const empName = record.employeeName;
    //             // const empBranch = record.branch;
    //             const date = moment(record.swipeDate).format('YYYY-MM-DD');
    //             const swipeDateTime = moment(`${record.swipeDate}T${record.swipeTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();

    //             const empRecord = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(date, empCode);

    //             if (empRecord) {
    //                 const inTime = empRecord.in_time ? moment(empRecord.in_time).format('HH:mm:ss') : null;
    //                 const outTime = empRecord.out_time ? moment(empRecord.out_time).format('HH:mm:ss') : null;

    //                 if (empRecord.attn_status === 'A') {
    //                     if (record.inOut === "IN") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'P', inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'P', outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                     await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                 } else if (empRecord.attn_status === 'P') {
    //                     if (record.inOut === "IN" && (!inTime || moment(swipeDateTime).isBefore(moment(empRecord.in_time)))) {

    //                         await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT" && (!outTime || moment(swipeDateTime).isAfter(moment(empRecord.out_time)))) {
    //                         await this.attendanceRepo.update({ empCode, date }, { outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else {
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                 } else if (empRecord.attn_status === 'W') {
    //                     if (record.inOut === "IN") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'WP', inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'WP', outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                     await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                 } else if (empRecord.attn_status === 'WP') {
    //                     if (record.inOut === "IN" && (!inTime || moment(swipeDateTime).isBefore(moment(empRecord.in_time)))) {

    //                         await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT" && (!outTime || moment(swipeDateTime).isAfter(moment(empRecord.out_time)))) {
    //                         await this.attendanceRepo.update({ empCode, date }, { outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else {
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                 } else if (empRecord.attn_status === 'H') {
    //                     if (record.inOut === "IN") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'HP', inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT") {
    //                         await this.attendanceRepo.update({ empCode, date }, { attnStatus: 'HP', outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                     await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                 } else if (empRecord.attn_status === 'HP') {
    //                     if (record.inOut === "IN" && (!inTime || moment(swipeDateTime).isBefore(moment(empRecord.in_time)))) {

    //                         await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else if (record.inOut === "OUT" && (!outTime || moment(swipeDateTime).isAfter(moment(empRecord.out_time)))) {
    //                         await this.attendanceRepo.update({ empCode, date }, { outTime: swipeDateTime });
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     } else {
    //                         await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //                     }
    //                 }
    //             } else {
    //                 console.error(`Employee record not found for empCode: ${empCode}, date: ${date}`);
    //                 const req = new EmployeeCodeReq(empCode)
    //                 const newEmpDeatails = await this.employeeService.getEmpCodeByDetails(req)
    //                 if (newEmpDeatails.data.length > 0) {
    //                     const newAttendance = new AttendanceEntity();
    //                     newAttendance.empCode = empCode;
    //                     newAttendance.empName = `${newEmpDeatails.data[0]?.first_name || ''} ${newEmpDeatails.data[0]?.last_name || ''}`.trim();
    //                     newAttendance.date = date;
    //                     newAttendance.attnStatus = 'P';
    //                     newAttendance.freezeStatus = 'N';
    //                     newAttendance.empId = newEmpDeatails.data[0].id;
    //                     newAttendance.departmentId = newEmpDeatails.data[0].department_id;
    //                     newAttendance.designationId = newEmpDeatails.data[0].designation_id;
    //                     newAttendance.divisionId = newEmpDeatails.data[0].division_id;
    //                     newAttendance.branch = newEmpDeatails.data[0].branch_id;
    //                     newAttendance.attendanceMonth = moment(record.swipeDate).format('YYYYMM');

    //                     if (record.inOut === "IN") {
    //                         newAttendance.inTime = swipeDateTime;
    //                     } else if (record.inOut === "OUT") {
    //                         newAttendance.outTime = swipeDateTime;
    //                     }
    //                     await this.attendanceRepo.save(newAttendance);

    //                 } else {
    //                     const newAttendance = new AttendanceEntity();
    //                     newAttendance.empCode = empCode;
    //                     newAttendance.empName = empName;
    //                     newAttendance.date = date;
    //                     newAttendance.attnStatus = 'P';
    //                     newAttendance.freezeStatus = 'N';
    //                     // newAttendance.branch = empBranch;
    //                     newAttendance.attendanceMonth = moment(record.swipeDate).format('YYYYMM');

    //                     if (record.inOut === "IN") {
    //                         newAttendance.inTime = swipeDateTime;
    //                     } else if (record.inOut === "OUT") {
    //                         newAttendance.outTime = swipeDateTime;
    //                     }
    //                     await this.attendanceRepo.save(newAttendance);
    //                 }



    //                 await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });
    //             }
    //         }

    //         return new CommonResponseModel(true, 200, 'Attendance processed successfully');
    //     } catch (error) {
    //         console.error("Error processing attendance logs:", error);
    //         return new CommonResponseModel(false, 500, 'Error processing attendance logs');
    //     }
    // }

    // @Cron('*/05 * * * *')
    // async processAttendanceFromSwipe(): Promise<CommonResponseModel> {
    //     try {
    //         const records = await this.attendanceSwipesRepo.getAttendanceNewSwipes();
    //         if (records.length === 0) {
    //             return new CommonResponseModel(false, 11101, 'No logs found');
    //         }
    //         for (const record of records) {
    //             const empCode = record.employeeNumber;
    //             const empName = record.employeeName;
    //             const swipeDateTime = moment(`${record.swipeDate}T${record.swipeTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
    //             let date = moment(record.swipeDate).format('YYYY-MM-DD');
    //             // Check if the swipe time is <7:00 and validate if the employee worked the C shift the previous day
    //             if (swipeDateTime.getHours() < 7) {
    //                 const prevDate = moment(record.swipeDate).subtract(1, 'day').format('YYYY-MM-DD');
    //                 const prevDayRecord = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(prevDate, empCode);

    //                 if (prevDayRecord && prevDayRecord.shift === 'C') {
    //                     date = prevDate; // Adjust the date to the previous day
    //                 }
    //             }

    //             const empRecord = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(date, empCode);

    //             if (empRecord) {
    //                 const minSwipeTime = empRecord.in_time
    //                     ? moment(empRecord.in_time).format('HH:mm:ss')
    //                     : null;
    //                 const maxSwipeTime = empRecord.out_time
    //                     ? moment(empRecord.out_time).format('HH:mm:ss')
    //                     : null;

    //                 // Update first in and last out logic
    //                 if (!minSwipeTime || moment(swipeDateTime).isBefore(moment(empRecord.in_time))) {
    //                     await this.attendanceRepo.update(
    //                         { empCode, date },
    //                         { inTime: swipeDateTime }
    //                     );
    //                     // Update shift only if it is null
    //                     if (empRecord.shift === null) {
    //                         const swipeHour = swipeDateTime.getHours();
    //                         let newShift = null;
    //                         if (swipeHour >= 4 && swipeHour < 8) {
    //                             newShift = 'A';
    //                         } else if (swipeHour >= 8 && swipeHour < 13) {
    //                             newShift = 'G';
    //                         } else if (swipeHour >= 13 && swipeHour < 18) {
    //                             newShift = 'B';
    //                         } else if (swipeHour >= 18 || swipeHour < 7) {
    //                             newShift = 'C';
    //                         }
    //                         await this.attendanceRepo.update(
    //                             { empCode, date },
    //                             { shift: newShift }
    //                         );
    //                     }
    //                 } else if (!maxSwipeTime || moment(swipeDateTime).isAfter(moment(empRecord.out_time))) {
    //                     // Update outTime for the later swipe
    //                     await this.attendanceRepo.update(
    //                         { empCode, date },
    //                         { outTime: swipeDateTime }
    //                     );

    //                     // Update working_hours column after updating out_time
    //                     const inTime = empRecord.in_time ? moment(empRecord.in_time) : null;
    //                     const outTime = moment(swipeDateTime);
    //                     if (inTime) {
    //                         const workingDuration = moment.duration(outTime.diff(inTime));
    //                         const workingHours = `${String(Math.floor(workingDuration.asHours())).padStart(2, '0')}:${String(workingDuration.minutes()).padStart(2, '0')}:${String(workingDuration.seconds()).padStart(2, '0')}`;
    //                         await this.attendanceRepo.update(
    //                             { empCode, date },
    //                             { wkHrs: workingHours }
    //                         );
    //                     }
    //                 } else {
    //                     // If swipe is earlier than both inTime and outTime, update inTime
    //                     await this.attendanceRepo.update(
    //                         { empCode, date },
    //                         { inTime: swipeDateTime }
    //                     );
    //                 }

    //                 // Update attendance status based on current status
    //                 const newStatus = this.updateAttendanceStatus(empRecord.attn_status);
    //                 if (newStatus !== empRecord.attn_status) {
    //                     await this.attendanceRepo.update(
    //                         { empCode, date },
    //                         { attnStatus: newStatus }
    //                     );
    //                 }
    //             } else {
    //                 // Handle new attendance record creation
    //                 const req = new EmployeeCodeReq(empCode);
    //                 const newEmpDetails = await this.employeeService.getEmpCodeByDetails(req);

    //                 const newAttendance = new AttendanceEntity();
    //                 newAttendance.empCode = empCode;
    //                 newAttendance.empName = newEmpDetails.data.length > 0
    //                     ? `${newEmpDetails.data[0]?.first_name || ''} ${newEmpDetails.data[0]?.last_name || ''}`.trim()
    //                     : empName;
    //                 newAttendance.date = date;
    //                 newAttendance.attnStatus = 'P';
    //                 newAttendance.freezeStatus = 'N';
    //                 newAttendance.inTime = swipeDateTime;
    //                 newAttendance.outTime = null;

    //                 if (newEmpDetails.data.length > 0) {
    //                     newAttendance.empId = newEmpDetails.data[0].id;
    //                     newAttendance.departmentId = newEmpDetails.data[0].department_id;
    //                     newAttendance.designationId = newEmpDetails.data[0].designation_id;
    //                     newAttendance.divisionId = newEmpDetails.data[0].division_id;
    //                     newAttendance.branch = newEmpDetails.data[0].branch_id;
    //                 }

    //                 // Assign shift based on first punch time
    //                 const swipeHour = swipeDateTime.getHours();
    //                 if (swipeHour >= 4 && swipeHour < 8) {
    //                     newAttendance.shift = 'A';
    //                 } else if (swipeHour >= 8 && swipeHour < 13) {
    //                     newAttendance.shift = 'G';
    //                 } else if (swipeHour >= 13 && swipeHour < 18) {
    //                     newAttendance.shift = 'B';
    //                 } else if (swipeHour >= 18 || swipeHour < 7) {
    //                     newAttendance.shift = 'C';
    //                 } else {
    //                     newAttendance.shift = null;
    //                 }

    //                 newAttendance.attendanceMonth = moment(record.swipeDate).format('YYYYMM');
    //                 await this.attendanceRepo.save(newAttendance);
    //             }

    //             // Mark swipe record as processed
    //             await this.attendanceSwipesRepo.update(
    //                 { id: record.id },
    //                 { status: 1 }
    //             );
    //         }

    //         return new CommonResponseModel(true, 200, 'Attendance processed successfully');
    //     } catch (error) {
    //         console.error('Error processing attendance logs:', error);
    //         return new CommonResponseModel(false, 500, 'Error processing attendance logs');
    //     }
    // 

    @Cron('*/05 * * * *')
    async processAttendanceFromSwipe(): Promise<CommonResponseModel> {
        try {
            const records = await this.attendanceSwipesRepo.getAttendanceNewSwipes();
            console.log(records, "Fetched Swipe Records");

            if (records.length === 0) {
                return new CommonResponseModel(false, 11101, 'No logs found');
            }

            // Remove duplicate swipes for the same employee on the same date & time
            const uniqueRecords = records.filter((record, index, self) =>
                index === self.findIndex((r) =>
                    r.employeeNumber === record.employeeNumber &&
                    r.swipeDate === record.swipeDate &&
                    r.swipeTime === record.swipeTime
                )
            );

            // Object to track attendance updates per employee per day
            const attendanceUpdates: { [key: string]: { inTime: Date | null, outTime: Date | null } } = {};

            for (const record of uniqueRecords) {
                const empCode = record.employeeNumber;
                const swipeDateTime = moment(`${record.swipeDate}T${record.swipeTime}`, 'YYYY-MM-DDTHH:mm:ss').toDate();
                let date = moment(record.swipeDate).format('YYYY-MM-DD');

                // Adjust shift if swipe time is before 7 AM
                if (swipeDateTime.getHours() < 7) {
                    const prevDate = moment(record.swipeDate).subtract(1, 'day').format('YYYY-MM-DD');
                    const prevDayRecord = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(prevDate, empCode);
                    if (prevDayRecord && prevDayRecord.shift === 'C') {
                        date = prevDate;
                    }
                }

                // Fetch attendance record for the employee
                const empRecord = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(date, empCode);

                if (!attendanceUpdates[`${empCode}-${date}`]) {
                    attendanceUpdates[`${empCode}-${date}`] = { inTime: null, outTime: null };
                }

                if (empRecord) {
                    let { inTime, outTime } = attendanceUpdates[`${empCode}-${date}`];

                    // Use existing DB values if available
                    inTime = inTime || empRecord.in_time;
                    outTime = outTime || empRecord.out_time;
                    if (!inTime) {
                        // Only update inTime if it's earlier than the current inTime
                        attendanceUpdates[`${empCode}-${date}`].inTime = swipeDateTime;
                        const newStatus = this.updateAttendanceStatus(empRecord.attn_status);
                        await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime, attnStatus: newStatus });
                    } else if (moment(swipeDateTime).isBefore(moment(inTime)) && !outTime) {
                        // Only update inTime if it's earlier than the current inTime
                        attendanceUpdates[`${empCode}-${date}`].inTime = swipeDateTime;
                        attendanceUpdates[`${empCode}-${date}`].outTime = empRecord.in_time;
                        await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime, outTime: empRecord.in_time });
                    } else if (moment(swipeDateTime).isBefore(moment(inTime)) && outTime) {
                        // Only update inTime if it's earlier than the current inTime
                        attendanceUpdates[`${empCode}-${date}`].inTime = swipeDateTime;
                        attendanceUpdates[`${empCode}-${date}`].outTime = outTime;
                        await this.attendanceRepo.update({ empCode, date }, { inTime: swipeDateTime });
                    } else if (!outTime || moment(swipeDateTime).isAfter(moment(outTime))) {
                        // Only update outTime if it's later than the current outTime
                        attendanceUpdates[`${empCode}-${date}`].outTime = swipeDateTime;
                        await this.attendanceRepo.update({ empCode, date }, { outTime: swipeDateTime });
                    }
                } else {
                    // New attendance record creation
                    const req = new EmployeeCodeReq(empCode);
                    const newEmpDetails = await this.employeeService.getEmpCodeByDetails(req);

                    const newAttendance = new AttendanceEntity();
                    newAttendance.empCode = empCode;
                    newAttendance.empName = newEmpDetails.data.length > 0
                        ? `${newEmpDetails.data[0]?.first_name || ''} ${newEmpDetails.data[0]?.last_name || ''}`.trim()
                        : record.employeeName;
                    newAttendance.date = date;
                    newAttendance.attnStatus = 'P';
                    newAttendance.freezeStatus = 'N';
                    newAttendance.inTime = swipeDateTime;
                    newAttendance.outTime = null;

                    if (newEmpDetails.data.length > 0) {
                        newAttendance.empId = newEmpDetails.data[0].id;
                        newAttendance.departmentId = newEmpDetails.data[0].department_id;
                        newAttendance.designationId = newEmpDetails.data[0].designation_id;
                        newAttendance.divisionId = newEmpDetails.data[0].division_id;
                        newAttendance.branch = newEmpDetails.data[0].branch_id;
                    }

                    // Assign shift based on swipe time
                    const swipeHour = swipeDateTime.getHours();
                    if (swipeHour >= 4 && swipeHour < 8) {
                        newAttendance.shift = 'A';
                    } else if (swipeHour >= 8 && swipeHour < 13) {
                        newAttendance.shift = 'G';
                    } else if (swipeHour >= 13 && swipeHour < 18) {
                        newAttendance.shift = 'B';
                    } else {
                        newAttendance.shift = 'C';
                    }

                    newAttendance.attendanceMonth = moment(record.swipeDate).format('YYYYMM');
                    await this.attendanceRepo.save(newAttendance);

                    // Store initial inTime
                    attendanceUpdates[`${empCode}-${date}`] = { inTime: swipeDateTime, outTime: null };
                }

                // Mark unique swipe record as processed
                await this.attendanceSwipesRepo.update({ id: record.id }, { status: 1 });

                const empRecord1 = await this.attendanceRepo.getEmpAttendanceRecordByCodeAndDate(date, empCode);
                if (empRecord1) {
                    let inTime = empRecord1.in_time;
                    let outTime = empRecord1.out_time;
                    // Calculate and update working hours only if inTime is valid
                    if (inTime && outTime) {
                        const inMoment = moment(inTime);
                        const outMoment = moment(outTime);
                        const workingDuration = moment.duration(outMoment.diff(inMoment));
                        const workingHours = `${String(Math.floor(workingDuration.asHours())).padStart(2, '0')}:${String(workingDuration.minutes()).padStart(2, '0')}:${String(workingDuration.seconds()).padStart(2, '0')}`;
                        await this.attendanceRepo.update({ empCode, date }, { wkHrs: workingHours });
                    }
                }
            }

            const allEmployeeIds = records.map((r) => r.id);
            const allE = records.map((r) => r.employeeNumber);
            if (allEmployeeIds.length > 0) {
                await this.attendanceSwipesRepo.update({ id: In(allEmployeeIds) }, { status: 1 });
            }
            const todaysDate = new Date();
            const formattedDate = todaysDate.toISOString().split('T')[0];
            const rrr = [allE, formattedDate]
            await this.empService.updateLastAttnStatus(rrr);
            return new CommonResponseModel(true, 200, 'Attendance processed successfully');
        } catch (error) {
            console.error('Error processing attendance logs:', error);
            return new CommonResponseModel(false, 500, 'Error processing attendance logs');
        }
    }

    // Helper method to update attendance status
    updateAttendanceStatus(currentStatus: string): string {
        switch (currentStatus) {
            case 'A': return 'P';
            case 'W': return 'WP';
            case 'H': return 'HP';
            default: return currentStatus;
        }
    }



    async weeklyAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const empData = await this.attendanceRepo.weeklyAttendance(req)
            return empData.length > 0
                ? new CommonResponseModel(true, 1, ' Data retrieved successfully', empData)
                : new CommonResponseModel(false, 2, 'No data found', [])
        } catch (err) {
            throw (err)
        }
    }

    async dailyAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const [checkedInData, checkedOutData, onLeaveData, absentData] = await Promise.all([
                this.attendanceRepo.getCheckedInCount(req),
                this.attendanceRepo.getCheckedOutCount(req),
                this.attendanceRepo.getLeaveCount(req),
                this.attendanceRepo.getAbsentCount(req)
            ])

            const attendanceCardData = [{
                totalCheckedIn: checkedInData[0].checkedInCount,
                maleCheckedIn: checkedInData[0].maleCount,
                femaleCheckedIn: checkedInData[0].femaleCount,
                totalCheckedOut: checkedOutData[0].checkedOutCount,
                maleCheckedOut: checkedOutData[0].maleCount,
                femaleCheckedOut: checkedOutData[0].femaleCount,
                totalLeaveCount: onLeaveData[0].onLeaveCount,
                maleLeave: onLeaveData[0].maleCount,
                femaleLeave: onLeaveData[0].femaleCount,
                totalAbsentCount: absentData[0].absentCount,
                maleAbsent: absentData[0].maleCount,
                femaleAbsent: absentData[0].femaleCount
            }]

            return new CommonResponseModel(true, 1, 'Data retrieved', attendanceCardData)

        } catch (err) {
            throw (err)
        }
    }

    //  top 10 leaves with branch wise
    //   @Cron('0 0 18 L * *')
    async leaveStatusWhatsApiwithBranchWise(status?: boolean, zone?: string) {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);

            const leaveData = await this.attendanceRepo.leaveStatusWhatsApiwithBranchWise();
            if (leaveData.length > 0) {
                // Group the data by branch
                const groupedData = leaveData.reduce((acc: any, row: any) => {
                    const branchName = row.branch;
                    if (!acc[branchName]) {
                        acc[branchName] = [];
                    }
                    acc[branchName].push({ empName: row.empName, totalLeave: row.totalLeave });
                    return acc;
                }, {});

                // Generate alerts for each branch
                for (const branchName in groupedData) {
                    const employees = groupedData[branchName];

                    // Sort by totalLeave in descending order and pick the top 5
                    const top5Employees = employees
                        .sort((a: any, b: any) => b.totalLeave - a.totalLeave)
                        .slice(0, 10);

                    const now = new Date();
                    const year = now.getFullYear();
                    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);

                    let textReport = `*Generated on* : ${year}-${month}-${date} ${hours}:${minutes}:${seconds}\\n\\n`;
                    textReport += `*Branch*: ${branchName}\\n\\n`;
                    textReport += `*Month*: ${monthName} - ${year}\\n\\n`;


                    // Add top 5 employee details
                    top5Employees.forEach((employee: any, index: number) => {
                        textReport += `*Emp Name*: ${employee.empName}\\n`;
                        textReport += `*Leave* : ${employee.totalLeave}\\n\\n`;
                    });

                    // WhatsApp service - Send alert for this branch
                    const phoneNumbers = [9393957871, 8977774446, 6281481725]; // Add more phone numbers as required
                    for (const phoneNumber of phoneNumbers) {
                        await this.whatsService.aabsentLeaveStatusWhatsappApi(
                            phoneNumber,
                            textReport,
                            'top_ten_leaves'
                        );
                    }
                }
                return new CommonResponseModel(true, 1, 'Messages Sent');
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found');
            }
        } catch (error) {
            console.error('Error sending branch-wise alerts:', error);
            return new CommonResponseModel(false, 0, 'Error Occurred');
        }
    }

    // branch wise absent list(top 5)
    @Cron('00 00 18 * * 6')
    async absentStatusWhatsApiwithBranchWise(status?: boolean, zone?: string) {
        try {
            const absenteData = await this.attendanceRepo.absentStatusWhatsApiwithBranchWise();
            if (absenteData.length > 0) {
                const groupedData = absenteData.reduce((acc: any, row: any) => {
                    const branchName = row.branchName;
                    if (!acc[branchName]) {
                        acc[branchName] = [];
                    }
                    acc[branchName].push({ empName: row.empName, totalAbsent: row.totalAbsent });
                    return acc;
                }, {});

                for (const branchName in groupedData) {
                    const employees = groupedData[branchName];

                    // Sorting  by (totalAbsent )in descending order and picking  the top 5
                    const top5Employees = employees
                        .sort((a: any, b: any) => b.totalAbsent - a.totalAbsent)
                        .slice(0, 5);

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const date = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');

                    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
                    let textReport = `*Generated on* : ${year}-${month}-${date} ${hours}:${minutes}:${seconds} \\n \\n*Month* : ${monthName} - ${year} \\n \\n`
                    textReport += `*Branch*: ${branchName}\\n\\n`;
                    textReport += `*Month*: ${monthName} - ${year}\\n\\n`;
                    // textReport += `*Top 5 Absent Employees*:\\n`;

                    top5Employees.forEach((employee: any, index: number) => {
                        textReport += `*Emp Name*: ${employee.empName}\\n`;
                        textReport += `*Absent*: ${employee.totalAbsent}\\n\\n`;
                    });

                    const phoneNumbers = [8977774446];
                    for (const phoneNumber of phoneNumbers) {
                        await this.whatsService.aabsentLeaveStatusWhatsappApi(
                            phoneNumber,
                            textReport,
                            'top_five_absents'
                        );
                        // console.log(`Message sent to ${phoneNumber} for branch ${branchName}`);
                    }
                }

                // console.log('All branch-wise top 5 messages sent successfully!');
                return new CommonResponseModel(true, 1, 'Messages Sent');
            } else {
                // console.log('No absence data found.');
                return new CommonResponseModel(false, 0, 'No Data Found');
            }
        } catch (error) {
            console.error('Error sending branch-wise alerts:', error);
            return new CommonResponseModel(false, 0, 'Error Occurred');
        }
    }

    async attnAdjustmentBulkCreation(req: AttnAdjustmentCreateReq[]): Promise<CommonResponseModel> {
        try {
            if (!req || req.length === 0) {
                return new CommonResponseModel(false, 11, 'Invalid or empty request ');
            }
            const adjustments: AttendanceAdjustment[] = [];
            for (const item of req) {
                const existingRecord = await this.attnAdjustmentRepo.findOne({
                    where: {
                        employeeCode: item.employeeCode,
                        date: item.date
                    }
                });
                if (existingRecord) {
                    return new CommonResponseModel(false, 11, `Employee ${item.employeeName} has already applied for ${item.date}`);
                }
                const adjustment = new AttendanceAdjustment();
                adjustment.attendaceId = item.attendanceId;
                adjustment.employeeId = item.employeeId;
                adjustment.employeeCode = item.employeeCode;
                adjustment.employeeName = item.employeeName;
                adjustment.date = item.date;
                adjustment.oldInTime = item.oldInTime ? new Date(item.oldInTime) : null;
                adjustment.inTime = item.newInTime;
                adjustment.oldOutTime = item.oldOutTime ? new Date(item.oldOutTime) : null;
                adjustment.outTime = item.newOutTime;
                adjustment.presentStatus = item.presentStatus;
                adjustment.departmentId = item.departmentId;
                adjustment.unitId = item.branchId;
                adjustment.shift = item.shift || 0;
                adjustment.reason = item.reason || '';
                adjustment.appliedDate = new Date();
                adjustment.status = ApprovalStatusEnum.OPEN;
                adjustment.updatedUser = null;

                adjustments.push(adjustment); // Push into the array
            }

            // Save adjustments in bulk
            const result = await this.attnAdjustmentRepo.save(adjustments);

            return new CommonResponseModel(true, 11, 'Adjustment data saved successfully', result);
        } catch (error) {
            console.error('Error in attnAdjustmentBulkCreation:', error.message);
            return new CommonResponseModel(false, 11, 'Something went wrong during creation');
        }
    }

    async getDataByMonth(req: MonthReq): Promise<CommonResponseModel> {
        try {
            let page = 1;
            const limit = 1000;
            let allData = [];
            let hasMoreData = true;

            while (hasMoreData) {
                const data = await this.attendanceRepo.getDataByMonth(req, page, limit);
                allData = allData.concat(data);

                if (data.length < limit) {
                    hasMoreData = false;
                }

                page++;
            }

            return new CommonResponseModel(true, 1, 'Data retrieved', allData);
        } catch (err) {
            throw (err)
        }
    }

    async getBranchWiseAttendance(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const branchData = await this.attendanceRepo.getBranchWiseAttendance(req);

            if (branchData.length > 0) {
                for (const branch of branchData) {
                    const empTypeReq = { ...req, branchId: branch.branch_id };
                    const empTypeData = await this.attendanceRepo.getEmpTypeByBranch(empTypeReq);
                    branch.empTypeData = empTypeData;
                }

                return new CommonResponseModel(true, 1, 'Data retrieved', branchData);
            } else {
                return new CommonResponseModel(false, 0, 'No data', []);
            }
        } catch (err) {
            throw err;
        }
    }


    async getAllEmpMonthWiseDataWithoutPagination(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            const rawData = await this.attendanceRepo.getAllEmpMonthWiseDataWithoutPaginationRepo(req);
            const lateData = await this.attendanceRepo.getLateMinuteByEmployee()
            const payrollMonthData = `${req.date}`;
            const filteredData = rawData.filter(rec => rec.attendance_month === payrollMonthData);
            const empMap = new Map<number, PayRollAttnDto>();
            let resultData = [];
            const lateDataMap = new Map<number, number>();
            for (const record of lateData) {
                const [hours, minutes, seconds] = record.total_late_hours.split(':').map(Number);
                const totalLateMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
                const adjustedLateMinutes = Math.max(totalLateMinutes - 130, 0);
                lateDataMap.set(record.emp_id, adjustedLateMinutes);
            }
            for (const rec of filteredData) {
                // console.log(rec, 'RRRRRRRRRRRRRRRRRRRRRRRr')
                if (!empMap.has(rec.emp_id)) {
                    let presentCount = 0;
                    let absentCount = 0;
                    let leaveCount = 0;
                    let coCount = 0;
                    let odCount = 0;
                    let wpCount = 0;
                    let woCount = 0;
                    let splOtHours
                    let holidayCount = 0;
                    let hpCount = 0;
                    let payDays = 0;
                    let allowanceDays = 0;
                    let lateMinutes = 0;
                    let finalDeductionInDays = 0

                    if (rec.attnStatus === 'P') {
                        presentCount = 1;
                    } else if (rec.attnStatus === 'P/2') {
                        presentCount = 0.5;
                        absentCount = 0.5; // Since the remaining half is absent
                    }
                    if (rec.attnStatus === 'A') {
                        absentCount = 1;
                    }
                    if (rec.leaveStatus !== 'A' || rec.leaveStatus == null) {
                        if (rec.leaveStatus.endsWith('/2')) {
                            leaveCount += 0.5; // Half-day leave
                        } else {
                            leaveCount += 1; // Full-day leave
                        }
                    }
                    absentCount = Math.max(absentCount - leaveCount, 0);
                    if (rec.attnStatus === 'CO') {
                        coCount++;
                    }
                    if (rec.attnStatus === 'OD') {
                        odCount++;
                    }
                    if ((rec.attnStatus) === 'WP' || (rec.attnStatus) === 'wp') {
                        wpCount += 1;
                    }
                    if ((rec.attnStatus) === 'W' || (rec.attnStatus) === 'w') {
                        woCount += 1;
                    }
                    if (rec.attnStatus === 'WP' || rec.attnStatus === 'wp') {
                        wpCount += 0.5;
                        woCount += 0.5;
                    }
                    if (rec.attnStatus === 'H') {
                        holidayCount = 1;
                    }
                    if (rec.attnStatus === 'HP') {
                        hpCount = 1;
                    }
                    if (rec.attnStatus === 'HP/2') {
                        hpCount += 0.5;
                        holidayCount += 0.5
                    }
                    if (rec.splOtHours) {
                        const [hours, minutes, seconds] = rec.splOtHours.split(':').map(Number);
                        splOtHours = (hours * 3600) + (minutes * 60) + seconds;
                    }
                    const monthDays = moment(req.date, 'YYYY-MM').daysInMonth();
                    if (rec.employeeType === 'EMPLOYEE') {
                        if (presentCount == 0) {
                            payDays = 0;
                        } else {
                            if (monthDays <= 30) {
                                payDays = 30 - absentCount + leaveCount;
                            } else if (monthDays === 31) {
                                payDays = absentCount <= 15 ? 30 - absentCount + leaveCount : 31 - absentCount + leaveCount;
                            }
                        }
                    } else if (rec.employeeType === 'WORKER') {
                        payDays = presentCount + woCount + holidayCount + wpCount + hpCount;
                        allowanceDays = wpCount + hpCount;
                    } else if (rec.employeeType === 'KARLAM WORKER') {
                        payDays = presentCount + leaveCount + woCount + wpCount + holidayCount + hpCount;
                        allowanceDays = wpCount + hpCount;
                    }

                    finalDeductionInDays = Number(Number(presentCount) * 5) - Number(rec.totalLateMins) < 0 ? Number(((Math.abs(await this.deductionInDays(presentCount, rec.totalLateMins))) - Number(rec.available)).toFixed(1)) : 0

                    const data = new PayRollAttnDto(rec.emp_id, rec.empCode, presentCount, absentCount, leaveCount, coCount, odCount, wpCount, woCount, splOtHours, holidayCount, hpCount, rec.branchId, rec.divisionId, rec.created_user, rec.attn_from_date, rec.attn_to_date, rec.departmentId, rec.designationId, payrollMonthData, payDays, allowanceDays, lateDataMap.get(rec.emp_id) || 0, rec.employeeTypeId, rec.bankName, rec.bankAccNo, rec.bankIfscCode, rec.payMode, finalDeductionInDays, rec.lopCountData
                    );
                    data.lateMinutes = lateDataMap.get(rec.emp_id) || 0;
                    empMap.set(rec.emp_id, data);
                    resultData.push(data);
                } else {
                    const data = empMap.get(rec.emp_id);
                    if (rec.attnStatus === 'P') {
                        data.presentCount += 1;
                    } else if (rec.attnStatus === 'P/2') {
                        data.presentCount += 0.5;
                        data.absentCount += 0.5;
                    }
                    if (rec.attnStatus === 'A') {
                        data.absentCount += 1;
                    }
                    if (rec.leaveStatus !== 'A' || rec.leaveStatus == null) {
                        if (rec.leaveStatus.endsWith('/2')) {
                            data.leaveCount += 0.5; // Half-day leave
                        } else {
                            data.leaveCount += 1; // Full-day leave
                        }
                    }
                    if (rec.attnStatus === 'CO') {
                        data.coCount++;
                    }
                    if (rec.attnStatus === 'OD') {
                        data.odCount++;
                    }

                    if ((rec.attnStatus) === 'WP' || (rec.attnStatus) === 'wp') {
                        data.wpCount += 1;
                    }
                    if ((rec.attnStatus) === 'W' || (rec.attnStatus) === 'w') {
                        data.woCount += 1;
                    }
                    if ((rec.attnStatus) === 'WP/2' || (rec.attnStatus) === 'wp/2') {
                        data.wpCount += 0.5;
                        data.woCount += 0.5;
                    }
                    if (rec.attnStatus === 'H') {
                        data.holidayCount = 1;
                    }
                    if (rec.attnStatus === 'HP') {
                        data.hpCount = 1;
                    }
                    if (rec.attnStatus === 'HP/2') {
                        data.hpCount += 0.5;
                        data.holidayCount += 0.5
                    }
                    if (rec.splOtHours) {
                        const [hours, minutes, seconds] = rec.splOtHours.split(':').map(Number);
                        const additionalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                        data.splOtHours += additionalSeconds;
                    }
                    const monthDays = moment(req.date, 'YYYY-MM').daysInMonth();
                    if (rec.employeeType === 'EMPLOYEE') {
                        data.lopCountData = data.absentCount - data.leaveCount
                        if (data.presentCount == 0) {
                            data.payDays = 0;
                        } else {
                            if (monthDays <= 30) {
                                data.payDays = 30 - data.absentCount + data.leaveCount;
                            } else if (monthDays === 31) {
                                data.payDays = data.absentCount <= 15 ? 30 - data.absentCount + data.leaveCount : 31 - data.absentCount + data.leaveCount;
                            } else if (monthDays === 31) {
                                data.payDays = data.absentCount <= 15 ? 30 - data.absentCount : 31 - data.absentCount;
                            }
                        }
                    }
                    else if (rec.employeeType === 'WORKER') {
                        data.payDays = data.presentCount;
                        data.allowanceDays = data.wpCount + data.hpCount;
                    } else if (rec.employeeType === 'KARLAM WORKER') {
                        data.payDays = data.presentCount + data.leaveCount + data.woCount + data.wpCount + data.holidayCount + data.hpCount;
                        data.allowanceDays = data.wpCount + data.hpCount;
                    }

                    data.lateMinsDeductDays = Number(Number(data.presentCount) * 5) - Number(rec.totalLateMins) < 0 ? Number(((Math.abs(await this.deductionInDays(data.presentCount, rec.totalLateMins))) - Number(rec.available)).toFixed(1)) : 0

                }
            }
            resultData.forEach(data => {
                const totalSeconds = data.splOtHours;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                data.splOtHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            });
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', resultData);
        } catch (error) {
            console.error('Error fetching employee month-wise data:', error);
            return new CommonResponseModel(false, 0, 'Error');
        }
    }

    async getAllEmpWeeklyWiseDataWithoutPagination(req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            const rawData = await this.attendanceRepo.getAllEmpWeeklyWiseDataWithoutPaginationRepo(req);
            const lateData = await this.attendanceRepo.getLateMinuteByEmployee()
            const payrollMonthData = `${req.attnFromDate}`;
            const filteredData = rawData.filter(rec => rec.attendance_month === dayjs(payrollMonthData).format('YYYYMM'));
            const empMap = new Map<number, PayRollAttnDto>();
            let resultData = [];
            const lateDataMap = new Map<number, number>();
            for (const record of lateData) {
                const [hours, minutes, seconds] = record.total_late_hours.split(':').map(Number);
                const totalLateMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
                const adjustedLateMinutes = Math.max(totalLateMinutes - 130, 0);
                lateDataMap.set(record.emp_id, adjustedLateMinutes);
            }
            for (const rec of filteredData) {

                if (!empMap.has(rec.emp_id)) {
                    let presentCount = 0;
                    let absentCount = 0;
                    let leaveCount = 0;
                    let coCount = 0;
                    let odCount = 0;
                    let wpCount = 0;
                    let woCount = 0;
                    let splOtHours
                    let holidayCount = 0;
                    let hpCount = 0;
                    let payDays = 0;
                    let allowanceDays = 0;
                    let lateMinutes = 0;

                    if (rec.attnStatus === 'P') {
                        presentCount = 1;
                    }
                    if (rec.attnStatus === 'A') {
                        absentCount = 1;
                    }
                    if (rec.attnStatus === 'L') {
                        leaveCount = 1;
                    }
                    if (rec.attnStatus === 'CO') {
                        coCount = 1;
                    }
                    if (rec.attnStatus === 'OD') {
                        odCount = 1;
                    }
                    if (rec.attnStatus === 'WP') {
                        wpCount = 1;
                    }
                    if (rec.attnStatus === 'W') {
                        woCount = 1;
                    }
                    if (rec.attnStatus === 'H') {
                        holidayCount = 1;
                    }
                    if (rec.attnStatus === 'HP') {
                        hpCount = 1;
                    }
                    if (rec.splOtHours) {
                        const [hours, minutes, seconds] = rec.splOtHours.split(':').map(Number);
                        splOtHours = (hours * 3600) + (minutes * 60) + seconds;
                    }

                    if (rec.employeeType === 'WEEKLY WORKER') {
                        payDays = presentCount + woCount + wpCount + hpCount;
                        allowanceDays = wpCount + hpCount;
                    }

                    const data = new PayRollAttnDto(rec.emp_id, rec.empCode, presentCount, absentCount, leaveCount, coCount, odCount, wpCount, woCount, splOtHours, holidayCount, hpCount, rec.branchId, rec.divisionId, rec.created_user, rec.attn_from_date, rec.attn_to_date, rec.departmentId, rec.designationId, payrollMonthData, payDays, allowanceDays, lateDataMap.get(rec.emp_id) || 0, rec.employeeTypeId, rec.bankName, rec.bankAccNo, rec.bankIfscCode, rec.payMode, null
                    );
                    data.lateMinutes = lateDataMap.get(rec.emp_id) || 0;
                    empMap.set(rec.emp_id, data);
                    resultData.push(data);
                } else {
                    const data = empMap.get(rec.emp_id);

                    if (rec.attnStatus === 'P') {
                        data.presentCount++;
                    }
                    if (rec.attnStatus === 'A') {
                        data.absentCount++;
                    }
                    if (rec.attnStatus === 'L') {
                        data.leaveCount++;
                    }
                    if (rec.attnStatus === 'CO') {
                        data.coCount++;
                    }
                    if (rec.attnStatus === 'OD') {
                        data.odCount++;
                    }
                    if (rec.attnStatus === 'WP') {
                        data.wpCount++;
                    }
                    if (rec.attnStatus === 'W') {
                        data.woCount++;
                    }
                    if (rec.attnStatus === 'H') {
                        data.holidayCount++;
                    }
                    if (rec.attnStatus === 'HP') {
                        data.hpCount++;
                    }
                    if (rec.splOtHours) {
                        const [hours, minutes, seconds] = rec.splOtHours.split(':').map(Number);
                        const additionalSeconds = (hours * 3600) + (minutes * 60) + seconds;
                        data.splOtHours += additionalSeconds;
                    }
                    if (rec.employeeType === 'WEEKLY WORKER') {
                        data.payDays = data.presentCount;
                        data.allowanceDays = data.wpCount + data.hpCount;
                    }
                }
            }
            resultData.forEach(data => {
                const totalSeconds = data.splOtHours;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                data.splOtHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            });
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', resultData);
        } catch (error) {
            console.error('Error fetching employee month-wise data:', error);
            return new CommonResponseModel(false, 0, 'Error');
        }
    }

    async getAllEmployeeWorking(req: AttendanceDto): Promise<CommonResponseModel> {
        const data = await this.consolidatedAttendanceLogRepo.getEmployeeWorkingHrs(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', data,);
        } else {
            return new CommonResponseModel(false, 11, 'Data not found as per your filtration');
        }
    }

    async getAllEmpLateMinutesData(req: AttendanceDto): Promise<CommonResponseModel> {
        try {
            const data = await this.attendanceRepo.getAllEmpLateMinutes(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
            }
        } catch (err) {
            throw err
        }

        ;
    }

    async CancleSelfAttendanceAdjust(req: any): Promise<CommonResponseModel> {
        try {
            const save = await this.attnAdjustmentRepo.update({ id: req.id }, { status: req.status });
            if (save) {
                return new CommonResponseModel(true, 1, "Leave Cancelled SuccessFully")
            } else {
                throw new ErrorResponse(0, "Failed While Cancel Leave ")
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllForOTApproved(req: OTBulkApprovalReq): Promise<CommonResponseModel> {
        try {
            const data = await this.otApprovalLogRepo.getOTApprovedRepo(req)
            if (data) {
                return new CommonResponseModel(true, 1, 'Data Retried Successfully', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data Found', [])
            }
        }
        catch (err) {
            throw err
        }
    }

    async updateApprovedOTStatus(req: any[]): Promise<CommonResponseModel> {
        try {
            const results = [];
            for (const res of req) {
                const update = await this.attendanceRepo.update(
                    { empId: res.empId, date: res.date },
                    {
                        spclOThrs: res.editedFinalOtHours
                            ? res.editedFinalOtHours
                            : res.finalOtHours,
                        otStatus: 1,
                    }
                );
                if (update.affected) {
                    const update = await this.otApprovalLogRepo.update(
                        { id: res.id },
                        { status: res.status }
                    );
                    results.push({ success: true, empId: res.empId });
                } else {
                    results.push({ success: false, empId: res.empId });
                }
            }
            const allSuccess = results.every((result) => result.success);
            if (allSuccess) {
                return new CommonResponseModel(true, 1, "OT Approved");
            } else {
                return new CommonResponseModel(false, 0, "Some updates failed");
            }
        } catch (err) {
            throw err
        }
    }

    async updateRevertOTStatus(req: any[]): Promise<CommonResponseModel> {
        try {
            const results = [];
            for (const res of req) {
                const update = await this.attendanceRepo.update(
                    { empId: res.empId, date: res.date },
                    {
                        spclOThrs: null,
                        otStatus: 0,
                    }
                );
                if (update.affected) {
                    const statusValue = res.status === 'REJECTED' ? 'OPEN' : res.status;
                    const updateLog = await this.otApprovalLogRepo.update(
                        { id: res.id },
                        {
                            status: statusValue,
                            reason: res.status === 'REJECTED' ? '-' : res.reason
                        }
                    )
                    results.push({ success: true, empId: res.empId });
                } else {
                    results.push({ success: false, empId: res.empId });
                }
            }
            const allSuccess = results.every((result) => result.success);
            if (allSuccess) {
                return new CommonResponseModel(true, 1, "OT Reverted");
            } else {
                return new CommonResponseModel(false, 0, "Some updates failed");
            }
        } catch (err) {
            throw err
        }
    }

    async updateRejectedOTStatus(req: any[]): Promise<CommonResponseModel> {
        try {
            const results = [];
            for (const res of req) {
                const update = await this.otApprovalLogRepo.update(
                    { id: res.id },
                    { status: res.status, reason: res.reason }
                );
                results.push({ success: true, empId: res.empId });
            }
            const allSuccess = results.every((result) => result.success);
            if (allSuccess) {
                return new CommonResponseModel(true, 1, "OT Rejected");
            } else {
                return new CommonResponseModel(false, 0, "Some updates failed");
            }
        } catch (err) {
            throw err
        }
    }




    //@Cron('00 18 * * *')
    async getEmpByWeekOffForToday(req?: AttenCoOffDto): Promise<CommonResponseModel> {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        req = req || {};
        req.date = req.date ? req.date : formattedDate;
        const month = dayjs(req.date).format('M')

        try {
            const data = await this.attendanceRepo.getEmpByWeekOffForToday(req);
            if (data.length > 0) {
                const leaveAllocationsRepo = this.dataSource.getRepository(NewLeaveAllocationsEntity);

                for (const weekData of data) {
                    let existingAllocation = await leaveAllocationsRepo.findOne({
                        where: { employeeId: weekData.employeeId, leaveTypeId: 4 },
                    });

                    if (existingAllocation) {
                        if (weekData.attnStatus === 'WP' || weekData.attnStatus === 'HP') {
                            existingAllocation[`accum${Number(month)}`] = Number(existingAllocation[`accum${Number(month)}`]) + 1;
                        } else if (weekData.attnStatus === 'WP/2' || weekData.attnStatus === 'HP/2') {
                            existingAllocation[`accum${Number(month)}`] = Number(existingAllocation[`accum${Number(month)}`]) + 0.5;
                        }

                        await leaveAllocationsRepo.save(existingAllocation);
                    }
                }
                return new CommonResponseModel(true, 1, 'Data processed successfully', data);
            } else {
                return new CommonResponseModel(false, 0, 'No data found for today', []);
            }
        } catch (err) {
            throw err;
        }
    }



    async updateAttendanceStatusByInOutTimings(): Promise<CommonResponseModel> {
        try {
            const attendanceStatusList = await this.attendanceStatusRepository.find();

            //const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
            const firstDate = dayjs().endOf('M').format('YYYY-MM-01')
            const lastDate = dayjs().endOf('M').format('YYYY-MM-DD')
            const todaysRecords = await this.attendanceRepo.find({
                where: { date: Between(firstDate, lastDate), attnStatus: "P" },
            });

            for (const statusConfig of attendanceStatusList) {
                const { startTime, endTime, attendanceStatus } = statusConfig;

                const recordsToUpdate = todaysRecords.filter((record) => {
                    const wkHrs = record.wkHrs;
                    return wkHrs >= startTime && wkHrs <= endTime;
                });

                for (const record of recordsToUpdate) {
                    record.attnStatus = attendanceStatus;
                }
            }

            const updatedRecords = await this.attendanceRepo.save(todaysRecords);

            if (updatedRecords.length > 0) {
                return new CommonResponseModel(true, 111, 'Attendance statuses updated successfully');
            } else {
                return new CommonResponseModel(false, 400, 'No records were updated');
            }
        } catch (err) {
            throw new Error('Failed to update attendance statuses')
        }

    }

    async updateAttendanceStatusByInOutTimingsDateWise(req: AttendanceDateDto): Promise<CommonResponseModel> {
        try {
            const attendanceStatusList = await this.attendanceStatusRepository.find();

            const firstDate = dayjs(req.date).format('YYYY-MM-01')
            const lastDate = dayjs(req.date).endOf('M').format('YYYY-MM-DD')
            const todaysRecords = await this.attendanceRepo.find({
                where: { date: Between(firstDate, lastDate), attnStatus: "P", branch: req.branch },
            });

            for (const statusConfig of attendanceStatusList) {
                const { startTime, endTime, attendanceStatus } = statusConfig;

                const recordsToUpdate = todaysRecords.filter((record) => {
                    const wkHrs = record.wkHrs;
                    return wkHrs >= startTime && wkHrs <= endTime;
                });

                for (const record of recordsToUpdate) {
                    record.attnStatus = attendanceStatus;
                }
            }

            const updatedRecords = await this.attendanceRepo.save(todaysRecords);

            if (updatedRecords.length > 0) {
                return new CommonResponseModel(true, 111, 'Attendance statuses updated successfully');
            } else {
                return new CommonResponseModel(false, 400, 'No records were updated');
            }
        } catch (err) {
            throw new Error('Failed to update attendance statuses')
        }

    }


    async getAllSinglePunchAttendance(req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        const countReq = new EmployeeFilterReq()
        const data = await this.attendanceRepo.getAllSinglePunchAttendance(req)
        if (data.length > 0) {
            data.forEach((item: any) => {
                const fromDate = new Date(item.attendanceDate);
                const localTimeFromDate = new Date(fromDate.getTime() - new Date().getTimezoneOffset() * 60000);
                item.attendanceDate = localTimeFromDate.toISOString().split('T')[0];
            });

            return new EmployeeViewResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new EmployeeViewResponseModel(false, 11, 'Data not found as per your filtration');
        }
    }

    async getAllLeaveCOllision(req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        const data = await this.attendanceRepo.getAllLeaveCollisionEmp(req)
        if (data.length > 0) {
            data.forEach((item: any) => {
                const fromDate = new Date(item.attendanceDate);
                const localTimeFromDate = new Date(fromDate.getTime() - new Date().getTimezoneOffset() * 60000);
                item.attendanceDate = localTimeFromDate.toISOString().split('T')[0];
            });

            return new EmployeeViewResponseModel(true, 1, 'Data retrieved successfully', data);
        } else {
            return new EmployeeViewResponseModel(false, 11, 'Data not found as per your filtration');
        }
    }


    //@Cron('15 23 * * *') // Runs every day at 11:15 PM
    // async calculateLateMin(req?: lateMinReq): Promise<CommonResponseModel> {
    //     try {
    //         const employees = await this.employeeService.getEmpDataForLateMinCal(req);

    //         for (const emp of employees.data) {
    //             const req2 = new lateMinReq(req.branchId, req.departmentId, emp.employeeId, req.date)
    //             const Records = await this.attendanceRepo.calcuLateMinRepo(req2);

    //             let cumLateMin = 0;

    //             for (const data of Records) {
    //                 let lateMin = 0;

    //                 if (data.attnStatus === 'P') {
    //                     const modifiedInTime = dayjs(data.inTime).format('HH:mm:ss');
    //                     const modifiedOutTime = dayjs(data.outTime).format('HH:mm:ss');

    //                     const standardInTime = dayjs().set('hour', 9).set('minute', 45).set('second', 0).format('HH:mm:ss');
    //                     const standardOutTime = dayjs().set('hour', 18).set('minute', 30).set('second', 0).format('HH:mm:ss');

    //                     if (modifiedInTime > standardInTime) {
    //                         lateMin += dayjs(modifiedInTime, 'HH:mm:ss').diff(dayjs(standardInTime, 'HH:mm:ss'), 'minute');
    //                     }
    //                     if (modifiedOutTime < standardOutTime) {
    //                         lateMin += dayjs(standardOutTime, 'HH:mm:ss').diff(dayjs(modifiedOutTime, 'HH:mm:ss'), 'minute');
    //                     }
    //                 }
    //                 else if (data.attnStatus === 'P/2') {
    //                     const modifiedInTime = dayjs(data.inTime).format('HH:mm:ss');
    //                     const modifiedOutTime = dayjs(data.outTime).format('HH:mm:ss');

    //                     const morningShiftStart = dayjs().set('hour', 9).set('minute', 45).set('second', 0).format('HH:mm:ss');
    //                     const morningShiftEnd = dayjs().set('hour', 13).set('minute', 30).set('second', 0).format('HH:mm:ss');

    //                     const afternoonShiftStart = dayjs().set('hour', 14).set('minute', 0).set('second', 0).format('HH:mm:ss');
    //                     const afternoonShiftEnd = dayjs().set('hour', 18).set('minute', 30).set('second', 0).format('HH:mm:ss');

    //                     if (modifiedInTime < morningShiftEnd) {
    //                         if (modifiedInTime > morningShiftStart) {
    //                             lateMin += dayjs(modifiedInTime, 'HH:mm:ss').diff(dayjs(morningShiftStart, 'HH:mm:ss'), 'minute');
    //                         }
    //                         if (modifiedOutTime < morningShiftEnd) {
    //                             lateMin += dayjs(morningShiftEnd, 'HH:mm:ss').diff(dayjs(modifiedOutTime, 'HH:mm:ss'), 'minute');
    //                         }
    //                     }
    //                     else {
    //                         if (modifiedInTime > afternoonShiftStart) {
    //                             lateMin += dayjs(modifiedInTime, 'HH:mm:ss').diff(dayjs(afternoonShiftStart, 'HH:mm:ss'), 'minute');
    //                         }
    //                         if (modifiedOutTime < afternoonShiftEnd) {
    //                             lateMin += dayjs(afternoonShiftEnd, 'HH:mm:ss').diff(dayjs(modifiedOutTime, 'HH:mm:ss'), 'minute');
    //                         }
    //                     }
    //                 }

    //                 cumLateMin += lateMin;

    //                 await this.attendanceRepo.update(
    //                     { empId: data.employeeId, date: data.date },
    //                     { lateMin: lateMin, cumLateMin: cumLateMin }
    //                 );
    //             }
    //         }

    //         return new CommonResponseModel(true, 1, "Late minutes calculated successfully");
    //     } catch (err) {
    //         console.error(err);
    //         return new CommonResponseModel(false, 0, "Error calculating late minutes");
    //     }
    // }

    // late min calculation service for month
    async calculateLateMin(req?: lateMinReq): Promise<CommonResponseModel> {
        try {
            const employees = await this.employeeService.getEmpDataForLateMinCal(req);

            const currentDate = req.date ? dayjs(req.date) : dayjs();
            const startOfMonth = currentDate.startOf('month');
            const endOfMonth = currentDate.endOf('month');

            for (const emp of employees.data) {
                for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth); date = date.add(1, 'day')) {

                    const loopDate = date.format('YYYY-MM-DD');
                    const req2 = new lateMinReq(req.branchId, req.departmentId, emp.employeeId, loopDate, null, null, emp.employeeCode);
                    const records = await this.attendanceRepo.getSwipesForDateAndEmployee(req2);

                    console.log(`Records for ${loopDate}:`, records);

                    if (records.length === 0) continue;

                    records.sort((a, b) => a.swipe_time.localeCompare(b.swipe_time));

                    const shiftStart = dayjs('09:45:00', 'HH:mm:ss');
                    const shiftEnd = dayjs('18:30:00', 'HH:mm:ss');
                    const lunchStart = dayjs('13:00:00', 'HH:mm:ss');
                    const lunchEnd = dayjs('14:00:00', 'HH:mm:ss');

                    const firstInSwipe = records.find(r => r.swipe_type === 'IN');
                    const lastOutSwipe = [...records].reverse().find(r => r.swipe_type === 'OUT');

                    if (!firstInSwipe || !lastOutSwipe) continue;

                    const inTime = dayjs(firstInSwipe.swipe_time, 'HH:mm:ss');
                    const lateMin = inTime.isAfter(shiftStart) ? inTime.diff(shiftStart, 'minute') : 0;

                    const outTime = dayjs(lastOutSwipe.swipe_time, 'HH:mm:ss');
                    const outLateMin = outTime.isBefore(shiftEnd) ? shiftEnd.diff(outTime, 'minute') : 0;

                    const firstInSwipeWithLate = [{
                        employee_number: firstInSwipe.employee_number,
                        swipe_date: dayjs(firstInSwipe.swipe_date).format('YYYY-MM-DD'),
                        swipe_time: firstInSwipe.swipe_time,
                        late_min: lateMin
                    }];

                    const lastOutSwipeWithLate = [{
                        employee_number: lastOutSwipe.employee_number,
                        swipe_date: dayjs(lastOutSwipe.swipe_date).format('YYYY-MM-DD'),
                        swipe_time: lastOutSwipe.swipe_time,
                        late_min: outLateMin
                    }];

                    const remainingMovements: any[] = [];

                    for (let i = 0; i < records.length - 1; i++) {
                        const current = records[i];
                        const next = records[i + 1];

                        if (current.swipe_type === 'OUT' && next.swipe_type === 'IN') {
                            const outTime = dayjs(current.swipe_time, 'HH:mm:ss');
                            const inTime = dayjs(next.swipe_time, 'HH:mm:ss');

                            let lateMin = 0;

                            // Skip if both OUT and IN swipes are after shiftEnd
                            if (outTime.isAfter(shiftEnd) && inTime.isAfter(shiftEnd)) {
                                lateMin = 0;
                            }
                            // If out is before shiftEnd and in is after, only calculate up to shiftEnd
                            else if (outTime.isBefore(shiftEnd) && inTime.isAfter(shiftEnd)) {
                                lateMin = Math.max(0, shiftEnd.diff(outTime, 'minute'));
                            }
                            // Handle movements around lunch hours
                            else if (outTime.isBefore(lunchStart) && inTime.isAfter(lunchEnd)) {
                                lateMin = Math.max(0, inTime.diff(outTime, 'minute') - 60); // Subtract the lunch hour duration (60 minutes)
                            }
                            else if (outTime.isBefore(lunchEnd) && inTime.isAfter(lunchEnd)) {
                                lateMin = Math.max(0, inTime.diff(lunchEnd, 'minute'));  // If out time is during lunch and in time is after lunch
                            }
                            else if (outTime.isBefore(lunchStart) && inTime.isBetween(lunchStart, lunchEnd)) {
                                lateMin = Math.max(0, lunchStart.diff(outTime, 'minute'));  // If out time is before lunch and in time is during lunch
                            }
                            else if (!outTime.isBetween(lunchStart, lunchEnd) && !inTime.isBetween(lunchStart, lunchEnd)) {
                                lateMin = Math.max(0, inTime.diff(outTime, 'minute'));   // Normal movement time calculation excluding lunch
                            }

                            remainingMovements.push({
                                employee_number: current.employee_number,
                                swipe_date: dayjs(current.swipe_date).format('YYYY-MM-DD'),
                                swipe_out_time: current.swipe_time,
                                swipe_in_time: next.swipe_time,
                                late_min: lateMin
                            });
                        }
                    }


                    const entities: lateMinutesRecordsEntity[] = [];
                    let lateMins = 0

                    for (const data of firstInSwipeWithLate) {
                        const entity = new lateMinutesRecordsEntity();
                        entity.employeeCode = data.employee_number;
                        entity.date = data.swipe_date;
                        entity.swipeInTime = data.swipe_time;
                        entity.swipesEnum = LateMinRecordsEnum.FIRSTIN;
                        entity.actualLateMin = data.late_min;
                        entity.finalLateMin = data.late_min;
                        entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                        entities.push(entity);

                        lateMins = Number(lateMins) + Number(data.late_min)

                    }

                    for (const data of remainingMovements) {
                        const entity = new lateMinutesRecordsEntity();
                        entity.employeeCode = data.employee_number;
                        entity.date = data.swipe_date;
                        entity.swipeInTime = data.swipe_in_time;
                        entity.swipeOutTime = data.swipe_out_time;
                        entity.swipesEnum = LateMinRecordsEnum.REMAINING;
                        entity.actualLateMin = data.late_min;
                        entity.finalLateMin = data.late_min;
                        entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                        entities.push(entity);

                        lateMins = Number(lateMins) + Number(data.late_min)

                    }

                    for (const data of lastOutSwipeWithLate) {
                        const entity = new lateMinutesRecordsEntity();
                        entity.employeeCode = data.employee_number;
                        entity.date = data.swipe_date;
                        entity.swipeOutTime = data.swipe_time;
                        entity.swipesEnum = LateMinRecordsEnum.LASTOUT;
                        entity.actualLateMin = data.late_min;
                        entity.finalLateMin = data.late_min;
                        entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                        entities.push(entity);

                        lateMins = Number(lateMins) + Number(data.late_min)

                    }

                    if (entities.length) {
                        await this.lateMinMomentRecordsRepo.save(entities);
                    }
                    await this.attendanceRepo.update({ empCode: emp.employeeCode, date: loopDate }, { lateMin: lateMins })
                }
            }

            return new CommonResponseModel(true, 1, "Late minutes calculated successfully");
        } catch (err) {
            console.error(err);
            return new CommonResponseModel(false, 0, "Error calculating late minutes");
        }
    }


    @Cron('00 20 * * *') // late min calculation service for single day
    async calculateLateMinForDay(req?: lateMinReq): Promise<CommonResponseModel> {
        try {
            const employees = await this.employeeService.getEmpDataForLateMinCal(req);

            const currentDate = req.date ? dayjs(req.date) : dayjs();

            for (const emp of employees.data) {
                const loopDate = currentDate.format('YYYY-MM-DD');
                const req2 = new lateMinReq(req.branchId, req.departmentId, emp.employeeId, loopDate, null, null, emp.employeeCode);
                const records = await this.attendanceRepo.getSwipesForDateAndEmployee(req2);

                console.log(`Records for ${loopDate}:`, records);

                if (records.length === 0) continue;

                records.sort((a, b) => a.swipe_time.localeCompare(b.swipe_time));

                const shiftStart = dayjs('09:45:00', 'HH:mm:ss');
                const shiftEnd = dayjs('18:30:00', 'HH:mm:ss');
                const lunchStart = dayjs('13:00:00', 'HH:mm:ss');
                const lunchEnd = dayjs('14:00:00', 'HH:mm:ss');

                const firstInSwipe = records.find(r => r.swipe_type === 'IN');
                const lastOutSwipe = [...records].reverse().find(r => r.swipe_type === 'OUT');

                if (!firstInSwipe || !lastOutSwipe) continue;

                const inTime = dayjs(firstInSwipe.swipe_time, 'HH:mm:ss');
                const lateMin = inTime.isAfter(shiftStart) ? inTime.diff(shiftStart, 'minute') : 0;

                const outTime = dayjs(lastOutSwipe.swipe_time, 'HH:mm:ss');
                const outLateMin = outTime.isBefore(shiftEnd) ? shiftEnd.diff(outTime, 'minute') : 0;

                const firstInSwipeWithLate = [{
                    employee_number: firstInSwipe.employee_number,
                    swipe_date: dayjs(firstInSwipe.swipe_date).format('YYYY-MM-DD'),
                    swipe_time: firstInSwipe.swipe_time,
                    late_min: lateMin
                }];

                const lastOutSwipeWithLate = [{
                    employee_number: lastOutSwipe.employee_number,
                    swipe_date: dayjs(lastOutSwipe.swipe_date).format('YYYY-MM-DD'),
                    swipe_time: lastOutSwipe.swipe_time,
                    late_min: outLateMin
                }];

                const remainingMovements: any[] = [];

                for (let i = 0; i < records.length - 1; i++) {
                    const current = records[i];
                    const next = records[i + 1];

                    if (current.swipe_type === 'OUT' && next.swipe_type === 'IN') {
                        const outTime = dayjs(current.swipe_time, 'HH:mm:ss');
                        const inTime = dayjs(next.swipe_time, 'HH:mm:ss');

                        let lateMin = 0;

                        // Skip if both OUT and IN swipes are after shiftEnd
                        if (outTime.isAfter(shiftEnd) && inTime.isAfter(shiftEnd)) {
                            lateMin = 0;
                        }
                        // If out is before shiftEnd and in is after, only calculate up to shiftEnd
                        else if (outTime.isBefore(shiftEnd) && inTime.isAfter(shiftEnd)) {
                            lateMin = Math.max(0, shiftEnd.diff(outTime, 'minute'));
                        }
                        // Handle movements around lunch hours
                        else if (outTime.isBefore(lunchStart) && inTime.isAfter(lunchEnd)) {
                            lateMin = Math.max(0, inTime.diff(outTime, 'minute') - 60); // Subtract the lunch hour duration (60 minutes)
                        }
                        else if (outTime.isBefore(lunchEnd) && inTime.isAfter(lunchEnd)) {
                            lateMin = Math.max(0, inTime.diff(lunchEnd, 'minute'));  // If out time is during lunch and in time is after lunch
                        }
                        else if (outTime.isBefore(lunchStart) && inTime.isBetween(lunchStart, lunchEnd)) {
                            lateMin = Math.max(0, lunchStart.diff(outTime, 'minute'));  // If out time is before lunch and in time is during lunch
                        }
                        else if (!outTime.isBetween(lunchStart, lunchEnd) && !inTime.isBetween(lunchStart, lunchEnd)) {
                            lateMin = Math.max(0, inTime.diff(outTime, 'minute'));   // Normal movement time calculation excluding lunch
                        }

                        remainingMovements.push({
                            employee_number: current.employee_number,
                            swipe_date: dayjs(current.swipe_date).format('YYYY-MM-DD'),
                            swipe_out_time: current.swipe_time,
                            swipe_in_time: next.swipe_time,
                            late_min: lateMin
                        });
                    }
                }


                const entities: lateMinutesRecordsEntity[] = [];
                let lateMins = 0

                for (const data of firstInSwipeWithLate) {
                    const entity = new lateMinutesRecordsEntity();
                    entity.employeeCode = data.employee_number;
                    entity.date = data.swipe_date;
                    entity.swipeInTime = data.swipe_time;
                    entity.swipesEnum = LateMinRecordsEnum.FIRSTIN;
                    entity.actualLateMin = data.late_min;
                    entity.finalLateMin = data.late_min;
                    entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                    entities.push(entity);

                    lateMins = Number(lateMins) + Number(data.late_min)

                }

                for (const data of remainingMovements) {
                    const entity = new lateMinutesRecordsEntity();
                    entity.employeeCode = data.employee_number;
                    entity.date = data.swipe_date;
                    entity.swipeInTime = data.swipe_in_time;
                    entity.swipeOutTime = data.swipe_out_time;
                    entity.swipesEnum = LateMinRecordsEnum.REMAINING;
                    entity.actualLateMin = data.late_min;
                    entity.finalLateMin = data.late_min;
                    entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                    entities.push(entity);

                    lateMins = Number(lateMins) + Number(data.late_min)

                }

                for (const data of lastOutSwipeWithLate) {
                    const entity = new lateMinutesRecordsEntity();
                    entity.employeeCode = data.employee_number;
                    entity.date = data.swipe_date;
                    entity.swipeOutTime = data.swipe_time;
                    entity.swipesEnum = LateMinRecordsEnum.LASTOUT;
                    entity.actualLateMin = data.late_min;
                    entity.finalLateMin = data.late_min;
                    entity.status = data.late_min === 0 ? LateMinRecStatusEnum.INVALID : LateMinRecStatusEnum.OPEN;
                    entities.push(entity);

                    lateMins = Number(lateMins) + Number(data.late_min)

                }

                if (entities.length) {
                    await this.lateMinMomentRecordsRepo.save(entities);
                }
                await this.attendanceRepo.update({ empCode: emp.employeeCode, date: loopDate }, { lateMin: lateMins })
            }

            return new CommonResponseModel(true, 1, "Late minutes calculated successfully");
        } catch (err) {
            console.error(err);
            return new CommonResponseModel(false, 0, "Error calculating late minutes");
        }
    }




    async updateAttendanceWhileCollision(req: AttendanceDto): Promise<CommonResponseModel> {
        try {
            // Fetch the attendance record by ID
            const attendanceRecord = await this.attendanceRepo.findOne({
                where: {
                    id: req.attendanceId, // Assuming req.attendanceId is the ID of the record to update
                },
            });

            // Check if the record exists
            if (!attendanceRecord) {
                return new CommonResponseModel(false, 404, 'Attendance record not found', null);
            }

            // Update the record with the new values
            attendanceRecord.attnStatus = req.attendanceStatus;
            attendanceRecord.inTime = req.inTime;
            attendanceRecord.outTime = req.outTime;

            // Save the updated record
            const updatedRecord = await this.attendanceRepo.save(attendanceRecord);

            // Return success response with the updated record
            return new CommonResponseModel(true, 1, 'Update successful', updatedRecord);
        } catch (err) {
            console.error('Error updating attendance record:', err);
            throw new Error('Failed to update attendance record');
        }
    }
    // async deleteLeaveInAttendanceWhileCollision(req: AttendanceDto): Promise<CommonResponseModel> {
    //     try {
    //         // Fetch the attendance record by ID
    //         const attendanceRecord = await this.attendanceRepo.findOne({
    //             where: {
    //                 id: req.attendanceId,
    //             },
    //         });
    //         if (!attendanceRecord) {
    //             return new CommonResponseModel(false, 404, 'Attendance record not found', null);
    //         }

    //         attendanceRecord.leaveStatus = req.attendanceStatus;

    //         const updatedRecord = await this.attendanceRepo.save(attendanceRecord);
    //         const leavereq = new LeavePolicyDto()
    //         leavereq.leaveCode = req.leaveStatus
    //         const getleaveTypeId =  await this.leavePolicyService.getLeaveCodeById(leavereq);
    //         console.log(getleaveTypeId,"iiiddd")

    //         if(getleaveTypeId.status=true && getleaveTypeId.data.length > 0){
    //             const leaveTypeId = getleaveTypeId.data[0].id; // Get the leaveTypeId
    //             console.log(leaveTypeId,"leaveTypeId1")
    //             console.log(attendanceRecord.empId,"attendanceRecord.empId")
    //         // Fetch the leave allocation record for the employee and leave type
    //         const leaveAllocation = await this.leaveAllocation.findOne({
    //             where: {
    //                 leaveTypeId: leaveTypeId,
    //                 employeeId: attendanceRecord.empId, 
    //             },
    //         });
    //         console.log(leaveAllocation)
    //         if (leaveAllocation ) {
    //             // Update leaveUsed and available fields
    //             leaveAllocation.leavesUsed = parseFloat((Number(leaveAllocation.leavesUsed) - 1).toFixed(1)); 
    //             leaveAllocation.available = parseFloat((Number(leaveAllocation.available) + 1).toFixed(1));

    //             // Save the updated leave allocation record
    //             await this.leaveAllocation.save(leaveAllocation);
    //         } else {
    //             console.warn('Leave allocation record not found for leaveTypeId and employeeId');
    //         }
    //     } else {
    //         console.warn('Failed to fetch leaveTypeId');
    //     }

    //     // Return success response
    //     return new CommonResponseModel(true, 1, 'Update successful', updatedRecord);

    //     } catch (err) {
    //         console.error('Error updating attendance record:', err);
    //         throw new Error('Failed to update attendance record');
    //     }
    // }
    async deleteLeaveInAttendanceWhileCollision(req: any): Promise<CommonResponseModel> {
        try {
            // Fetch the attendance record by ID
            const attendanceRecord = await this.attendanceRepo.findOne({
                where: {
                    id: req.attendanceId,
                },
            });

            if (!attendanceRecord) {
                return new CommonResponseModel(false, 404, 'Attendance record not found', null);
            }

            attendanceRecord.leaveStatus = req.attendanceStatus;
            const updatedRecord = await this.attendanceRepo.save(attendanceRecord);

            // ✅ Remove "/2" if present in leaveStatus before fetching leaveTypeId
            const cleanLeaveStatus = req.leaveStatus.replace(/\/2$/, '');

            const getleaveTypeId = await this.leaveTypeEntityRepo.findOne({ where: { leaveTypeCode: cleanLeaveStatus } })

            if (getleaveTypeId) {
                const leaveTypeId = getleaveTypeId.leaveTypeId;

                // Fetch the leave allocation record for the employee and leave type
                const leaveAllocation = await this.newLeaveAllocationRepo.findOne({
                    where: {
                        leaveTypeId: leaveTypeId,
                        employeeId: attendanceRecord.empId,
                    },
                });

                if (leaveAllocation) {
                    const isHalfDay = req.leaveStatus.endsWith('/2');
                    const deductionAmount = isHalfDay ? 0.5 : 1;
                    const month = dayjs(req.attendanceDate).format('M')
                    leaveAllocation[`utilized${month}`] = parseFloat((Number(leaveAllocation[`utilized${month}`]) - deductionAmount).toFixed(1));

                    await this.leaveAllocation.save(leaveAllocation);
                } else {
                    console.warn('Leave allocation record not found for leaveTypeId and employeeId');
                }

            } else {
                console.warn('Failed to fetch leaveTypeId');
            }

            // Return success response
            return new CommonResponseModel(true, 1, 'Update successful', updatedRecord);
        } catch (err) {
            console.error('Error updating attendance record:', err);
            throw new Error('Failed to update attendance record');
        }
    }


    async getAllReportingManagerWiseAttnReport(req: any): Promise<CommonResponseModel> {

        const data = await this.attendanceRepo.getAllReportingManagerWiseAttnReport(req)

        if (data) {
            return new CommonResponseModel(true, 1, 'Data retrived successfully', data);
        }
        return new CommonResponseModel(true, 1, 'No data found', [])

    }
    // async getAllReportingManagerWiseAttnWhatsUp(req: any): Promise<CommonResponseModel> {

    //     const data = await this.attendanceRepo.getAllReportingManagerWiseAttnReport(req)

    //     if (data) {
    //         return new CommonResponseModel(true, 1, 'Data retrived successfully', data);
    //     }
    //     return new CommonResponseModel(true, 1, 'No data found', [])

    // }

    // @Cron('00 23 10 * *')
    async getAllReportingManagerWiseAttnWhatsUp(req: ReportingManagerReq): Promise<CommonResponseModel> {
        try {
            const currenctData = dayjs().format('YYYY-MM-DD')
            req.date = currenctData
            // console.log(req,"1111111111111111")
            const data = await this.attendanceRepo.getAllReportingManagerWiseAttnReport(req);

            if (data && data.length > 0) {

                const transformedData = data.map((manager: any) => ({
                    reportingManagerName: manager.reportingManagerName || '-',
                    branch: manager.branch || '-',
                    absentCount: manager.absentCount || 0,
                    presentCount: manager.presentCount || 0,
                    leaveCount: manager.leaveCount || 0,
                    emailId: manager.emailId || null, // Assuming `emailId` is part of the manager's data
                    employees: (manager.employees || []).map((employee: any) => ({
                        employeeName: employee.employeeName || '-',
                        attendanceDate: employee.attendanceDate || '-',
                        attendanceStatus: employee.attendanceStatus || '-',
                        leaveStatus: employee.leaveStatus !== 'A' ? employee.leaveStatus || '-' : '-',
                    })),
                }));
                for (const manager of transformedData) {
                    const totalHeadCount = manager.employees.length;

                    // Summary Table with Heading
                    const summaryTable = `
                    <h2>Summary Attendance Report</h2>
                    <table border="1" style="width:100%; border-collapse:collapse; text-align:center; margin-bottom:20px;">
                      <thead>
                        <tr>
                          <th>Reporting Manager Name</th>
                          <th>Branch</th>
                          <th>Absent Count</th>
                          <th>Present Count</th>
                          <th>Leave Count</th>
                          <th>Total Head Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${manager.reportingManagerName}</td>
                          <td>${manager.branch}</td>
                          <td>${manager.absentCount}</td>
                          <td>${manager.presentCount}</td>
                          <td>${manager.leaveCount}</td>
                          <td>${totalHeadCount}</td>
                        </tr>
                      </tbody>
                    </table>
                    `;

                    // Detailed List Table with Heading
                    const detailedTable = `
                    <h2>Detailed Employee List</h2>
                    <table border="1" style="width:100%; border-collapse:collapse; text-align:center; margin-top:20px;">
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          <th>Attendance Date</th>
                          <th>Attendance Status</th>
                          <th>Leave Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${manager.employees
                            .map(
                                (emp) => `
                                <tr>
                                  <td>${emp.employeeName}</td>
                                  <td>${emp.attendanceDate}</td>
                                  <td>${emp.attendanceStatus}</td>
                                  <td>${emp.leaveStatus}</td>
                                </tr>
                                `
                            )
                            .join('')}
                      </tbody>
                    </table>
                    `;

                    const combinedTables = `
                    ${summaryTable}
                    <br/>
                    ${detailedTable}
                    `;

                    // Send email
                    if (manager.emailId) {
                        const req = {
                            to: [manager.emailId],
                            cc: [],
                            subject: `Attendance Report for ${manager.reportingManagerName}`,
                            body: combinedTables,
                        };
                        axios.post("https://alerts.schemaxtech.in/email/send", req, {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                    }
                }




                return new CommonResponseModel(true, 1, 'Emails sent successfully', transformedData);
            }


            return new CommonResponseModel(true, 0, 'No data found', []);
        } catch (error) {
            console.error('Error in getAllReportingManagerWiseAttnWhatsUp:', error);
            return new CommonResponseModel(false, -1, 'Error while retrieving data', []);
        }
    }

    async getLateMinMomentRecordsData(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.lateMinMomentRecordsRepo.getLateMinMomentRecordsRepo(req)
            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved successfully', data)
                : new CommonResponseModel(false, 0, 'No Data Found', []);
        } catch (error) {
            throw (error)
        }
    }

    async approveLateMin(req: any): Promise<CommonResponseModel> {
        try {
            const update = await this.lateMinMomentRecordsRepo.update({ id: req.id }, { finalLateMin: 0, status: LateMinRecStatusEnum.APPROVED, remarks: req.remarks })
            if (update.affected) {
                return new CommonResponseModel(true, 1, 'Approved successfully', update)
            } else {
                return new CommonResponseModel(false, 0, 'Error while Approving')
            }
        } catch (error) {
            throw (error)
        }
    }

    async rejectLateMin(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.lateMinMomentRecordsRepo.findOne({ where: { id: req.id } });
            if (!data) {
                return new CommonResponseModel(false, 0, 'Record not found');
            }
            data.finalLateMin = data.actualLateMin;
            data.status = LateMinRecStatusEnum.OPEN;
            const updatedData = await this.lateMinMomentRecordsRepo.save(data);
            if (updatedData) {
                return new CommonResponseModel(true, 1, 'Rejected successfully', updatedData);
            } else {
                return new CommonResponseModel(false, 0, 'Error while Rejecting');
            }
        } catch (error) {
            console.error('Error in rejectLateMin:', error);
            throw new Error('Internal server error while approving');
        }
    }

}

function normalizeEmpCode(code: string) {
    if (code.toLowerCase().startsWith("w")) {
        return code.toUpperCase(); // Convert only "w" prefixed codes
    }
    return code; // Return numeric or already uppercase codes as is
}