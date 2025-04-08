import { ApplicationExceptionHandler, ApplyForLeavesResponseModels, ApplyLeavesStatusReq, CommonResponseModel } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApplyForLeaveService } from './apply-for-leaves.service';
import { ApplyForLeavesDto } from './dto/apply-for-leaves.dto';
import { ApplyLeaveBrachDto } from './dto/apply-leave-branch.dto';
import { ApplyLeavesDto } from './dto/apply-leave.dto';
import { ApplyForLeavesEntity } from './entities/apply-for-leaves.entity';

@Controller('/apply-for-leaves')
@ApiTags('/apply-for-leaves')
export class ApplyForLeavesController {
    constructor(
        private service: ApplyForLeaveService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/saveBulkLeaveExcel')
    @ApiBody({ type: ApplyForLeavesEntity })
    async saveBulkLeaveExcel(@Body() req: ApplyForLeavesEntity): Promise<CommonResponseModel> {
        try {
            return await this.service.saveBulkLeaveExcel(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/saveExceededLeaveExcelData')
    async saveExceededLeaveExcelData(@Body() req:any[]): Promise<CommonResponseModel> {
        try {
            return await this.service.saveExceededLeaveExcelData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAppliedForLeaves')
    async getAppliedForLeaves(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAppliedForLeavesOpen')
    async getAppliedForLeavesOpen(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeavesOpen(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAppliedForLeavesApproved')
    async getAppliedForLeavesApproved(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeavesApproved(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAppliedForLeavesRejected')
    async getAppliedForLeavesRejected(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeavesRejected(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAppliedForLeavesCancel')
    async getAppliedForLeavesCancel(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeavesCancel(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createManualLeave')
    async createManualLeave(@Body() req: ApplyForLeavesDto): Promise<ApplyForLeavesResponseModels> {
        try {
            return await this.service.createManualLeave(req, false);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ApplyForLeavesResponseModels, error);
        }
    }
    @Post('/getActiveEmployeesById')
    async getActiveEmployeesById(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveEmployeesById();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveEmployeesByIds')
    async getActiveEmployeesByIds(@Body() req: ApplyLeaveBrachDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveEmployeesByIds(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmployeeNameByCode')
    async getEmployeeNameByCode(): Promise<any> {
        try {
            return await this.service.getEmployeeNameByCode();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }



    @Post('/getHolidaysDateFromHolidayMaster')
    async getHolidaysDateFromHolidayMaster(): Promise<CommonResponseModel> {
        try {
            return await this.service.getHolidaysDateFromHolidayMaster();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getWeekOfDataFromWeekOfTable')
    async getWeekOfDataFromWeekOfTable(): Promise<CommonResponseModel> {
        try {
            return await this.service.getWeekOfDataFromWeekOfTable();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAttStatusData')
    async getAttStatusData(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAttStatusData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllTypesOfLeavesData')
    async getAllTypesOfLeavesData(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllTypesOfLeavesData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllLeaveAllocationsData')
    async getAllLeaveAllocationsData(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveAllocationsData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getLeaveHistory')
    async getLeaveHistory(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getLeaveHistory(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateApplyLeaveStatusApproved')
    @ApiBody({ type: ApplyLeavesDto })
    async updateApplyLeaveStatusApproved(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateApplyLeaveStatusApproved(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateApplyLeaveStatusApprovedBulk')
    @ApiBody({ type: ApplyLeavesDto })
    async updateApplyLeaveStatusApprovedBulk(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateApplyLeaveStatusApprovedBulk(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateApplyLeaveStatusRejected')
    @ApiBody({ type: ApplyLeavesDto })
    async updateApplyLeaveStatusRejected(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateApplyLeaveStatusRejected(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateApplyLeaveStatusCanceled')
    @ApiBody({ type: ApplyLeavesDto })
    async updateApplyLeaveStatusCanceled(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateApplyLeaveStatusCanceled(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/attendanceWiseSelectedEmployee')
    async attendanceWiseSelectedEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.attendanceWiseSelectedEmployee(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateManualLeave')
    async updateManualLeave(@Body() req: ApplyForLeavesDto): Promise<ApplyForLeavesResponseModels> {
        try {
            return await this.service.updateManualLeave(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ApplyForLeavesResponseModels, error);
        }
    }

    @Post('/CancleManualLeave')
    async CancleManualLeave(@Body() req: ApplyForLeavesDto): Promise<ApplyForLeavesResponseModels> {
        try {
            return await this.service.CancleManualLeave(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ApplyForLeavesResponseModels, error);
        }
    }
    @Post('/getAppliedForLeavesIdById')
    async getAppliedForLeavesIdById(@Body() req:ApplyLeavesStatusReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAppliedForLeavesIdById(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getExceededData')
    async getExceededData(@Body() req?:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getExceededData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllRMLeaves')
    async getAllRMLeaves(@Body() req?:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllRMLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllRMData')
    async getAllRMData(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllRMData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getReportingManagerData')
    async getReportingManagerData(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.service.getReportingManagerData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/applyLeaveStatusApprovedByRmWhatsapp')
    @ApiBody({ type: ApplyLeavesDto })
    async applyLeaveStatusApprovedByRmWhatsapp(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.applyLeaveStatusApprovedByRmWhatsapp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/applyLeaveStatusRejectedByRmWhatsapp')
    @ApiBody({ type: ApplyLeavesDto })
    async applyLeaveStatusRejectedByRmWhatsapp(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.applyLeaveStatusRejectedByRmWhatsapp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getMobileNoByEmpCode')
    @ApiBody({  })
    async getMobileNoByEmpCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getMobileNoByEmpCode(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
