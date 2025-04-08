import { CommonResponseModel } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class TourIntimationService extends EMSCommonAxiosService {
    private tourIntimationController = "/tour-intimation";

    async createtourIntimation(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/createtourIntimation", req);
    }

    async gettourIntimation(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/gettourIntimation", req);
    }

    async gettourEmployeeData(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/gettourEmployeeData", req);
    }

    async approveReject(req: { id: number, remarks: string, req: string, permissionAmount: number }): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/approveReject", req);
    }

    async tourPdfUploadTemp(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + '/tourPdfUploadTemp', formData)
    }

    async createtourClaim(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/createtourClaim", req);
    }

    async gettourClaim(req?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/gettourClaim", req);
    }

    async TourClaimApprove(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/TourClaimApprove", req);
    }

    async TourClaimReject(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.tourIntimationController + "/TourClaimReject", req);
    }
}