import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service";
import { UnitCreateDto, GetAllUnitsResponse, UnitIdDto, GetAllUnitsDropDownResponse, OrganizationReqDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";


export class UnitsService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/units/' + childUrl;
    }

    async createUnit(createDto: UnitCreateDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createUnit'), createDto, config);
    }
    async getAllUnits(config?: AxiosRequestConfig): Promise<GetAllUnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllunits'), config);
    }

    async activateAndDeactivatedUnit(req: UnitIdDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateUnits'), req, config);
    }

    async getAllUnitsDropDown(req: UnitIdDto, config?: AxiosRequestConfig): Promise<GetAllUnitsDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUnitsDropDown'), req, config);
    }

    async getUnitsByOrgId(req: OrganizationReqDto, config?: AxiosRequestConfig): Promise<GetAllUnitsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUnitsByOrgId'), req, config);
    }



}