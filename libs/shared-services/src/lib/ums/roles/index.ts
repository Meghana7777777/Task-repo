
import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service";
import { CreateRolesDto, GetAllRolesResponse, GetAllAttributesDropDownResponse, RolesIdReqDto, GetAllRolesDropDownResponse, UnitIdDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";


export class RolesService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/roles/' + childUrl;
    };


    async createRoles(dto: CreateRolesDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createRoles'), dto, config);
    };

    async getAllRoles(config?: AxiosRequestConfig): Promise<GetAllRolesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRoles'), config);
    };

    async getAllAttributesDropDown(config?: AxiosRequestConfig): Promise<GetAllAttributesDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllAttributesDropDown'), config);
    };

    async activateOrDeactivate(req: RolesIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivate'), req, config);
    };

    async getRolesDropDown(unitReqId: RolesIdReqDto, config?: AxiosRequestConfig): Promise<GetAllRolesDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRolesDropDown'), unitReqId, config);
    };

    async getAllRolesDropDownByUnitId(unitReqId: UnitIdDto, config?: AxiosRequestConfig): Promise<GetAllRolesDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRolesDropDownByUnitId'), unitReqId, config);
    };

    async getAllRolesByUnitId(unitReqId: UnitIdDto, config?: AxiosRequestConfig): Promise<GetAllRolesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRolesByUnitId'), unitReqId, config)
    }
}

