
import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "./ums-common-services";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";

export class UMSUnitsService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/units/' + childUrl;
    }

    async getAllUnitsDropDown(config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUnitsDropDown'), config);
    }

}
