import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class ComponentNamesSharedService extends PMSCommonAxiosService {
    private componentNamesService = "/component-names";

    async createComponentNames(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.componentNamesService + "/createComponentNames", req);
    }

    async updateComponentNames(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.componentNamesService + "/updateComponentNames", req);
    }

    async getComponentsNames(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.componentNamesService + "/getComponentsNames");
    }

    async getActiveComponentsNames(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.componentNamesService + "/getActiveComponentsNames");
    }

    async activateOrDeactivateComponentsNames(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.componentNamesService + "/activateOrDeactivateComponentsNames", payload);
    }

}
