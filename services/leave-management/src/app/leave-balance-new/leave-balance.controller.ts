import { ApplicationExceptionHandler, CommonResponseModel, EmpDataReq, LeavesAccumulationReq } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LeaveBalanceService } from './leave-balance.service';


@Controller('/leave-balance')
@ApiTags('/leave-balance')
export class LeaveBalanceController {
    constructor(
        private service: LeaveBalanceService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }


    @Post('/getAllLeaveBalanceData')
    async getAllLeaveBalanceData(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveBalanceData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLeavesBalance')
    @ApiBody({})
    async updateLeavesBalance(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLeavesBalance(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/leavesAccumlation')
    @ApiBody({})
    async leavesAccumlation(@Body() req: LeavesAccumulationReq): Promise<CommonResponseModel> {
        try {
            return await this.service.leavesAccumlation(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/allocateLeavesToEmp')
   // @ApiBody({})
    async allocateLeavesToEmp(@Body() req: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.allocateLeavesToEmp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    
    @Post('/getAllLeaveBalance')
    async getAllLeaveBalance(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveBalance(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllLeaveBalanceAllocations')
    async getAllLeaveBalanceAllocations(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveBalanceAllocations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllLeaveBalanceAllocationsAllMonths')
    async getAllLeaveBalanceAllocationsAllMonths(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllLeaveBalanceAllocationsAllMonths(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


}
