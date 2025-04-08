import { AxiosRequestConfig } from "axios"; 
import { CommonAxiosService } from "../ums-common-axios-service";
import { UserRoleDto, UsersIdDto, UserRolesResponse } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";



export class UserRoleMappingService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/user-roles/' + childUrl;
    };
    async mapOrUnMapRolesToUser(createDto: UserRoleDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('mapOrUnMapRolesToUser'), createDto, config);
    };

    async getAllRolesByUserId(req: UsersIdDto, config?: AxiosRequestConfig): Promise<UserRolesResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllRolesByUserId'), req, config);
    };

}