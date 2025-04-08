import dayjs from "dayjs";
import { ApplyForLeavesDto } from "../dto/apply-for-leaves.dto";
import { ApplyForLeavesEntity } from "../entities/apply-for-leaves.entity";
import { Injectable } from "@nestjs/common";


@Injectable()
export class ApplyForLeavesAdapter {

    // convertDtoToEntity(dtoObj: ApplyForLeavesDto, isUpdate: boolean = false): ApplyForLeavesEntity {
    //     try {
    //         const entityObj = new ApplyForLeavesEntity();
    //         entityObj.applyForLeavesId = dtoObj.applyForLeavesId;
    //         entityObj.employeeId = dtoObj.employeeId;
    //         entityObj.employeeCode = dtoObj.employeeCode;
    //         entityObj.typeOfLeave = dtoObj.typeOfLeave;
    //         entityObj.employeeName = dtoObj.employeeName;
    //         entityObj.fromDate = dtoObj.fromDate
    //         entityObj.toDate = dtoObj.toDate
    //         entityObj.noOfDays = dtoObj.noOfDays;
    //         entityObj.leaveReason = dtoObj.leaveReason;
    //         entityObj.leaveAddress = dtoObj.leaveAddress;
    //         entityObj.status = dtoObj.status;
    //         if (isUpdate) {
    //             entityObj.updatedUser = dtoObj.updatedUser;
    //         } else {
    //             entityObj.isActive = true;
    //             entityObj.createdUser = dtoObj.createdUser;
    //         }
    //         return entityObj;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // convertEntityToDto(entityObj: ApplyForLeavesEntity): ApplyForLeavesDto {

    //     const dtoObj = new ApplyForLeavesDto();
    //     dtoObj.applyForLeavesId = entityObj.applyForLeavesId;
    //     dtoObj.employeeId = entityObj.employeeId;
    //     dtoObj.employeeCode = entityObj.employeeCode;
    //     dtoObj.typeOfLeave = entityObj.typeOfLeave;
    //     dtoObj.employeeName = entityObj.employeeName;
    //     dtoObj.fromDate = entityObj.fromDate
    //     dtoObj.toDate = entityObj.toDate
    //     dtoObj.leaveReason = entityObj.leaveReason;
    //     dtoObj.noOfDays = entityObj.noOfDays;
    //     dtoObj.leaveAddress = entityObj.leaveAddress;
    //     dtoObj.createdAt = entityObj.createdAt;
    //     dtoObj.createdUser = entityObj.createdUser;
    //     dtoObj.updatedAt = entityObj.updatedAt;
    //     dtoObj.updatedUser = entityObj.updatedUser;
    //     dtoObj.versionFlag = entityObj.versionFlag;
    //     dtoObj.status = entityObj.status;
    //     return dtoObj;
    // }
}