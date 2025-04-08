
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { ActiveEmployeesForAttendanceResponseModel, AttendanceDto, BranchReq, CommonResponseModel, DashboardReq, DropdownResponseModel, EmpDataReq, EmployeeBulkRequest, EmployeeCodeReq, EmployeeDetailsDto, EmployeeDocDto, EmployeeMobileReq, EmployeesActivateDeactivateDto, EmployeeShiftReq, EmployeeShiftUpdateReq, EmployeeViewResponseModel, EmployeIdReq, lateMinReq } from '@hrexpert/shared-models';
import { EmployeeFilterReq } from '@hrexpert/shared-services';
import { Body, Controller, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from "multer";
import { extname, join } from "path";
import { BranchReqDto } from '../branches/branch-req.dto';
import { EmployeeDetailsDTO } from './dto/emp-dto';
import { EmpResignationDto } from './dto/emp-resignation-proofs-dto';
import { PrefixConfigurationDTO } from './dto/prefix-configuration.dto';
import { EmployeeOnboardingService } from './employee-onboarding.service';
// import any from '../../../../../employee-directory/resignation-proofs'

class PhoneNumberReq {
    phoneNumber: string
}
@Controller('employee-onboarding')
export class EmployeeOnboardingController {
    constructor(
        private service: EmployeeOnboardingService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/getAllEmployees')
    async getAllEmployees(@Body() req: EmployeeFilterReq, isExcel: boolean): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllEmployees(req, isExcel);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getInActiveEmployeeList')
    async getInActiveEmployeeList(@Body() req: DashboardReq): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getInActiveEmployeeList(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(EmployeeViewResponseModel, error);
        }
    }


    @Post('/getActiveEmployeeList')
    async getActiveEmployeeList(@Body() req? : any): Promise<ActiveEmployeesForAttendanceResponseModel> {
        try {
            return await this.service.getActiveEmployeeList(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ActiveEmployeesForAttendanceResponseModel, error);
        }
    }

    @Post('/getAllActiveEmpForAttendance')
    async getAllActiveEmpForAttendance(@Body() req?: any): Promise<ActiveEmployeesForAttendanceResponseModel> {
        try {
            return await this.service.getAllActiveEmpForAttendance(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ActiveEmployeesForAttendanceResponseModel, error);
        }
    }
    @Post('/getAllActiveEmpForAttendances')
    async getAllActiveEmpForAttendances(): Promise<ActiveEmployeesForAttendanceResponseModel> {
        try {
            return await this.service.getAllActiveEmpForAttendances();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(ActiveEmployeesForAttendanceResponseModel, error);
        }
    }


    @Post('/getAllEmpAginstDepartment')
    async getAllEmpAginstDepartment(): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllEmpAginstDepartment();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateAndDeactiveEmployees')
    async activateAndDeactiveEmployees(@Body() req: EmployeesActivateDeactivateDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateAndDeactiveEmployees(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeeData')
    async getAllEmployeeData(): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllEmployeeData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeesData')
    @ApiBody({ type: EmployeeDetailsDTO })
    async getAllEmployeesData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllReportManagerData')
    @ApiBody({ type: EmployeeDetailsDTO })
    async getAllReportManagerData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllReportManagerData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmployeeReportingManager')
    async updateEmployeeReportingManager(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateEmployeeReportingManager(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmployeeWithReportingManager')
    async getEmployeeWithReportingManager(): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmployeeWithReportingManager();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveEmployeeDropdownData')
    async getActiveEmployeeDropdownData(): Promise<DropdownResponseModel> {
        try {
            return await this.service.getActiveEmployeeDropdownData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getAllEmployeeNameAndCodeAgainstEmpId')
    async getAllEmployeeNameAndCodeAgainstEmpId(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeeNameAndCodeAgainstEmpId();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllEmployeeNameAndCodeAgainstEmpIds')
    async getAllEmployeeNameAndCodeAgainstEmpIds(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeeNameAndCodeAgainstEmpIds(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/referenceBasedEmployeeData')
    async referenceBasedEmployeeData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.referenceBasedEmployeeData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/createEmployee')
    // @ApiBody({ type: EmployeeDetailsDTO })
    async createEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.createEmployee(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmployee')
    // @ApiBody({ type: EmployeeDetailsDTO })
    async updateEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateEmployee(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeesForShiftMap')
    async getAllEmployeesForShiftMap(@Body() req: EmployeeShiftReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesForShiftMap(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getBranchesInEmpDetails')
    async getBranchesInEmpDetails(): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchesInEmpDetails();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getDivisionsInEmpDetails')
    async getDivisionsInEmpDetails(): Promise<CommonResponseModel> {
        try {
            return await this.service.getDivisionsInEmpDetails();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getDepartmentsInEmpDetails')
    async getDepartmentsInEmpDetails(): Promise<CommonResponseModel> {
        try {
            return await this.service.getDepartmentsInEmpDetails();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateEmpLogsByShiftCode')
    async updateEmpLogsByShiftCode(@Body() req: EmployeeShiftUpdateReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.updateEmpLogsByShiftCode(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeesTable')
    async getAllEmployeesTable(@Body() req: EmployeeDetailsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesTable();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpById')
    async getEmpById(@Body() req: EmployeIdReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getEmpById(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getBankPaymentReport')
    async getBankPaymentReport(): Promise<CommonResponseModel> {
        try {
            return await this.service.getBankPaymentReport();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }

    }

    @Post('/employeeWhastappApi')
    async employeeWhastappApi(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.employeeWhastappApi(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/saveEmployeePrefixConfigurations')
    async saveEmployeePrefixConfigurations(@Body() req: PrefixConfigurationDTO): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.saveEmployeePrefixConfigurations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Get('/getPrefixConfigForEmpType/:employeeTypeId')
    async getPrefixConfigForEmpType(@Param('employeeTypeId') employeeTypeId: string): Promise<CommonResponseModel> {
        try {
            return await this.service.getPrefixConfigForEmpType(parseInt(employeeTypeId));
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getHeadCount')
    @ApiBody({ type: DashboardReq })
    async getHeadCount(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getHeadCount(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchAgaintEmployess')
    async getBranchAgaintEmployess(@Body() req: BranchReqDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchAgaintEmployess(req);
        }
        catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/attendanceWhatsappAlertCountEmployee')
    async attendanceWhatsappAlertCountEmployee(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.attendanceWhatsappAlertCountEmployee();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpCodeByDetails')
    async getEmpCodeByDetails(@Body() req: EmployeeCodeReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getEmpCodeByDetails(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpDetailsByBranch')
    async getEmpDetailsByBranch(@Body() req: BranchReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getEmpDetailsByBranch(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getEmpTenureByGender')
    @ApiBody({ type: DashboardReq })
    async getEmpTenureByGender(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpTenureByGender(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpGenderAge')
    @ApiBody({ type: DashboardReq })
    async getEmpGenderAge(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpGenderAge(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getConfigurations')
    async getConfigurations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getConfigurations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/saveOrUpdateConfigurations')
    async saveOrUpdateConfigurations(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.saveOrUpdateConfigurations(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/employeeImageUpload')
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
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/)) {
                return callback(new Error('Only jpg,png,jpeg files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async employeeImageUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
        try {
            return await this.service.employeeImageUpload(file.path, file.filename, uploadData.id, file.originalname);
        } catch (error) {
        }
    }


    @Post('/employeeDocumentUpload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor({
        limits: { files: 5 },
        storage: diskStorage({
            destination: join(__dirname, '../../../', `employee-directory/id-proofs`),
            filename: (req, file, callback) => {
                const name = file.originalname;
                callback(null, `${Date.now()}-${name}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG|pdf|PDF)$/)) {
                return callback(new Error('Only jpg, png, jpeg, pdf files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async employeeDocumentUpload(@UploadedFiles() files: Express.Multer.File[], @Body() data: any): Promise<CommonResponseModel> {
        try {
            if (!data.idProofs) throw new Error("Missing idProofs in request body");

            const idProofs = JSON.parse(data.idProofs);
            return await this.service.employeeDocumentUpload(files, idProofs, data);
        } catch (error) {
            console.error("Error uploading employee documents:", error);
            return new CommonResponseModel(false, 500, 'Internal Server Error', null);
        }
    }


    @Post('/getAllEmployeeApprovalData')
    async getAllEmployeeApprovalData(): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getAllEmployeeApprovalData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getUpdateEmployeeApprovalData')
    async getUpdateEmployeeApprovalData(@Body() req: EmployeeDetailsDto): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getUpdateEmployeeApprovalData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getUpdateEmployeeRejectData')
    async getUpdateEmployeeRejectData(@Body() req: EmployeeDetailsDto): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getUpdateEmployeeRejectData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllEmpBelowAgeWorkingData')
    async getAllEmpBelowAgeWorkingData(): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getAllEmpBelowAgeWorkingData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmployeeDocuments')
    async getEmployeeDocuments(@Body() req: EmployeeDocDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmployeeDocuments(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/excelDownload')
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

    @Post('/getReportManagaerWithEmployeess')
    async getReportManagaerWithEmployeess(@Body() req?: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getReportManagaerWithEmployeess();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getAllReportingManagerAndCode')
    async getAllReportingManagerAndCode(@Body() req?: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllReportingManagerAndCode();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    
    @Post('/getAllRMData')
    async getAllRMData(@Body() req?: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllRMData();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllWeekEmployees')
    async getAllWeekEmployees(@Body() req: EmployeeFilterReq): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllWeekEmployees(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDOBofEmp')
    @ApiBody({ type: DashboardReq })
    async getDOBofEmp(@Body() req: DashboardReq): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getDOBofEmp(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/sendBirthdayMessages')
    async sendBirthdayMessages(@Body() req: DashboardReq): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.sendBirthdayMessages(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeesTableFroms')
    @ApiBody({ type: EmployeeDetailsDTO })
    async getAllEmployeesTableFroms(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesTableFroms(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmployeesPersonalImformationManagement')
    async getAllEmployeesPersonalImformationManagement(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmployeesPersonalImformationManagement(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllEmpForRec')
    async getAllEmpForRec(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllEmpForRec(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getAllEmpData')
    async getAllEmpData(req: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getAllEmpData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDivisionByBranchId')
    @ApiBody({ type: DashboardReq })
    async getDivisionByBranchId(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getDivisionByBranchId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getDepartmentByBranchId')
    @ApiBody({ type: DashboardReq })
    async getDepartmentByBranchId(@Body() req: DashboardReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getDepartmentByBranchId(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateDeactiveEmployee')
    @ApiBody({ type: EmployeeDetailsDto })
    async updateDeactiveEmployee(@Body() req: EmployeeDetailsDto): Promise<CommonResponseModel> {
        console.log(req, "amma")
        try {
            return await this.service.updateDeactiveEmployee(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpDataForLeaves')
    async getEmpDataForLeaves(req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpDataForLeaves(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/checkAadharPanDuplicates')
    @ApiBody({})
    async checkAadharPanDuplicates(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.checkAadharPanDuplicates(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/bulkEmpActiveInactive')
    @ApiBody({})
    async bulkEmpActiveInactive(@Body() req: EmployeeBulkRequest): Promise<CommonResponseModel> {
        try {
            return await this.service.bulkEmpActiveInactive(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/checkPfEsiDuplicates')
    @ApiBody({})
    async checkPfEsiDuplicates(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.checkPfEsiDuplicates(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLeaveAllotted')
    @ApiBody({})
    async updateLeaveAllotted(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLeaveAllotted(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateSalaryForEmployee')
    async updateSalaryForEmployee(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateSalaryForEmployee(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getRequestedEmpData')
    async getRequestedEmpData(@Body() req?: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getRequestedEmpData(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/handleEmpCodeDuplicate')
    @ApiBody({})
    async handleEmpCodeDuplicate(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.handleEmpCodeDuplicate(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpByCode')
    async getEmpByCode(@Body() req: EmployeeCodeReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getEmpByCode(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpByContact')
    async getEmpByContact(@Body() req: EmployeeMobileReq): Promise<CommonResponseModel> {
        // console.log(req,"conReq")
        try {
            return await this.service.getEmpByContact(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpDataForLateMinCal')
    async getEmpDataForLateMinCal(@Body() req?: lateMinReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpDataForLateMinCal(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/empResignationProofs')
    @ApiBody({ type: EmpResignationDto })
    async empResignationProofs(@Body() req: EmpResignationDto): Promise<CommonResponseModel> {
        try {
            return await this.service.empResignationProofs(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updatePath')
    @UseInterceptors(FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: join(__dirname, '../../../', `employee-directory`, `resignation-proofs`),
            filename: (req, file, callback) => {
                console.log(file, 'com=ntrol')
                const name = file.originalname.split('.')[0];
                const fileExtName = extname(file.originalname);
                const randomName = Array(4)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                callback(null, `${name}-${randomName}${fileExtName}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            //   if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
            //     return callback(new Error('Only png,jpeg,PNG,jpg,JPG files are allowed!'), false);
            //   }
            callback(null, true);
        },
    }))
    async updatePath(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<CommonResponseModel> {
        try {
            console.log(file, 'ffffffffiiiiiiiillllleeeeee')
            console.log(uploadData, 'uuuuupppppppppppllllllllloooaaaadd')
            return await this.service.updatePath(file, uploadData.resignationId)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpResignationProofs')
    async getEmpResignationProofs(req: any): Promise<EmployeeViewResponseModel> {
        try {
            return await this.service.getEmpResignationProofs();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/employeeExperienceDocumentUpload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(AnyFilesInterceptor({
        limits: { files: 5 },
        storage: diskStorage({
            destination: join(__dirname, '../../../', `employee-directory/experience-proofs`),
            filename: (req, file, callback) => {
                const name = file.originalname;
                callback(null, `${Date.now()}-${name}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG|pdf|PDF)$/)) {
                console.log("Invalid file format:", file.originalname);
                return callback(null, false);
            }
            callback(null, true);
        },
    }))
    async employeeExperienceDocumentUpload(@UploadedFiles() files, @Body() data: any): Promise<CommonResponseModel> {
        try {
            if (!data.expProofs) throw new Error("Missing expProofs in request body");

            const expProofs = JSON.parse(data.expProofs);
            return await this.service.employeeExperienceDocumentUpload(files, expProofs, data);
        } catch (error) {
            console.error("Error uploading employee experience documents:", error);
            return new CommonResponseModel(false, 500, 'Internal Server Error', null);
        }
    }

    @Post('/getEmpDataForPfAndEsi')
    async getEmpDataForPfAndEsi(@Body() req?: AttendanceDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpDataForPfAndEsi(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
    @Post('/getEmpDetailsReport')
    async getEmpDetailsReport(@Body() req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpDetailsReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }


    @Post('/getEmployyeDetailsForPhoneNumber')
    @ApiBody({ type: PhoneNumberReq })
    async getEmployyeDetailsForPhoneNumber(@Body() req: PhoneNumberReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmployyeDetailsForPhoneNumber(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEmpHistoryDetials')
    async getEmpHistoryDetials(@Body() req: EmpDataReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmpHistoryDetials(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLastLeave')
    async updateLastLeave(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLastLeave(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateLastAttnStatus')
    async updateLastAttnStatus(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateLastAttnStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchWiseEmpStatusReport')
    async getBranchWiseEmpStatusReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchWiseEmpStatusReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/saveSwipeProcessLogs')
    async saveSwipeProcessLogs(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.saveSwipeProcessLogs(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateReportingManager')
    async updateReportingManager(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.updateReportingManager(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchWiseWorkerStatusReport')
    async getBranchWiseWorkerStatusReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchWiseWorkerStatusReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchEmployeeWiseMisReport')
    async getBranchEmployeeWiseMisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchEmployeeWiseMisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchWorkerWiseMisReport')
    async getBranchWorkerWiseMisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchWorkerWiseMisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchWisePayrollCount')
    async getBranchWisePayrollCount(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchWisePayrollCount(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchWiseAttritionCount')
    async getBranchWiseAttritionCount(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchWiseAttritionCount(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getMonthlyAttendanceMisReport')
    async getMonthlyAttendanceMisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getMonthlyAttendanceMisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDeptWiseEmpStrengthForHr')
    async getDeptWiseEmpStrengthForHr(): Promise<CommonResponseModel> {
        try {
            return await this.service.getDeptWiseEmpStrengthForHr();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getDeptWiseWorkerStrengthForHr')
    async getDeptWiseWorkerStrengthForHr(): Promise<CommonResponseModel> {
        try {
            return await this.service.getDeptWiseWorkerStrengthForHr();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getEnrollmentReport')
    async getEnrollmentReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getEnrollmentReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    } 
    
    @Post('/getEmployeeNamesList')
    async getEmployeeNamesList(): Promise<CommonResponseModel> {
        try {
            return await this.service.getEmployeeNamesList();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getMonthSalariesSummaryReport')
    async getMonthSalariesSummaryReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getMonthSalariesSummaryReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchNamesList')
    async getBranchNamesList(): Promise<CommonResponseModel> {
        try {
            return await this.service.getBranchNamesList();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAttritionAnalysisReport')
    async getAttritionAnalysisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getAttritionAnalysisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBranchAndRmByEmployee')
    async getBranchAndRmByEmployee(@Body('employeeName') employeeName: string): Promise<CommonResponseModel> {
        try {
            const data = await this.service.getBranchAndRmByEmployee(employeeName);
            return data;
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getExpansesMisReport')
    async getExpansesMisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getExpansesMisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getBankAndCashMisReport')
    async getBankAndCashMisReport(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getBankAndCashMisReport(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getOnlyEmployeeType')
    async getOnlyEmployeeType(): Promise<CommonResponseModel> {
        try {
            return await this.service.getOnlyEmployeeType();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/checkEmpIdDuplicates')
    @ApiBody({})
    async checkEmpIdDuplicates(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.checkEmpIdDuplicates(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }
}
