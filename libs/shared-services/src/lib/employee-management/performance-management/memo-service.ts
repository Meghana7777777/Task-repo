import { CommonResponseModel } from "@hrexpert/backend-utils";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class MemoSharedService extends EMSCommonAxiosService {
    private MemoController = "/memo";

    async createMemo(payload: any): Promise<CommonResponseModel> {
        console.log(payload,"PPPPP")
        return this.axiosPostCall(this.MemoController + "/createMemo", payload);
    }

    async getAllMemo(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MemoController + "/getAllMemo");
    }

    async getActiveMemo(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MemoController + "/getActiveMemo");
    }

    async updateMemo(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.MemoController + '/updateMemo', dto);
    }

    async activateOrDeactivateMemo(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MemoController + "/activateOrDeactivateMemo", payload);
    }

}
