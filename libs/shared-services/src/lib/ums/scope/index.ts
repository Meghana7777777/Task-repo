import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service"; 
import { ScopesCreateDto, GetAllScopesResponse, ScopesIdDto, GetAllScopesDropDownResponse } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";


export class ScopesService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/scopes/' + childUrl;
    }

    async createScope(createDto: ScopesCreateDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createScope'), createDto, config);
    }
    async getAllScopes(config?: AxiosRequestConfig): Promise<GetAllScopesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllScopes'), config);
    }

    async activateAndDeactivatedScope(req: ScopesIdDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateAndDeactivatedScope'), req, config);
    }

    async getAllScopesDropDown(config?: AxiosRequestConfig): Promise<GetAllScopesDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllScopesDropDown'), config);
    }



}