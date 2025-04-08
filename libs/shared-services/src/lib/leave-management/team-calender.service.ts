import { ShiftCodeReq, TeamCalenderDto, TeamCalenderResponse } from "@hrexpert/shared-models";
import { LMSCommonAxiosService } from "./common-axios-service-lms";

export class TeamCalenderService extends LMSCommonAxiosService {


    private url = '/teamCalender';

    async createTeamCalender(teamCalenderDto: TeamCalenderDto): Promise<TeamCalenderResponse> {
        console.log(teamCalenderDto);

        return this.axiosPostCall(this.url + '/createTeamCalender', teamCalenderDto)
           
    }

    async getAllTeamCalender(): Promise<TeamCalenderResponse> {

        return this.axiosPostCall(this.url + '/getAllTeamCalender')
           
    }

    async getTeamCalenderRecords(req: ShiftCodeReq): Promise<TeamCalenderResponse> {
        return this.axiosPostCall(this.url + '/getTeamCalenderRecords', req)
           
    }

    async updateTeamCalender(teamCalenderDto: TeamCalenderDto): Promise<TeamCalenderResponse> {
        return this.axiosPostCall(this.url + '/updateTeamCalender', teamCalenderDto)
           
    }

    async activateOrDeactivateTeamCalender(teamCalenderDto: TeamCalenderDto): Promise<TeamCalenderResponse> {
        return this.axiosPostCall(this.url + '/activateOrDeactivateTeamCalender', teamCalenderDto)
            
    }
}