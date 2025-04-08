
import { CreateAttributeDto, GetAllAttributesResponse, GetAllAttributesDropDownResponse, AttributeIdReqDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";
import { CommonAxiosService } from "../ums-common-axios-service";
import { AxiosRequestConfig } from "axios";


export class AttributeService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/attributes/' + childUrl;
    };


    async createAttribute(dto: CreateAttributeDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createAttribute'), dto, config);
    };

    async getAllAttributes(config?: AxiosRequestConfig): Promise<GetAllAttributesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllAttributes'), config);
    };

    async getAllAttributesDropDown(config?: AxiosRequestConfig): Promise<GetAllAttributesDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllAttributesDropDown'), config);
    };

    async activateAndDeactivatedAttributes(req: AttributeIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateAndDeactivatedAttributes'), req, config);
    };

    async GetAllAttributesDropDownResponse(config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('GetAllAttributesDropDownResponse'), config);
    };
}

