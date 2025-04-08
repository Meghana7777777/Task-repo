import { CommonResponseModel, IdProofDto } from "@hrexpert/shared-models";
import { EMSCommonAxiosService } from "../common-axios-service-ems";

export class IdProofService extends EMSCommonAxiosService {
    private controller = "/id-proof";

    async createIdProof(payload: IdProofDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.controller + "/createIdProof", payload);
    }

    async getAllIdProofs(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.controller + "/getAllIdProofs");
    }

    async getActiveIdProofs(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.controller + "/getActiveIdProofs");
    }

    async updateIdProof(dto: IdProofDto): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.controller + '/updateIdProof', dto);
    }

    async activateOrDeactivateIdProof(payload: IdProofDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.controller + "/activateOrDeactivateIdProof", payload);
    }
}
