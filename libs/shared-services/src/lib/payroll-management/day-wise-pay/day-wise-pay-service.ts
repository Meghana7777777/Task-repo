import { CommonResponseModel } from "@hrexpert/backend-utils";
import { PMSCommonAxiosService } from "../common-axios-service-pms";


export class DayWisePaySharedService extends PMSCommonAxiosService {
    private DayWisePayController = "/day-wise-pay";

    async saveDayWisePayExcel(req:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DayWisePayController + "/saveDayWisePayExcel",req);
    }

    async getDayWiseData(req?:any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.DayWisePayController + "/getDayWiseData",req);
    }
}
 