import { CommonResponseModel } from "@hrexpert/shared-models";
import { MastersCommonAxiosService } from "./common-axios-service-ems";

export class DocumentTypeSharedService extends MastersCommonAxiosService {
    private DocumentTypeController = "/document-type";

    async createDocumentType(req: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DocumentTypeController + "/createDocumentType", req);
    }

    async getDocumentType(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DocumentTypeController + "/getDocumentType");
    }

    async deactivateDocumentType(documentTypeId: number): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DocumentTypeController + "/deactivateDocumentType", { documentTypeId });
    }

    async updateDocumentType(documentTypeId: number, req: any): Promise<any> {
        return this.axiosPostCall(this.DocumentTypeController + "/updateDocumentType", { documentTypeId, ...req });
    }

    async getDocumentTypesByDomain(domain: string): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DocumentTypeController + "/getDocumentTypesByDomain", { domain });
    }

}
