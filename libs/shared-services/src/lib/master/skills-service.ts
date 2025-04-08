import { CommonResponseModel } from "@hrexpert/backend-utils";
import { MastersCommonAxiosService } from "./common-axios-service-ems";


export class SkillsSharedService extends MastersCommonAxiosService {
    private SkillsController = "/skills";

    async createSkills(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.SkillsController + "/createSkills", payload);
    } 

    async getSkills(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.SkillsController + "/getSkills");
    }

    async getActiveSkills(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.SkillsController + "/getActiveSkills");
    }

    async updateSkills(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.SkillsController + '/updateSkills', dto);
    }

    async activateOrDeactivateSkills(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.SkillsController + "/activateOrDeactivateSkills", payload);
    }

}
