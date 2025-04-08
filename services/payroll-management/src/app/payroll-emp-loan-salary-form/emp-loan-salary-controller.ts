import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApplicationExceptionHandler ,CommonResponseModel, EmpLoanSalarySharedIdDto, LoanSalaryStatusEnum} from "@hrexpert/shared-models";
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoanSalaryDto } from './dto/emp-loan-salary-dto';
import { EmpLoanSalaryService } from './emp-loan-salary-service';

@Controller('/employee-loans')
@ApiTags('/employee-loans')
export class EmpLoanSalaryController {
    constructor(
        private service: EmpLoanSalaryService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) {}

    @Post('/createEmployeeLoanSalary')
    @ApiBody({ type: LoanSalaryDto })
    async createEmployeeLoanSalary(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmployeeLoanSalary(req);
        } catch (error) {
        return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpLoanSalary')
    @ApiBody({})
    async getEmpLoanSalary(@Body() req: any) :Promise<CommonResponseModel>{
        try {
            console.log('controller')
            return await this.service.getEmpLoanSalary(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel,error);
        }
    }

    @Post('/getPreviousLoans')
    @ApiBody({ type: LoanSalaryDto })
    async getPreviousLoans(@Body() req: LoanSalaryDto) :Promise<CommonResponseModel>{
        try {
            return await this.service.getPreviousLoans(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel,error);
        }
    }

    @Post('/getLoansData')
    @ApiBody({ type: LoanSalaryDto })
    async getLoansData(@Body() req: LoanSalaryDto) :Promise<CommonResponseModel>{
        try {
            return await this.service.getLoansData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel,error);
        }
    }


    @Post('/approve/:id')
        @ApiBody({ type: LoanSalaryDto })
    async approveLoan(@Param('id') id: number): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLoanStatus(id, LoanSalaryStatusEnum.APPROVED);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/reject/:id')
        @ApiBody({ type: LoanSalaryDto })
    async rejectLoan(@Param('id') id: number): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLoanStatus(id, LoanSalaryStatusEnum.REJECTED);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    
    @Post('/approveRejectLoan')
    @ApiBody({})
    async approveRejectLoan(@Body() req: { id: number, remarks: string, req: string, componentId: number }): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLoanStatusWithRemarks(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }
    
    @Post('/getEmpLoanSalaryById')
    async getEmpLoanSalaryById(@Body() req: EmpLoanSalarySharedIdDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpLoanSalaryById(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }
}