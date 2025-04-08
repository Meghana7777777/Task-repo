import { TeamCalenderResponse } from '@hrexpert/shared-models';
import { Injectable } from "@nestjs/common";
import { TeamCalenderDto } from "./dto/team-calender.dto";
import { TeamCalenderRequest } from "./dto/team-calender.request";
import { TeamCalender } from "./entity/team-calender.entity";
import { TeamCalenderAdapter } from "./team-calender.adapter";
import { TeamCalenderRepository } from "./repository/team-calender.repository";
import { ShiftCodeReq } from "./dto/shift-code.request";
import moment from "moment";
import { CommonResponseModel } from "@hrexpert/shared-models";

@Injectable()
export class TeamCalenderService {

    constructor(
        private teamCalenderRepository: TeamCalenderRepository,
        private teamCalenderAdapter: TeamCalenderAdapter,
    ) { }

    async getTeamCalenderWithoutRelations(id: number): Promise<TeamCalender> {
        const teamCalenderResponse = await this.teamCalenderRepository.findOne({
            where: { id: id },
        });
        if (teamCalenderResponse) {
            return teamCalenderResponse;
        } else {
            return null;
        }
    }

    async getTeamCalenderDateBetween(shiftCode: string, fromDate: Date, toDate: Date): Promise<CommonResponseModel> {
        const teamCalenderResponse = await this.teamCalenderRepository.find({
            where: { shiftCode: shiftCode }, select: ['fromDate', 'toDate']
        });
        for (const record of teamCalenderResponse) {
            const checkFrmData = moment(fromDate).isBetween(record.fromDate, record.toDate)
            if (checkFrmData) return new CommonResponseModel(false, 1111, 'Selected dates already assigned for this shift group code');
            const checkToDate = moment(toDate).isBetween(record.fromDate, record.toDate);
            if (checkToDate) return new CommonResponseModel(false, 1111, 'Selected dates already assigned for this shift group code')
        }
        return new CommonResponseModel(true, 11111, 'Validated')

    }

    async createTeamCalender(teamCalenderDTO: TeamCalenderDto, isUpdate: boolean): Promise<TeamCalenderResponse> {
        console.log(teamCalenderDTO,'teamCalenderDTO')
        try {
            if (!isUpdate) {
                // console.log(teamCalenderDTO.id,'AAAAAAAAAAA')
                const teamCalenderEntity = await this.getTeamCalenderWithoutRelations(teamCalenderDTO.id);
                // console.log(teamCalenderEntity,'BBBBBBBBBBBBB')
                if (teamCalenderEntity) {
                    throw new TeamCalenderResponse(false,11104, 'Team Calender already exists');
                }
            }
            if (!isUpdate) {
                // console.log(teamCalenderDTO.id,'CCCCCCCCC')
                const teamCalenderEntity = await this.getTeamCalenderDateBetween(teamCalenderDTO.shiftCode, teamCalenderDTO.fromDate, teamCalenderDTO.toDate)
                if (!teamCalenderEntity.status) {
                    return new TeamCalenderResponse(false, 11111, teamCalenderEntity.internalMessage);
                }
            }
            else {
                // console.log(teamCalenderDTO.id,'DDDDDDDDD')
                const teamCalenderEntity = await this.getTeamCalenderWithoutRelations(teamCalenderDTO.id);
                console.log(teamCalenderEntity,'teamCalenderEntity')
                if (teamCalenderEntity) {
                    if (teamCalenderEntity.id != teamCalenderDTO.id) {
                        throw new TeamCalenderResponse(false,11104, 'Team Calender already exists')
                    }
                }
            }
            const convertedEntity: TeamCalender = this.teamCalenderAdapter.convertDtoToEntity(teamCalenderDTO, isUpdate);
            console.log(teamCalenderDTO,'teamCalenderDTO....')
            const savedEntity: TeamCalender = await this.teamCalenderRepository.save(convertedEntity);
            const savedDto: TeamCalenderDto = this.teamCalenderAdapter.convertEntityToDto(savedEntity);
            if (savedDto) {
                const response = new TeamCalenderResponse(true, 1, isUpdate ? 'Team Calender Updated Successfully' : 'Team Calender Created Successfully');
                return response;
            } else {
                throw new TeamCalenderResponse(false,11106, 'Team Calender saved but issue while transforming it into DTO');
            }
        } catch (error) {
            throw error;
        }
    }

