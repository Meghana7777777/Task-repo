
import { CommonResponseModel, MeetingRoomIdReq, RoomBookingDto } from '@hrexpert/shared-models';
import { LMSCommonAxiosService } from '../common-axios-service-lms';

export class MettingRoomService extends LMSCommonAxiosService {
    private MeetingRoomController = "/meeting-room-controller";

    async createMeetingRoom(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/createMeetingRoom", payload);
    }

    async getAllMeetingRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getAllMeetingRooms");
    }

    async getActiveMeetingRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getActiveMeetingRooms");
    }

    async updateMeetingRoom(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.MeetingRoomController + '/updateMeetingRoom', dto);
    }

    async activateOrDeactivateMeetingRoom(payload: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/activateOrDeactivateMeetingRoom", payload);
    }

    async getMeetingSchedules(req?: MeetingRoomIdReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getMeetingSchedules", req);
    }

    async bookMeetingRoom(dto: RoomBookingDto): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.MeetingRoomController + '/bookMeetingRoom', dto);
    }

    async getAvailableRooms(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getAvailableRooms");
    }

    async imageUpload(formData: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + '/imageUpload', formData)
    }

    async updateScheduleStatus(dto: any): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.MeetingRoomController + '/updateScheduleStatus', dto);
    }

    async getScheduleDataByDate(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getScheduleDataByDate", dto);
    }

    async getTodayAvailabilitySlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getTodayAvailabilitySlots", dto);
    }

    async validateTimeSlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/validateTimeSlots", dto);
    }

    async getTodayAvailabilitySlotsT(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getTodayAvailabilitySlotsT", dto);
    }

    async getScheduleDataWithDate(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getScheduleDataWithDate", dto);
    }

    async getRoomSlots(dto: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.MeetingRoomController + "/getRoomSlots", dto);
    }
}
