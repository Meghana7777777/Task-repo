import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";
import { EmailRequest } from "@hrexpert/shared-models";

export class EmailSendingService extends PMSCommonAxiosService {
    private EmailController = "/email";

    async sendEmail(req: EmailRequest): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.EmailController + "/send", req);
    }

}