    async getAllTeamCalender(): Promise<TeamCalenderResponse> {
        try {
            const teamCalenderDtos: TeamCalenderDto[] = [];
            const teamCalenderEntities: TeamCalender[] = await this.teamCalenderRepository.find({ order: { id: 'ASC' } });
            if (teamCalenderEntities) {
                teamCalenderEntities.forEach(Entity => {
                    const convertedDto: TeamCalender = this.teamCalenderAdapter.convertEntityToDto(Entity);
                    teamCalenderDtos.push(convertedDto);
                });
                const response = new TeamCalenderResponse(true, 1, 'Team Calender Retrieved Successfully', teamCalenderDtos);
                return response;
            } else {
                throw new CommonResponseModel(false,99998, 'Data Not Found');
            }
        } catch (err) {
            throw err;
        }
    }


    async getAllActiveTeamCalender(): Promise<TeamCalenderResponse> {
        try {
            const teamCalenderDtos: TeamCalenderDto[] = [];
            const teamCalenderEntities: TeamCalender[] = await this.teamCalenderRepository.find({ order: { id: 'ASC' }, where: { isActive: true }, });
            if (teamCalenderEntities) {
                teamCalenderEntities.forEach(Entity => {
                    const convertedEntity: TeamCalender = this.teamCalenderAdapter.convertEntityToDto(Entity);
                    teamCalenderDtos.push(convertedEntity);
                });
                const response = new TeamCalenderResponse(true, 11108, 'Active Team Calender Retrieved Successfully', teamCalenderDtos);
                return response;
            } else {
                throw new CommonResponseModel(false,99998, 'Data Not Found');
            }
        } catch (err) {
            throw err;
        }
    }

    async getTeamCalenderRecords(req: ShiftCodeReq): Promise<TeamCalenderResponse> {
        try {
            const teamCalenderDtos: TeamCalenderDto[] = [];
            console.log(req);
            const teamCalenderEntities = await this.teamCalenderRepository.find({ order: { id: 'ASC' }, where: { isActive: true, shiftCode: req.shiftCode } });
            console.log(teamCalenderEntities);
            if (teamCalenderEntities) {
                teamCalenderEntities.forEach(Entity => {
                    const convertedEntity = this.teamCalenderAdapter.convertEntityToDto(Entity);
                    teamCalenderDtos.push(convertedEntity);
                });
                console.log(teamCalenderDtos, 'A');
                return new TeamCalenderResponse(true, 11108, 'Active Team Calender Retrieved Successfully', teamCalenderDtos);
            } else {
                throw new CommonResponseModel(false,99998, 'Data Not Found');
            }
        } catch (err) {
            throw err;
        }
    }

    async getTeamCalenderById(id: number): Promise<TeamCalender> {
        const response = await this.teamCalenderRepository.findOne({
            where: { id: id },
        });
        if (response) {
            return response;
        } else {
            return null;
        }
    }

    async activateOrDeactivateTeamCalender(teamCalenderReq: TeamCalenderRequest): Promise<TeamCalenderResponse> {
        try {
            const teamCalenderExists = await this.getTeamCalenderById(teamCalenderReq.id);
            if (teamCalenderExists) {
                if (teamCalenderReq.versionFlag != teamCalenderExists.versionFlag) {
                    throw new CommonResponseModel(false,10113, 'Someone updated the current team calender information. Refresh and try again');
                } else {
                    const teamCalenderStatus = await this.teamCalenderRepository.update(
                        { id: teamCalenderReq.id },
                        { isActive: teamCalenderReq.isActive, updatedUser: teamCalenderReq.updatedUser }
                    );
                    if (teamCalenderExists.isActive) {
                        if (teamCalenderStatus.affected) {
                            const teamCalenderResponse: TeamCalenderResponse = new TeamCalenderResponse(true, 10115, 'team calender is de-activated successfully');
                            return teamCalenderResponse;
                        } else {
                            throw new CommonResponseModel(false,10111, ' team calender is already de-activated');
                        }
                    } else {
                        if (teamCalenderStatus.affected) {
                            const teamCalenderResponse: TeamCalenderResponse = new TeamCalenderResponse(true, 10114, 'team calender is activated successfully');
                            return teamCalenderResponse;
                        } else {
                            throw new CommonResponseModel(false,10112, 'team calender is already activated');
                        }
                    }
                }
            } else {
                throw new CommonResponseModel(false,99998, 'No Records Found');
            }
        } catch (err) {
            throw err;
        }
    }
}