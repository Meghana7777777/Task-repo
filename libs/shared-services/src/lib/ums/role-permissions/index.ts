
import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service";
import { RolePermDto, RolesIdReqDto, GetAllRolePermissionsResponse } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";

export class RolePermissionsService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/role-permissions/' + childUrl;
    }

    async mapOrUnMapRolePermissions(rolePermDto: RolePermDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapOrUnMapRolePermissions'), rolePermDto, config)
    }

    async getRolePermissionByRoleId(req: RolesIdReqDto, config?: AxiosRequestConfig): Promise<GetAllRolePermissionsResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getRolePermissionByRoleId'), req, config)
    }
}