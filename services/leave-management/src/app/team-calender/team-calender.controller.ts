import { TeamCalenderResponse } from '@hrexpert/shared-models';
import { ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ShiftCodeReq } from "./dto/shift-code.request";
import { TeamCalenderDto } from "./dto/team-calender.dto";
import { TeamCalenderRequest } from "./dto/team-calender.request";
import { TeamCalenderService } from "./team-calender.service";

@ApiTags('teamCalender')
@Controller('teamCalender')
export class TeamCalenderController {

    constructor(
        private service: TeamCalenderService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createTeamCalender')
    async createTeamCalender(@Body() DTO: TeamCalenderDto, isUpdate: boolean = false): Promise<TeamCalenderResponse> {
        try {
            return await this.service.createTeamCalender(DTO, false);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }

    @Post('/updateTeamCalender')
    async updateTeamCalender(@Body() DTO: TeamCalenderDto, isUpdate: boolean = false): Promise<TeamCalenderResponse> {
        try {
            return await this.service.createTeamCalender(DTO, true);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }

    @Post('/getAllTeamCalender')
    async getAllTeamCalender(): Promise<TeamCalenderResponse> {
        try {
            return await this.service.getAllTeamCalender();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }

    @Post('/getAllActiveTeamCalender')
    async getAllActiveTeamCalender(): Promise<TeamCalenderResponse> {
        try {
            return await this.service.getAllActiveTeamCalender();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }

    @Post('/getTeamCalenderRecords')
    async getTeamCalenderRecords(@Body() req: ShiftCodeReq): Promise<TeamCalenderResponse> {
        try {
            return await this.service.getTeamCalenderRecords(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }

    @Post('/activateOrDeactivateTeamCalender')
    async activateOrDeactivateTeamCalender(@Body() teamCalenderReq: TeamCalenderRequest): Promise<TeamCalenderResponse> {
        try {
            return await this.service.activateOrDeactivateTeamCalender(teamCalenderReq);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(TeamCalenderResponse, error);
        }
    }
}