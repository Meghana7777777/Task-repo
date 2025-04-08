import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";
import { empLoanSalaryIdDto, EmpLoanSalarySharedIdDto } from "@hrexpert/shared-models";


export class EmpLoanSalarySharedService extends PMSCommonAxiosService {
    private EmpLoanSalaryController = "/employee-loans";

    async createEmployeeLoanSalary(req:any): Promise<CommonResponseModel> {
        console.log(req,"+++++++++++____________+++++++++++")
        return this.axiosPostCall(this.EmpLoanSalaryController + "/createEmployeeLoanSalary", req)
    }

    async getEmpLoanSalary(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/getEmpLoanSalary",  req)
    }
    async getPreviousLoans(emp : empLoanSalaryIdDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/getPreviousLoans",emp)
    }

    async getLoansData(emp : empLoanSalaryIdDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/getLoansData",emp)
    }

    async updateEmpLoanSalary(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/updateEmpLoanSalary",req);
    }

    async getEmpLoanSalaryById( req:EmpLoanSalarySharedIdDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/getEmpLoanSalaryById",req);
    }

    async approveRejectLoan(req: { id: number, remarks: string, req: string, componentId: number}): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmpLoanSalaryController + "/approveRejectLoan", req);
    }

}
