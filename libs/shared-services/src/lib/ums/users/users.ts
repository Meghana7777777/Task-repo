
import { AxiosRequestConfig } from "axios";
 import { CommonAxiosService } from "../ums-common-axios-service";
import { UnitIdDto, GetAllUserResponse, UsersIdDto, OrganizationReqDto, RolesIdReqDto, ApplicationIdReqDto } from "@hrexpert/shared-models";
import { UsersCreateDto, UsersTypeResponse, UsersResponse, UsersReqUpdateDto, CommonResponse, LoginUserDto } from "libs/shared-models/src/lib/ums/ums-common";



export class UsersService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/users/' + childUrl;
    };
    async createUser(createDto: UsersCreateDto, config?: AxiosRequestConfig): Promise<UsersTypeResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createUser'), createDto, config);
    };

    async getAllUsers(config?: AxiosRequestConfig): Promise<UsersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllUsers'), config);
    };

    async usersUpdate(req: UsersReqUpdateDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('usersUpdate'), req, config);
    };

    async login(req: LoginUserDto, config?: AxiosRequestConfig): Promise<UsersResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('login'), req, config);
    };

    async getSalt(req: LoginUserDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSalt'), req, config);
    };

    async logOut(req: LoginUserDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('logOut'), req, config);
    };

    async refreshJwtAccessToken(req: LoginUserDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('refreshJwtAccessToken'), req, config);
    };

    async getUserProfile() {

    };

    async getUsersByUnitId(unitIdReq: UnitIdDto, config?: AxiosRequestConfig): Promise<GetAllUserResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersByUnitId'), unitIdReq, config)
    }

    async activateDeactivateUsers(req:UsersIdDto, config?: AxiosRequestConfig): Promise<GetAllUserResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateDeactivateUsers'), req, config)
    }

    async getUsersByOrgId(orgIdReq: OrganizationReqDto, config?: AxiosRequestConfig): Promise<GetAllUserResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersByOrgId'), orgIdReq, config)
    }

    async changePassword(updateDto:any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('changePassword'), updateDto, config)
    }

    async forgotPassword(roleIdReq: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('forgot-password'), roleIdReq, config)
    }
    async resetPassword(roleIdReq: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('reset-password'), roleIdReq, config)
    }
    async getUsersByRoleId(roleIdReq: RolesIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersByRoleId'), roleIdReq, config)
    }
    async getUsersByApplicationId(req: ApplicationIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersByApplicationId'), req, config)
    }
    async getUsersData(req:any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getUsersData'), req, config)
    }
}