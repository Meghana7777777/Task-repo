
import { Injectable } from "@nestjs/common";
import { TeamCalenderDto } from "./dto/team-calender.dto";
import { TeamCalender } from "./entity/team-calender.entity";


@Injectable()
export class TeamCalenderAdapter{

    public convertDtoToEntity(teamcalenderDTO: TeamCalenderDto, isUpdate: boolean = false): TeamCalender{
        const teamcalenderEntity = new TeamCalender();
        teamcalenderEntity.shiftCode= teamcalenderDTO.shiftCode;
        teamcalenderEntity.fromDate= teamcalenderDTO.fromDate;
        teamcalenderEntity.toDate= teamcalenderDTO.toDate;
        teamcalenderEntity.shift= teamcalenderDTO.shift;
        teamcalenderEntity.isActive = teamcalenderDTO.isActive === undefined ? true : teamcalenderDTO.isActive;
        if(isUpdate){
            teamcalenderEntity.id= teamcalenderDTO.id;
            teamcalenderEntity.updatedUser = teamcalenderDTO.updatedUser;
        }else{
            teamcalenderEntity.isActive = true;
            teamcalenderEntity.createdUser = teamcalenderDTO.createdUser;
        }
        return teamcalenderEntity;
    }

    public convertEntityToDto(teamcalenderObj: TeamCalender): TeamCalenderDto{
        const teamcalenderDTO = new TeamCalenderDto;
        teamcalenderDTO.id= teamcalenderObj.id;
        teamcalenderDTO.shiftCode= teamcalenderObj.shiftCode;
        teamcalenderDTO.fromDate= teamcalenderObj.fromDate;
        teamcalenderDTO.toDate= teamcalenderObj.toDate;
        teamcalenderDTO.shift= teamcalenderObj.shift;
        teamcalenderDTO.isActive = teamcalenderObj.isActive;
        teamcalenderDTO.createdAt = teamcalenderObj.createdAt;
        teamcalenderDTO.updatedAt = teamcalenderObj.updatedAt;
        teamcalenderDTO.updatedUser = teamcalenderObj.updatedUser;
        teamcalenderDTO.createdUser = teamcalenderObj.createdUser;
        teamcalenderDTO.versionFlag = teamcalenderObj.versionFlag;
        return teamcalenderDTO;

    }
}