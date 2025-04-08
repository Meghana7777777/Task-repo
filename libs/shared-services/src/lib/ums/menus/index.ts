
import { MenusDto, GetAllMenusResponse, AppModuleIdReqDto, MenusDropDownResponse, MenuIdReqDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";
import { CommonAxiosService } from "../ums-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class MenuService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/menus/' + childUrl;
    }

    async create(createDto: MenusDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createMenu'), createDto, config);
    }

    async getAllMenus(config?: AxiosRequestConfig): Promise<GetAllMenusResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMenus'), config)
    }

    async getAllMenusByModuleAndAppId(req: AppModuleIdReqDto, config?: AxiosRequestConfig): Promise<GetAllMenusResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMenusByModuleAndAppId'), req, config)
    }

    async getAllMenusDropDownByModuleAndAppId(appIdReq: AppModuleIdReqDto, config?: AxiosRequestConfig): Promise<MenusDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllMenusDropDownByModuleAndAppId'), appIdReq, config)
    }

    async activateOrDeactivateMenu(deactivateDto: MenuIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateMenu'), deactivateDto, config)
    }
}