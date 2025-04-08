import { ApplicationExceptionHandler, CommonResponseModel, EmpNonRecurringReq, EmpNonRecurringRequest, EmpNonRecurringUpdateReq } from '@hrexpert/shared-models';
import { PayrollReq } from '@hrexpert/shared-services';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PayrollRecordsDto } from './dto/payroll-records.dto';
import { PayrollRecordsService } from './payroll-records.service';


@Controller('/payroll-records')
@ApiTags('/payroll-records')
export class PayrollRecordsController {
    constructor(
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
        private payrollRecordService: PayrollRecordsService,
    ) { }

    @Post('/getPayrollComparisonReport')
    @ApiBody({ type: PayrollRecordsDto })
    async getPayrollComparisonReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getPayrollComparisonReport(req)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error)
        }
    }

    @Post('/getAllPayrollRecords')
    @ApiBody({ type: PayrollReq })
    async getAllPayrollRecords(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getAllPayrollRecords(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getPayrollRecords')
    async getPayrollRecords(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getPayrollRecords(req)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error)
        }
    }

    @Post('/createEmpNonRecurring')
    async createEmpNonRecurring(@Body() req: EmpNonRecurringReq): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.createEmpNonRecurring(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpNonRecurring')
    async getEmpNonRecurring(@Body() req: EmpNonRecurringRequest): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getEmpNonRecurring(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updatePayrollCompRecords')
    async updatePayrollCompRecords(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.updatePayrollCompRecords(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/saveEmployeeNonRecComponent')
    async saveEmployeeNonRecComponent(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.saveEmployeeNonRecComponent(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmpNonRecurring')
    async updateEmpNonRecurring(@Body() req: EmpNonRecurringUpdateReq): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.updateEmpNonRecurring(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/generateEmpPayrollRecords')
    async generateEmpPayrollRecords(): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.generateEmpPayrollRecords();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/generateEmpPayrollRecordsForBranch')
    async generateEmpPayrollRecordsForBranch(@Body() req: { branchId: number }): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.generateEmpPayrollRecordsForBranch(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/generateEmpPayrollRecordsByEmpId')
    async generateEmpPayrollRecordsByEmpId(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.generateEmpPayrollRecordsByEmpId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllPayrollComponentsData')
    async getAllPayrollComponentsData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getAllPayrollComponentsData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllPayrollRecordsData')
    async getAllPayrollRecordsData(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getAllPayrollRecordsData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/updateAutomaticallyValue')
    async updateAutomaticallyValue(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.updateAutomaticallyValue();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getTermLogs')
    async getTermLogs(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.getTermLogs(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updatePayrollRecordsFromEmployee')
    async updatePayrollRecordsFromEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollRecordService.updatePayrollRecordsFromEmployee(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
