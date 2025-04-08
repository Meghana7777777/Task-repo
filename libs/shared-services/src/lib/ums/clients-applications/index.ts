
import { ClientAppsDto, ApplicationIdReqDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";
import { CommonAxiosService } from "../ums-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class ClentAppsService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/client-apps/' + childUrl;
    }

    async mapOrUnMapAppsToClient(createDto: ClientAppsDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapOrUnMapAppsToClient'), createDto, config);
    }
    async getAllAppsByApplicationId(req:ApplicationIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllAppsByApplicationId'), req, config);
    };
}