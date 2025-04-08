import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { BadRequestException, Body, Controller, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance-service';
import { AttendanceDto } from './dto/attendance-dto';
import { CreateAttendanceSwipeDto } from './dto/create-attendance-swipes.dto';
// import { EmpAttendanceSrcCard } from './dto/emp-attedance-score-card';
import { AttenCoOffDto, AttnAdjustLogReq, AttnAdjustmentCreateReq, DashboardReq, EmployeeViewResponseModel, lateMinReq, UnitIdReq } from '@hrexpert/shared-models';
import { MonthWIseEmpReportReq } from '@hrexpert/shared-services';
import { Response } from 'express';
import { AttendanceAdjustRequest } from './dto/attendance-adjustment.request';
import { AttendanceUpdateRequest } from './dto/attn-update.request';
import { MonthReq } from './dto/month-req';
import { MonthWIseEmpReportDto } from './dto/month-wise-empreport.dto';
import { OTBulkApprovalDto } from './dto/ot-bulkapproval-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AttendanceDateDto } from './dto/attendance-date-dto';
import { AttendanceDateBetweenDto } from './attendance-date-between-dto';

@Controller('/attendance')
@ApiTags('/attendance')
export class AttendanceController {
    constructor(
        private service: AttendanceService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/getAllAttendance')
    async getAllAttendance(@Body() req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllAttendance(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }

    @Post('/bulk')
    async createBulkAttendanceSwipes(@Body() bulkDto: CreateAttendanceSwipeDto[]) {
        try {
            if (!Array.isArray(bulkDto) || bulkDto.length === 0) {
                throw new BadRequestException('Request body must contain an array of attendance swipe records.');
            }
            return await this.service.createAttendanceSwipes(bulkDto);
        } catch (error) {
            console.log(error);
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }

    }

    @Post('/generateAttendanceRecords')
    async generateAttendanceRecords(@Body() req:AttendanceDateDto): Promise<CommonResponseModel> {
        console.log(req)
        try {
            return await this.service.generateAttendanceRecords(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/generateNextDayAttendanceRecords')
    async generateNextDayAttendanceRecords(): Promise<CommonResponseModel> {
        try {
            return await this.service.generateNextDayAttendanceRecords();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    // @Post('/generateAttendanceRecordsForLastThreeMonths')
    // async generateAttendanceRecordsForLastThreeMonths(): Promise<CommonResponseModel> {
    //     try {
    //         return await this.service.generateAttendanceRecordsForLastThreeMonths();
    //     } catch (error) {
    //         return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    //     }
    // }
    @Post('/generateAttendanceRecordsForDateRange')
    async generateAttendanceRecordsForDateRange(@Body() req:AttendanceDateBetweenDto): Promise<CommonResponseModel> {
        try {
            return await this.service.generateAttendanceRecordsForDateRange(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/generateAttendanceRecordsForThisMonthTillNow')
    async generateAttendanceRecordsForThisMonthTillNow(@Body() req:AttendanceDateBetweenDto): Promise<CommonResponseModel> {
        try {
            return await this.service.generateAttendanceRecordsForThisMonthTillNow(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllAbsentsReport')
    async getAllAbsentsReport(@Body() req: AttendanceDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllAbsentsReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createOdCo')
    async createOdCo(@Body() data: any): Promise<CommonResponseModel> {
        try {
            return this.service.createOdCo(data);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getApplyCoOdUploadData')
    async getApplyCoOdUploadData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return this.service.getApplyCoOdUploadData(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }
    @Post('/getEmployeeNameByCode')
    async getEmployeeNameByCode(): Promise<any> {
        try {
            return this.service.getEmployeeNameByCode();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/updateApplyCoOdUpload')
    async updateApplyCoOdUpload(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return this.service.updateApplyCoOdUpload(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllForBulkOTApproval')
    async getAllForBulkOTApproval(@Body() req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllForBulkOTApproval(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllForBulkOTApplyApprove')
    async getAllForBulkOTApplyApprove(@Body() req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllForBulkOTApplyApprove(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getWorkingHoursReport')
    async getWorkingHoursReport(req: OTBulkApprovalDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getWorkingHoursReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/updateBulkOTApproval')
    async updateBulkOTApproval(@Body() req?: OTBulkApprovalDto[]): Promise<CommonResponseModel> {
        try {
            return await this.service.updateBulkOTApproval(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAdjustmentData')
    async getAdjustmentData(@Body() req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        try {
            return await this.service.getAdjustmentData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAttStatusByEmpIdCodeName')
    async getAttStatusByEmpIdCodeName(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return this.service.getAttStatusByEmpIdCodeName(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }
    @Post('/getWorkingHoursReportWithDetails')
    async getWorkingHoursReportWithDetails(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getWorkingHoursReportWithDetails(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpAttendenceScoreData')
    // @ApiBody({ type: EmpAttendanceSrcCard })
    async getEmpAttendenceScoreData(@Body() req: any): Promise<CommonResponseModel> {
        console.log(req, "reqqq");

        try {
            return await this.service.getEmpAttendenceScoreData(req);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    // @Post('/updateSwipesFromDevice')
    // async updateSwipesFromDevice(): Promise<CommonResponseModel> {
    //     try {
    //         return await this.service.updateSwipesFromDevice();
    //     } catch (error) {
    //         return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    //     }
    // }

    @Post('/getAllEmpMonthWiseData')
    @ApiBody({ type: MonthWIseEmpReportDto })
    async getAllEmpMonthWiseData(@Body() req: any, isExcel: boolean): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmpMonthWiseData(req, isExcel);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmpWeekWiseData')
    @ApiBody({ type: MonthWIseEmpReportDto })
    async getAllEmpWeekWiseData(@Body() req: any, isExcel: boolean): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmpWeekWiseData(req, isExcel);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAttnAdjustTableData')
    async getAttnAdjustTableData(req: UnitIdReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAttnAdjustTableData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateAttendance')
    async updateAttendance(@Body() req: AttendanceUpdateRequest): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAttendance(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/attendanceUpload')
    async attendanceUpload(@Body() data: any): Promise<CommonResponseModel> {
        try {
            return this.service.attendanceUpload(data);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }
    @Post('/getAllAttnAdjustmentData')
    async getAllAttnAdjustmentData(@Body() req: UnitIdReq): Promise<CommonResponseModel> {
        console.log(req, 'conreq')
        try {
            return this.service.getAllAttnAdjustmentData(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }
    @Post('/updatBulkAttendanceApproval')
    async updatBulkAttendanceApproval(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return this.service.updatBulkAttendanceApproval(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }


    @Post('/updateFreezeStatus')
    async updateFreezeStatus(@Body() req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            return await this.service.updateFreezeStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateFreezeStatusForWeeklyWorker')
    @ApiBody({ type: MonthWIseEmpReportReq })
    async updateFreezeStatusForWeeklyWorker(@Body() req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            return await this.service.updateFreezeStatusForWeeklyWorker(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/sendAttendanceStatus')
    async sendAttendanceStatus(): Promise<CommonResponseModel> {
        try {
            return this.service.sendAttendanceStatus();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }
    @Post('/getAllAdjustments')
    async getAllAdjustments(@Body() req: AttendanceAdjustRequest): Promise<CommonResponseModel> {
        try {
            const result = await this.service.getAllAdjustments(req);
            return new CommonResponseModel(true, 200, 'Adjustments retrieved successfully', result);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/absentStatusWhatsApi')
    async absentStatusWhatsApi(): Promise<CommonResponseModel> {
        try {
            return this.service.absentStatusWhatsApi();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/leaveStatusWhatsApi')
    async leaveStatusWhatsApi(): Promise<CommonResponseModel> {
        try {
            return this.service.leaveStatusWhatsApi();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/processAttendanceFromSwipe')
    async processAttendanceFromSwipe(): Promise<CommonResponseModel> {
        try {
            return this.service.processAttendanceFromSwipe();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }


    @Post('/weeklyAttendance')
    @ApiBody({ type: DashboardReq })
    async weeklyAttendance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return this.service.weeklyAttendance(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/dailyAttendance')
    @ApiBody({ type: DashboardReq })
    async dailyAttendance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return this.service.dailyAttendance(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);
        }
    }

    @Post('/attedanceStatusWhatsappAlert')
    async attedanceStatusWhatsappAlert(): Promise<CommonResponseModel> {
        try {
            return this.service.attedanceStatusWhatsappAlert();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);
        }
    }


    @Post('/leaveStatusWhatsApiwithBranchWise')
    async leaveStatusWhatsApiwithBranchWise(): Promise<CommonResponseModel> {
        try {
            return this.service.leaveStatusWhatsApiwithBranchWise();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }
    @Post('/absentStatusWhatsApiwithBranchWise')
    async absentStatusWhatsApiwithBranchWise(): Promise<CommonResponseModel> {
        try {
            return this.service.absentStatusWhatsApiwithBranchWise();
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/attnAdjustmentBulkCreation')
    async attnAdjustmentBulkCreation(@Body() req: AttnAdjustmentCreateReq[]): Promise<CommonResponseModel> {
        console.log(req, "conReq")
        try {
            return this.service.attnAdjustmentBulkCreation(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/attendanceAdjustment')
    @ApiConsumes('multipart/form-data') 
    @UseInterceptors(FilesInterceptor('files', 5, { // 'files' should match the frontend key
        storage: diskStorage({
            destination: join(__dirname, '../../../', 'employee-directory/attendance-adjustment-uploads'),
            filename: (req, file, callback) => {
                callback(null, `${Date.now()}-${file.originalname}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|pdf)$/i)) {
                console.log("Invalid file:", file.originalname);
                return callback(null, false);
            }
            callback(null, true);
        },
    }))
    async attendanceAdjustment(@UploadedFiles() files: Express.Multer.File[],  @Body() attnAdjustLogReq: AttnAdjustLogReq): Promise<CommonResponseModel> { 
        try {
            return this.service.attendanceAdjustment(files, attnAdjustLogReq);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);
        }
    }

    @Post('/getDataByMonth')
    async getDataByMonth(@Body() req: MonthReq): Promise<CommonResponseModel> {
        try {
            return this.service.getDataByMonth(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/getBranchWiseAttendance')
    async getBranchWiseAttendance(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return this.service.getBranchWiseAttendance(req);
        } catch (error) {
            return new CommonResponseModel(false, 11111, error);

        }
    }

    @Post('/getAllEmployeeWorking')
    async getAllEmployeeWorking(@Body() req?: AttendanceDto): Promise<CommonResponseModel> {
        console.log(req, 'req')
        try {
            return await this.service.getAllEmployeeWorking(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmpMonthWiseDataWithoutPagination')
    @ApiBody({ type: MonthWIseEmpReportDto })
    async getAllEmpMonthWiseDataWithoutPagination(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmpMonthWiseDataWithoutPagination(req);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getLateAndEarlyEntryEmployees')
    async getLateAndEarlyEntryEmployees(@Body() req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getLateAndEarlyEntryEmployees(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }

    @Post('/excelDownload')
    @ApiBody({ type: MonthWIseEmpReportDto })
    async excelDownload(@Body() req: any, @Res() res: Response) {
        try {
            const buffer = await this.service.excelDownload(req);
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        } catch (err) {
            console.log(err)
        }
    }

    @Post('/getAllEmpLateMinutesData')
    @ApiBody({ type: AttendanceDto })
    async getAllEmpLateMinutesData(@Body() req?: AttendanceDto): Promise<CommonResponseModel> {
        console.log(req, 'req')
        try {
            return await this.service.getAllEmpLateMinutesData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmpWeeklyWiseDataWithoutPagination')
    @ApiBody({ type: MonthWIseEmpReportDto })
    async getAllEmpWeeklyWiseDataWithoutPagination(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmpWeeklyWiseDataWithoutPagination(req);
        }
        catch (error) {

            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/CancleSelfAttendanceAdjust')
    async CancleSelfAttendanceAdjust(@Body() req: AttnAdjustLogReq): Promise<CommonResponseModel> {
        try {
            return await this.service.CancleSelfAttendanceAdjust(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllForOTApproved')
    async getAllForOTApproved(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllForOTApproved(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateApprovedOTStatus')
    async updateApprovedOTStatus(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateApprovedOTStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateRevertOTStatus')
    async updateRevertOTStatus(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateRevertOTStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateRejectedOTStatus')
    async updateRejectedOTStatus(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateRejectedOTStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpByWeekOffForToday')
    async getEmpByWeekOffForToday(@Body() req?: AttenCoOffDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpByWeekOffForToday(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateAttendanceStatusByInOutTimings')
    async updateAttendanceStatusByInOutTimings(): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAttendanceStatusByInOutTimings();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateAttendanceStatusByInOutTimingsDateWise')
    async updateAttendanceStatusByInOutTimingsDateWise(@Body() req:AttendanceDateDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAttendanceStatusByInOutTimingsDateWise(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/calculateLateMin')
    @ApiBody({ type: lateMinReq })
    async calculateLateMin(@Body() req? : lateMinReq): Promise<CommonResponseModel> {
        try {
            return await this.service.calculateLateMin(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/calculateLateMinForDay')
    @ApiBody({ type: lateMinReq })
    async calculateLateMinForDay(@Body() req? : lateMinReq): Promise<CommonResponseModel> {
        try {
            return await this.service.calculateLateMinForDay(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllSinglePunchAttendance')
    async getAllSinglePunchAttendance(@Body() req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllSinglePunchAttendance(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }

    @Post('/getAllLeaveCOllision')
    async getAllLeaveCOllision(@Body() req: AttendanceDto): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllLeaveCOllision(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }

    @Post('/updateAttendanceWhileCollision')
    async updateAttendanceWhileCollision(@Body() req: AttendanceDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateAttendanceWhileCollision(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/deleteLeaveInAttendanceWhileCollision')
    async deleteLeaveInAttendanceWhileCollision(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.deleteLeaveInAttendanceWhileCollision(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllAttnAdjustmentId')
    async getAllAttnAdjustmentId(@Body() req: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllAttnAdjustmentId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }

    @Post('/getAllReportingManagerWiseAttnReport')
    async getAllReportingManagerWiseAttnReport(@Body() req: any): Promise<CommonResponseModel> {
       
        try {
            return await this.service.getAllReportingManagerWiseAttnReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllReportingManagerWiseAttnWhatsUp')
    async getAllReportingManagerWiseAttnWhatsUp(@Body() req: any): Promise<CommonResponseModel> {
        console.log(req,"conreq")
        try {
            return await this.service.getAllReportingManagerWiseAttnWhatsUp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getLateMinMomentRecordsData')
    async getLateMinMomentRecordsData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getLateMinMomentRecordsData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/approveLateMin')
    async approveLateMin(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.approveLateMin(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/rejectLateMin')
    async rejectLateMin(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.rejectLateMin(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    
}
