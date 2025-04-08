
import { ActiveEmployeesForAttendanceResponseModel, ApplyLeaveBrachDto, BankPaySharedDto, BranchesReqDto, BranchReq, CommonResponseModel, DashboardReq, DropdownResponseModel, EmpDataReq, EmployeeBulkRequest, EmployeeCodeReq, EmployeeDetailsDto, EmployeeDocDto, EmployeeFormResponseModel, EmployeeShiftUpdateReq, EmployeeViewResponseModel, EmployeIdReq, EmpResignationProofsDto, lateMinReq, PrefixConfigurationDto } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";
import { EmployeeFilterReq } from "./employee-filter-req";


export class EmployeeOnboardingService extends EMSCommonAxiosService {
    private employeeOnBoardingController = "/employee-onboarding";

    async getAllEmployees(req: EmployeeFilterReq, isExcel?: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployees", req, isExcel);
    }

    async updateReportingManager(req: any): Promise<EmployeeViewResponseModel> {
        console.log(req, "reqqqqqqqqq")
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateReportingManager", req);
    }

    async getReportManagaerWithEmployeess(req?: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getReportManagaerWithEmployeess");
    }
   
    async getAllReportingManagerAndCode(req?: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllReportingManagerAndCode");
    }
  
    async getAllRMData(req?: any): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllRMData");
    }

    async getAllEmployeesTableFroms(req: any): Promise<EmployeeFormResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeesTableFroms", req);
    }

    async getAllEmployeesPersonalImformationManagement(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeesPersonalImformationManagement", req);
    }

    async getAllEmployeesTable(): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeesTable");
    }
    async getActiveEmployeeList(req?: any): Promise<ActiveEmployeesForAttendanceResponseModel> { 
        return this.axiosPostCall(this.employeeOnBoardingController + "/getActiveEmployeeList", req);
    }
    async getInActiveEmployeeList(req?: DashboardReq): Promise<ActiveEmployeesForAttendanceResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getInActiveEmployeeList", req);
    }
    async getAllActiveEmpForAttendance(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllActiveEmpForAttendance", req);
    }
    async getAllActiveEmpForAttendances(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllActiveEmpForAttendances");
    }
    async getAllEmpAginstDepartment(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmpAginstDepartment");
    }
    async activateAndDeactiveEmployees(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/activateAndDeactiveEmployees", req);
    }
    async getAllEmployeeData(): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeeData");
    }
    async getAllEmployeeNameAndCodeAgainstEmpId(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeeNameAndCodeAgainstEmpId");
    }


    async referenceBasedEmployeeData(req: ApplyLeaveBrachDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/referenceBasedEmployeeData", req);
    }

    async getActiveEmployeeDropdownData(): Promise<DropdownResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getActiveEmployeeDropdownData");
    }

    async updateEmployeeReportingManager(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateEmployeeReportingManager", req)
    }

    async getEmployeeWithReportingManager(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getEmployeeWithReportingManager")
    }

    async createEmployee(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/createEmployee", payload);
    }

    async updateEmployee(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateEmployee", payload);
    }

    async getAllEmployeesForShiftMap(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeesForShiftMap", req)
    }

    async getBranchesInEmpDetails(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getBranchesInEmpDetails")
    }

    async getDivisionsInEmpDetails(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getDivisionsInEmpDetails")
    }

    async getDepartmentsInEmpDetails(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getDepartmentsInEmpDetails")
    }
    async updateEmpLogsByShiftCode(req: EmployeeShiftUpdateReq): Promise<CommonResponseModel> {
        console.log(req, 'rrrr')
        return this.axiosPostCall(this.employeeOnBoardingController + '/updateEmpLogsByShiftCode', req)
    }
    async getEmpById(req: EmployeIdReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpById', req)
    }

    async getBankPaymentReport(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getBankPaymentReport")
    }

    async getBankPaymentChildReport(req: BankPaySharedDto): Promise<CommonResponseModel> {
        console.log(req, '--------uuuuuu')
        return this.axiosPostCall(this.employeeOnBoardingController + "/getBankPaymentChildReport", req)
    }

    async employeeWhastappApi(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/employeeWhastappApi", req)
    }
    async saveEmployeePrefixConfigurations(req: PrefixConfigurationDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/saveEmployeePrefixConfigurations", req)
    }

    async getPrefixConfigForEmpType(employeeTypeId: string): Promise<CommonResponseModel> {
        return this.axiosGetCall(this.employeeOnBoardingController + `/getPrefixConfigForEmpType/${employeeTypeId}`)
    }

    async getHeadCount(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getHeadCount`, req)
    }
    async getEmpCodeByDetails(req: EmployeeCodeReq): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpCodeByDetails', req)
    }
    async getEmpDetailsByBranch(req?: BranchReq): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpDetailsByBranch', req)
    }

    async getBranchAgaintEmployess(req: BranchesReqDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getBranchAgaintEmployess`, req)
    }

    async attendanceWhatsappAlertCountEmployee(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/attendanceWhatsappAlertCountEmployee`)
    }

    async getConfigurations(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getConfigurations`, req)
    }

    async saveOrUpdateConfigurations(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/saveOrUpdateConfigurations`, req)
    }

    async employeeImageUpload(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/employeeImageUpload', formData)
    }

    async employeeDocumentUpload(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/employeeDocumentUpload', formData)
    }

    async getAllEmployeeApprovalData(): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getAllEmployeeApprovalData',)
    }

    async getUpdateEmployeeApprovalData(req: EmployeeDetailsDto): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getUpdateEmployeeApprovalData', req)
    }

    async getUpdateEmployeeRejectData(req: EmployeeDetailsDto): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getUpdateEmployeeRejectData', req)
    }

    async getAllEmpBelowAgeWorkingData(): Promise<CommonResponseModel> {

        return this.axiosPostCall(this.employeeOnBoardingController + '/getAllEmpBelowAgeWorkingData',)
    }


    async getEmpTenureByGender(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getEmpTenureByGender`, req)
    }

    async getEmpGenderAge(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getEmpGenderAge`, req)
    }

    async getEmployeeDocuments(req: EmployeeDocDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + `/getEmployeeDocuments`, req)
    }


    async getAllWeekEmployees(req: EmployeeFilterReq): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllWeekEmployees", req);
    }

    async getDOBofEmp(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getDOBofEmp", req);
    }

    async sendBirthdayMessages(req: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/sendBirthdayMessages", req);
    }
    async getAllEmpForRec(req: EmployeeFilterReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmpForRec", req);
    }

    async getAllEmployeesData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeesData", req);
    }

    async getAllReportManagerData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllReportManagerData", req);
    }

    async getAllEmpData(): Promise<EmployeeViewResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmpData");
    }

    async getDepartmentByBranchId(req?: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getDepartmentByBranchId", req);
    }

    async getDivisionByBranchId(req?: DashboardReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getDivisionByBranchId", req);
    }

    async getAllEmployeeNameAndCodeAgainstEmpIds(req: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getAllEmployeeNameAndCodeAgainstEmpIds", req);
    }

    async updateDeactiveEmployee(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateDeactiveEmployee", req);
    }

    async checkAadharPanDuplicates(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/checkAadharPanDuplicates", req);
    }

    async getEmpDataForLeaves(req?: EmpDataReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getEmpDataForLeaves", req);
    }

    async bulkEmpActiveInactive(req: EmployeeBulkRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/bulkEmpActiveInactive", req);
    }

    async checkPfEsiDuplicates(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/checkPfEsiDuplicates", req);
    }

    async updateLeaveAllotted(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateLeaveAllotted", req);
    }

    async updateSalaryForEmployee(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updateSalaryForEmployee", req);
    }

    async handleEmpCodeDuplicate(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/handleEmpCodeDuplicate", req);
    }

    async getRequestedEmpData(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getRequestedEmpData", req);
    }

    async getEmpByCode(req: EmployeeCodeReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpByCode', req)
    }

    async getEmpDataForLateMinCal(req?: lateMinReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpDataForLateMinCal', req)
    }

    async empResignationProofs(req: EmpResignationProofsDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/empResignationProofs", req);
    }
    async updatePath(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/updatePath", req);
    }
    async getEmpResignationProofs(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getEmpResignationProofs", req);
    }

    async employeeExperienceDocumentUpload(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/employeeExperienceDocumentUpload', formData)
    }


    async getEmpDataForPfAndEsi(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpDataForPfAndEsi', req)
    }


    async getEmpDetailsReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpDetailsReport', req)
    }

    async getEmpHistoryDetials(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmpHistoryDetials', req)
    }

    async updateLastLeave(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/updateLastLeave', req)
    }

    async updateLastAttnStatus(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/updateLastAttnStatus', req)
    }

    async getBranchWiseEmpStatusReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchWiseEmpStatusReport', req)
    }

    async getBranchWiseWorkerStatusReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchWiseWorkerStatusReport', req)
    }

    async getBranchEmployeeWiseMisReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchEmployeeWiseMisReport', req)
    }

    async getBranchWorkerWiseMisReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchWorkerWiseMisReport', req)
    }

    async getBranchWisePayrollCount(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchWisePayrollCount', req)
    }

    async getBranchWiseAttritionCount(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchWiseAttritionCount', req)
    }

    async getMonthlyAttendanceMisReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getMonthlyAttendanceMisReport', req)
    }

    async getDeptWiseEmpStrengthForHr(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getDeptWiseEmpStrengthForHr')
    }

    async getDeptWiseWorkerStrengthForHr(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getDeptWiseWorkerStrengthForHr')
    }

    async getEnrollmentReport(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEnrollmentReport', req)
    }

    async getMonthSalariesSummaryReport(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getMonthSalariesSummaryReport', req)
    }

    async getAttritionAnalysisReport(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getAttritionAnalysisReport', req)
    }
    async getEmployeeNamesList(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getEmployeeNamesList')
    }

    async getBranchNamesList(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchNamesList')
    }

    async getBranchAndRmByEmployee(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBranchAndRmByEmployee', req)
    }

    async getExpansesMisReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getExpansesMisReport', req)
    }

    async getBankAndCashMisReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + '/getBankAndCashMisReport', req)
    }

    async getOnlyEmployeeType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/getOnlyEmployeeType");
    }

    async checkEmpIdDuplicates(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.employeeOnBoardingController + "/checkEmpIdDuplicates", req);
    }
}