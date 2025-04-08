
import { ActivatePermissionDto, AppModuleMenuIdReqDto, AppModuleSubMenuIdReqDto, DropdownPermissionResponse, GetAllPermissionResponse, PermissionsDto } from "@hrexpert/shared-models";
import { CommonAxiosService } from "../ums-common-axios-service";
import { AxiosRequestConfig } from "axios";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";

export class PermissionService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/permissions/' + childUrl;
    }

    async create(createDto: PermissionsDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createPerm'), createDto, config);
    }

    async getAllPermsBySubMenuModuleAndAppId(req: AppModuleSubMenuIdReqDto, config?: AxiosRequestConfig): Promise<GetAllPermissionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllPermsBySubMenuModuleAndAppId'), req, config)
    }

    async getAllPermsDropDownByMenuModuleAndAppId(appIdReq: AppModuleMenuIdReqDto, config?: AxiosRequestConfig): Promise<DropdownPermissionResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSubMenusDropDownByMenuModuleAndAppId'), appIdReq, config)
    }

    async activateOrDeactivatePermission(deactivateDto: ActivatePermissionDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivatePermission'), deactivateDto, config)
    }
}