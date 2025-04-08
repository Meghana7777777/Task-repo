import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EmpNonRecurringReq, EmpNonRecurringRequest, EmpNonRecurringUpdateReq } from "@hrexpert/shared-models";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollRecordsSharedService extends PMSCommonAxiosService {
    private PayrollRecordsController = "/payroll-records";

    async createEmpNonRecurring(req: EmpNonRecurringReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/createEmpNonRecurring", req);
    }

    async getEmpNonRecurring(req: EmpNonRecurringRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getEmpNonRecurring", req);
    }

    async getPayrollComparisonReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getPayrollComparisonReport", req);
    }

    async getAllPayrollRecords(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getAllPayrollRecords", req);
    }
    async getPayrollRecords(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getPayrollRecords", req);
    }
    async updatePayrollCompRecords(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/updatePayrollCompRecords", req);
    }

    async saveEmployeeNonRecComponent(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/saveEmployeeNonRecComponent", req);
    }

    async updateEmpNonRecurring(req: EmpNonRecurringUpdateReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/updateEmpNonRecurring", req);
    }

    async generateEmpPayrollRecords(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/generateEmpPayrollRecords");
    }

    async generateEmpPayrollRecordsByEmpId(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/generateEmpPayrollRecordsByEmpId", req);
    }
    async getAllPayrollComponentsData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getAllPayrollComponentsData");
    }

    async getAllPayrollRecordsData(req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getAllPayrollRecordsData",req);
    }

    async updateAutomaticallyValue(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/updateAutomaticallyValue");
    }

    async getTermLogs(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/getTermLogs", req);
    }
    
    async updatePayrollRecordsFromEmployee(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/updatePayrollRecordsFromEmployee", req);
    }

    async generateEmpPayrollRecordsForBranch(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollRecordsController + "/generateEmpPayrollRecordsForBranch", req);
    }
}
