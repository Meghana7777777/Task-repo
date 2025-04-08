import { AxiosRequestConfig } from "axios";
import { CommonAxiosService } from "../ums-common-axios-service";
import { UserRoleCreateDto, CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";


export class UserRolesService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) { 
        return '/user-roles/' + childUrl;
    };
    async createUserRoles(createDto: UserRoleCreateDto, config?: AxiosRequestConfig): Promise<CommonResponse> { 
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createUserRoles'), createDto, config);
    };
}