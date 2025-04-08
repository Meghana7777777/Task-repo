
import { SubMenuDto, GetAllSubMenusResponse, AppModuleMenuIdReqDto, SubMenusDropDownResponse, SubMenuIdReqDto } from "@hrexpert/shared-models";
import { CommonResponse } from "libs/shared-models/src/lib/ums/ums-common";
import { CommonAxiosService } from "../ums-common-axios-service";
import { AxiosRequestConfig } from "axios";

export class SubMenuService extends CommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/subMenus/' + childUrl;
    }

    async create(createDto: SubMenuDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createSubmenu'), createDto, config);
    }

    async getAllSubMenus(config?: AxiosRequestConfig): Promise<GetAllSubMenusResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSubMenus'), config)
    }

    async getAllSubMenusByMenuModuleAndAppId(req: AppModuleMenuIdReqDto, config?: AxiosRequestConfig): Promise<GetAllSubMenusResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSubMenusByMenuModuleAndAppId'), req, config)
    }

    async getAllSubMenusDropDownByMenuModuleAndAppId(appIdReq: AppModuleMenuIdReqDto, config?: AxiosRequestConfig): Promise<SubMenusDropDownResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getAllSubMenusDropDownByMenuModuleAndAppId'), appIdReq, config)
    }

    async activateOrDeactivateSubMenu(deactivateDto: SubMenuIdReqDto, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('activateOrDeactivateSubMenu'), deactivateDto, config)
    }
}