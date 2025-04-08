import { ApplicationExceptionHandler, CommonResponseModel, PayrollProcessedLogReq } from '@hrexpert/shared-models';
import { MonthWIseEmpReportReq } from '@hrexpert/shared-services';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from "multer";
import { join } from 'path';
import { PayrollHeadCountDto } from './dto/payroll-headcount-dto';
import { PayrollMisReportDto } from './dto/payroll-mis-report-dto';
import { PayrollProcessedLogService } from './payroll-processed-log.service';


@Controller('/payroll-processed-log')
@ApiTags('/payroll-processed-log')
export class PayrollProcessedLogController {
    constructor(
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
        private payrollProcessedLogService: PayrollProcessedLogService,
    ) { }

    @Post('/getPayrollProcessedLog')
    async getPayrollProcessedLog(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollProcessedLog(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/getPayrollMonth')
    async getPayrollMonth(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollMonth(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/getPayrollDataById')
    async getPayrollDataById(@Body() req: PayrollProcessedLogReq): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollDataById(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/pdfUploadTemp')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        limits: { files: 1 },
        storage: diskStorage({
            destination: join(__dirname, '../../../', `uploaded_images`),
            filename: (req, file, callback) => {
                console.log(file.originalname);
                const name = file.originalname;
                callback(null, `${name}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG|pdf|PDF)$/)) {
                return callback(new Error('Only jpg,png,jpeg files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async pdfUploadTemp(@UploadedFile() file, @Body() data: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.pdfUploadTemp(file.path, file.filename, file.originalname, data);
        } catch (error) {
        }
    }


    @Post('/getPayrollProcessLogReport')
    async getPayrollProcessLogReport(): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollProcessLogReport()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/payrollStatusticsWhatsApi')
    async payrollStatusticsWhatsApi(): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.payrollStatusticsWhatsApi()
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getPayrollHeadCountReportData')
    @ApiBody({ type: PayrollHeadCountDto })
    async getPayrollHeadCountReportData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollHeadCountReportData(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBankRecompilationData')
    @ApiBody({ type: MonthWIseEmpReportReq })
    async getBankRecompilationData(@Body() req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getBankRecompilationData(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getCashRecompilationData')
    @ApiBody({ type: MonthWIseEmpReportReq })
    async getCashRecompilationData(@Body() req: MonthWIseEmpReportReq): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getCashRecompilationData(req)
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getEmployeesData')
    @ApiBody({ type: MonthWIseEmpReportReq })
    async getEmployeesData(@Body() req: any): Promise<any> {
        console.log(req, 'c--req')
        try {
            return await this.payrollProcessedLogService.getEmployeesDataByBank(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error)
        }
    }

    @Post('/getPayrollProcessedLogForHodApproval')
    async getPayrollProcessedLogForHodApproval(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollProcessedLogForHodApproval(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/updatePayrollHoldAndReleaseStatus')
    async updatePayrollHoldAndReleaseStatus(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.updatePayrollHoldAndReleaseStatus(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/getAllPayrollHeadWiseReport')
    async getAllPayrollHeadWiseReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getAllPayrollHeadWiseReport(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/getPayrollMisReportEmployee')
    @ApiBody({ type: PayrollMisReportDto })
    async getPayrollMisReportEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollMisReportEmployee(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }

    @Post('/getPayrollMisReportWorker')
    @ApiBody({ type: PayrollMisReportDto })
    async getPayrollMisReportWorker(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollMisReportWorker(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }
    
    @Post('/getPayrollEsiReport')
    async getPayrollEsiReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.payrollProcessedLogService.getPayrollEsiReport(req)
        } catch (err) {
            return await this.applicationExceptionHandler.returnException(err, CommonResponseModel)
        }
    }
}