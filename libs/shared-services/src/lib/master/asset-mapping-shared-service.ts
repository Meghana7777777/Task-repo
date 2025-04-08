import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class AssetSharedService extends MastersCommonAxiosService {
    private AssetController = "/asset";

    async createAsset(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AssetController + "/createAsset", req);
    }

    async getAssets(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AssetController + "/getAssets");
    }

    async deactivateAsset(assetId: number): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.AssetController + "/deactivateAsset", { assetId });
    }

    async updateAsset(assetId: number, req: any): Promise<any> {
        return this.axiosPostCall(this.AssetController + "/updateAsset", { assetId, ...req });
    }
}
