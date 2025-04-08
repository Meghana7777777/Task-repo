import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LeaveTypeService } from "./leave-type-master.service";


@ApiTags('leave-type')
@Controller('leave-type')
export class LeaveTypeController {
    constructor(
        private readonly leaveTypeService: LeaveTypeService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    @Post('/createLeaveType')
    async createLeaveType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.createLeaveType(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllLeaveType')
    async getAllLeaveType(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllLeaveType();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/activateOrDeactivateLeaveType')
    async activateOrDeactivateLeaveType(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.activateOrDeactivateLeaveType(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllActiveLeaveType')
    async getAllActiveLeaveType(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllActiveLeaveType();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    //----------------------Leave Group----------------------

    @Post('/createLeaveGroup')
    async createLeaveGroup(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.createLeaveGroup(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllLeaveGroup')
    async getAllLeaveGroup(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllLeaveGroup();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/activateOrDeactivateLeaveGroup')
    async activateOrDeactivateLeaveGroup(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.activateOrDeactivateLeaveGroup(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllActiveLeaveGroup')
    async getAllActiveLeaveGroup(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllActiveLeaveGroup();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    //----------------------Leave Master----------------------
    @Post('/createLeave')
    async createLeave(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.createLeave(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllLeave')
    async getAllLeave(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllLeave();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/activateOrDeactivateLeave')
    async activateOrDeactivateLeave(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.activateOrDeactivateLeave(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllActiveLeave')
    async getAllActiveLeave(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllActiveLeave();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    //----------------leave define -------------
    @Post('/saveLeaveCodeDefine')
    async saveLeaveCodeDefine(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.saveLeaveCodeDefine(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/saveLeaveGroupCodeMapping')
    async saveLeaveGroupCodeMapping(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.saveLeaveGroupCodeMapping(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllGroupCodeMapData')
    async getAllGroupCodeMapData(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllGroupCodeMapData();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllActiveGeneratedCode')
    async getAllActiveGeneratedCode(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllActiveGeneratedCode();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/activateOrDeactivateLeaveGroupCode')
    async activateOrDeactivateLeaveGroupCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.activateOrDeactivateLeaveGroupCode(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/codeDefineDataByLeaveGroupCode')
    async codeDefineDataByLeaveGroupCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.codeDefineDataByLeaveGroupCode(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllGeneratedCode')
    async getAllGeneratedCode(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.getAllGeneratedCode();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/leaveDetuctionTest')
    async leaveDetuctionTest(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.leaveDetuctionTest();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/leaveDeductionFromEmployee')
    async leaveDeductionFromEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.leaveDeductionFromEmployee(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/leaveAccumulationForNewJoinee')
    async leaveAccumulationForNewJoinee(): Promise<CommonResponseModel> {
        try {
            return await this.leaveTypeService.leaveAccumulationForNewJoinee();
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }
}