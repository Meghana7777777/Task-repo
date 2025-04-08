import { ApplicationExceptionHandler, CommonResponseModel, EmpDataReq, LeaveAllocationReqDto } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LeaveAllocationsService } from './leave-allocation-service';
import { LeaveAllocationsDto } from './dto/leave-allocation-dto';
import { LeaveAdjustmentDto } from './dto/leave-adjustment-dto';


@Controller('/leave-allocations')
@ApiTags('/leave-allocations')
export class LeaveAllocationsController {
    constructor(
        private service: LeaveAllocationsService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/getAllActiveEmpDropDown')
    @ApiBody({ type: EmpDataReq })
    async getAllActiveEmpDropDown(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveEmpDropDown(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActiveEmp')
    @ApiBody({ type: EmpDataReq })
    async getAllActiveEmp(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveEmp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllActiveLeaveTypes')
    async getAllActiveLeaveTypes(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllActiveLeaveTypes();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    // @Post('/getLeaveAllocationData')
    // async getLeaveAllocationData(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
    //     try {
    //         return await this.service.getLeaveAllocationData(req);
    //     } catch (error) {
    //         return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    //     }
    // }

    @Post('/getLeaveAllocationData')
    async getLeaveAllocationData(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getLeaveAllocationData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllLeaveBalanceReport')
    async getAllLeaveBalanceReport(@Body() req: LeaveAllocationReqDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveBalanceReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllLeaveAllocations')
    async getAllLeaveAllocations(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveAllocations();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    

    @Post('/getAllLeaveAllocationsLeaveTypes')
    async getAllLeaveAllocationsLeaveTypes(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveAllocationsLeaveTypes(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getLeaveHistoryReport')
    async getLeaveHistoryReport(@Body() req:any) : Promise<CommonResponseModel> {
        try {
            return await this.service.getLeaveHistoryReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel,error);
        }
    }

    @Post('/allocateLeave')
    @ApiBody({ type: LeaveAllocationsDto })
    async allocateLeave(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.allocateLeave(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    
    @Post('/updateLeaveAllocations')
    async updateLeaveAllocations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLeaveAllocations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getLeavesByEmpId')
    @ApiBody({ type: EmpDataReq })
    async getLeavesByEmpId(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getLeavesByEmpId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createLeaveAdjustment')
    @ApiBody({ type: LeaveAdjustmentDto })
    async createLeaveAdjustment(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createLeaveAdjustment(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/allocateLeaveExcel')
    async allocateLeaveExcel(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.allocateLeaveExcel(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getLeaveAllocationMonthlyLogsData')
    async getLeaveAllocationMonthlyLogsData(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getLeaveAllocationMonthlyLogsData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllNewLeaveAllocationsLeaveTypes')
    async getAllNewLeaveAllocationsLeaveTypes(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllNewLeaveAllocationsLeaveTypes(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateNewLeaveAllocations')
    async updateNewLeaveAllocations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateNewLeaveAllocations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
