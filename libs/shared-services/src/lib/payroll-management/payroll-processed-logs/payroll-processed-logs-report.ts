import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class PayrollProcessedLogsService extends PMSCommonAxiosService {
    private PayrollProcessedLogController = "/payroll-processed-log";

    async getPayrollProcessedLog(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollProcessedLog", req)
    }

    async getPayrollMonth(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollMonth", req)
    }

    async getPayrollDataById(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollDataById", req)
    }

    async pdfUploadTemp(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + '/pdfUploadTemp', formData)
    }

    async getPayrollHeadCountReportData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + '/getPayrollHeadCountReportData', req)
    }

    async getBankRecompilationData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + '/getBankRecompilationData', req)
    }

    async getCashRecompilationData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + '/getCashRecompilationData', req)
    }

    async getEmployeesData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + '/getEmployeesData', req)
    };

    async getPayrollProcessedLogForHodApproval(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollProcessedLogForHodApproval", req)
    }

    async updatePayrollHoldAndReleaseStatus(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/updatePayrollHoldAndReleaseStatus", req)
    }

    async getAllPayrollHeadWiseReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getAllPayrollHeadWiseReport", req)
    }

    async getPayrollMisReportEmployee(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollMisReportEmployee", req)
    }

    async getPayrollMisReportWorker(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollMisReportWorker", req)
    }
    
    async getPayrollEsiReport(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.PayrollProcessedLogController + "/getPayrollEsiReport", req)
    }
}
