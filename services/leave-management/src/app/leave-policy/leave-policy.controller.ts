import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeavePolicyService } from './leave-policy.service';
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { LeavePolicyDto } from './dtos/leave-policy-dto';
import { EmpDataReq, LeavePolicyReq } from '@hrexpert/shared-models';
import { DateMonthReq } from './dtos/date-month-req';

  
  @ApiTags('leave-policy')
  @Controller('leave-policy')
  export class LeavePolicyController {
    constructor(
        private readonly leavePolicyService: LeavePolicyService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
        
    ) {}
    
    @Post('/createLeavePolicy')
    @ApiResponse({status: 201,description: 'Leave policy created successfully',type: CommonResponseModel,})
    @ApiResponse({status: 400,description: 'Bad Request',})
    @ApiBody({type: LeavePolicyDto,description: 'Payload to create a leave policy',})
    async createLeavePolicy(@Body() req: LeavePolicyDto): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.createLeavePolicy(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getAllLeavePolicies')
    @ApiResponse({ status: 200, description: 'Leave policies fetched successfully', type: CommonResponseModel })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getAllLeavePolicies(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.getAllLeavePolicies();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/getAllLeavePoliciesWithoutRelation')
    @ApiResponse({ status: 200, description: 'Leave policies fetched successfully', type: CommonResponseModel })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getAllLeavePoliciesWithoutRelation(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.getAllLeavePoliciesWithoutRelation();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/mapTypeAndGroup')
    @ApiResponse({status: 201,description: 'Leave policy created successfully',type: CommonResponseModel,})
    @ApiResponse({status: 400,description: 'Bad Request',})
    async mapTypeAndGroup(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.mapTypeAndGroup(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getLeaveGroupData')
    @ApiResponse({ status: 200, description: 'Leave policies fetched successfully', type: CommonResponseModel })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async getLeaveGroupData(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.getLeaveGroupData();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/createLeaveApplicability')
    async createLeaveApplicability(@Body() req: any): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.createLeaveApplicability(req);
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/getLeaveApplicabilityData')
    async getLeaveApplicabilityData(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.getLeaveApplicabilityData();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/createLeaveGroup')
    async createLeaveGroup(@Body() req: any): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.createLeaveGroup(req, false);
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/updateLeaveGroup')
    async updateLeaveGroup(@Body() req: any): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.createLeaveGroup(req, true);
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/getLeaveTypeGroupMapping')
    async getLeaveTypeGroupMapping(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.getLeaveTypeGroupMapping();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/allocateLeavesToEmp')
    async allocateLeavesToEmp(req?: EmpDataReq): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.allocateLeavesToEmp(req);
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/updateLeaveActivation')
    async updateLeaveActivation(): Promise<CommonResponseModel> {
      try {
        return await this.leavePolicyService.updateLeaveActivation();
      } catch (err) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
      }
    }

    @Post('/activateOrDeactivateLeavePolicy')
        @ApiBody({ type: LeavePolicyDto })
        async activateOrDeactivateLeavePolicy(@Body() dto: LeavePolicyDto): Promise<CommonResponseModel> {
            try {
                return await this.leavePolicyService.activateOrDeactivateLeavePolicy(dto);
            } catch (error) {
                return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
            }
        }

 @Post('/getleavePolicyDetailsById')
    async getleavePolicyDetailsById(@Body() req:LeavePolicyReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.leavePolicyService.getleavePolicyDetailsById(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLeavePolicy')
    // @ApiBody({ type: EmployeeDetailsDTO })
    async updateLeavePolicy(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.updateLeavePolicy(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    // @Post('/accrueLeaves')
    // // @ApiBody({ type: EmployeeDetailsDTO })
    // async accrueLeaves(): Promise<CommonResponseModel> {
    //     try {
    //         return await this.leavePolicyService.accrueLeaves();
    //     } catch (error) {
    //         return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    //     }
    // }

    @Post('/resetLeaves')
    @ApiBody({type: DateMonthReq})
    async resetLeaves(@Body() req?: DateMonthReq): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.resetLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/accumulateLeaves')
    @ApiBody({type: DateMonthReq})
    async accumulateLeaves(@Body() req?: DateMonthReq): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.accumulateLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveLeaveType')
    async getActiveLeaveType(): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.getActiveLeaveType();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getLeaveCodeById')
    @ApiBody({type: LeavePolicyDto,description: ' leave policy',})
    async getLeaveCodeById(@Body() req:LeavePolicyDto): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.getLeaveCodeById(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllTypesOfLeavesPolicy')
    async getAllTypesOfLeavesPolicy(@Body() req:any): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.getAllTypesOfLeavesPolicy();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/leavesAccumlating')
    @ApiBody({type: DateMonthReq})
    async leavesAccumlating(@Body() req?: DateMonthReq): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.leavesAccumlating(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLeavesAccumulation')
    @ApiBody({})
    async updateLeavesAccumulation(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.leavePolicyService.updateLeavesAccumulation(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    
  }
  