
import { CommonResponseModel, MeetingRoomIdReq, RoomBookingDto } from '@hrexpert/shared-models';
import { LMSCommonAxiosService } from '../common-axios-service-lms';

export class TrainingCenterSharedService extends LMSCommonAxiosService {
    private TrainingCenterController = "/training-center-controller";

    async createMeetingRoom(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/createMeetingRoom", payload);
    }

    async getAllMeetingRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getAllMeetingRooms");
    }

    async getActiveMeetingRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getActiveMeetingRooms");
    }

    async updateMeetingRoom(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.TrainingCenterController + '/updateMeetingRoom', dto);
    }

    async activateOrDeactivateMeetingRoom(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/activateOrDeactivateMeetingRoom", payload);
    }

    async getMeetingSchedules(req?: MeetingRoomIdReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getMeetingSchedules", req);
    }

    async bookMeetingRoom(dto: RoomBookingDto): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.TrainingCenterController + '/bookMeetingRoom', dto);
    }

    async getAvailableRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getAvailableRooms");
    }

    async imageUpload(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + '/imageUpload', formData)
    }

    async updateScheduleStatus(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.TrainingCenterController + '/updateScheduleStatus', dto);
    }

    async getScheduleDataByDate(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getScheduleDataByDate", dto);
    }

    async getTodayAvailabilitySlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getTodayAvailabilitySlots", dto);
    }

    async validateTimeSlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/validateTimeSlots", dto);
    }

    async getTodayAvailabilitySlotsT(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getTodayAvailabilitySlotsT", dto);
    }

    async getScheduleDataWithDate(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getScheduleDataWithDate", dto);
    }

    async getRoomSlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.TrainingCenterController + "/getRoomSlots", dto);
    }
}
