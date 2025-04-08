import { HolidayReqForGenerateSwipe, HolidayResponseModel } from "@hrexpert/shared-models";
import { CommonResponseModel } from "../../../../backend-utils/src/lib/exception-handling/global-response-object";
import { LMSCommonAxiosService } from "./common-axios-service-lms";

export class HolidayCalanderService extends LMSCommonAxiosService {
    private HolidayCalendarController = "/holidays";

    async createHoliday(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/createHoliday", payload);
    }

    async getAllHolidays(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/getAllHolidays");
    }

    async getActiveHolidays(req:any): Promise<HolidayResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/getActiveHolidays",req);
    }
    
    async getActiveWeekOffAndHolidays(req:HolidayReqForGenerateSwipe): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/getActiveWeekOffAndHolidays",req);
    }

    async updateHoliday(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.HolidayCalendarController + '/updateHoliday', dto);
    }

    async activateOrDeactivateHoliday(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/activateOrDeactivateHoliday", payload);
    }

    async getHolidaysDateData(payload?: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.HolidayCalendarController + "/getHolidaysDateData", payload);
    }
}
