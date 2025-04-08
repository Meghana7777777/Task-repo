import { CommonResponseModel, ReasonsTypeDto } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class ReasonsTypeService extends MastersCommonAxiosService {
    private ReasonsController = "/reasons-type";

    async createReasonsType(payload: ReasonsTypeDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ReasonsController + "/createReasonsType", payload);
    }

    async getAllReasonsTypes(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ReasonsController + "/getAllReasonsTypes");
    }

    async getActiveReasonsType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ReasonsController + "/getActiveReasonsType");
    }

    async updateReasonsType(dto: ReasonsTypeDto): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.ReasonsController + '/updateReasonsType', dto);
    }

    async activateOrDeactivateReasonsType(payload: ReasonsTypeDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.ReasonsController + "/activateOrDeactivateReasonsType", payload);
    }
}
