import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service";
import { OrganizationCreateDto, GetAllOrganizationResponse, OrganizationReqDto, DropdownOrganizationResponse } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";


export class OrganizationService extends CommonAxiosService {


    private getURLwithMainEndPoint(childUrl: string) {
        return '/organization/' + childUrl;
    }

    async createOrganization(createDto: OrganizationCreateDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createOrganization'), createDto, config);
    }

    async getAllOrganizations(config?: AxiosRequestConfig): Promise<GetAllOrganizationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOrganizations'), config);
    }

    async activateOrDeactivateOrganization(req: OrganizationReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateOrganization'), req, config);
    }

    async getAllOrganizationsDropdown(config?: AxiosRequestConfig): Promise<DropdownOrganizationResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllOrganizationsDropdown'), config);
    }
}