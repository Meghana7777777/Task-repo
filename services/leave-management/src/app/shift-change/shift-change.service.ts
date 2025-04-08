import { ApprovalStatusEnum, ShiftChangeRequest, ShiftStatsUpdateReq, TeamCalenderResponse } from '@hrexpert/shared-models';
import { Injectable } from "@nestjs/common";
import moment from "moment";
import { CommonResponseModel } from "@hrexpert/shared-models";
import { ShiftChangeReqEntity } from './entity/shift-change.entity';
import { ShiftChangeRepository } from './repository/shift-change-repo';
import { ShiftChangeReqDto } from './dto/shift-change..dto';
import { In } from 'typeorm';

@Injectable()
export class ShiftChangeService {

    constructor(
        private shiftChangeRepository: ShiftChangeRepository,
    ) { }

    async createShiftChangeRequest(dto: ShiftChangeRequest): Promise<CommonResponseModel> {
        try {
          const entity = new ShiftChangeReqEntity();
            entity.id = dto.id
            entity.employeeId = dto.employeeId;
            entity.shiftCode = dto.shiftCode;
            entity.fromDate = dto.fromDate;
            entity.toDate = dto.toDate;
            entity.fromShift = dto.fromShift;
            entity.toShift = dto.toShift;
            entity.reason = dto.reason;
            entity.requestStatus = ApprovalStatusEnum.OPEN
            const savedEntity = await this.shiftChangeRepository.save(entity);
            return new CommonResponseModel(true, 200, 'Shift change request created successfully', savedEntity);
          } catch (error) {
          return new CommonResponseModel(false, 500, 'Failed to create shift change request', error.message);
        }
      }

      async getAllOpenShiftChangeRequest(): Promise<CommonResponseModel> {
        try{
          const result = await this.shiftChangeRepository.getAllOpenShiftChangeRequest();  
          return new CommonResponseModel(true,111,'Data retried successfully',result)
        }catch(err){
          throw err
        }
    }
    async updateShiftStatusBySelectedEmp(req: ShiftStatsUpdateReq): Promise<CommonResponseModel> {
      // console.log(req,'reqq')
      try {
          const id = req.id;
          const shiftStatus = req.shiftStatus;

          await this.shiftChangeRepository.update(
              { id: In(id) },
              { requestStatus: shiftStatus }
          );

          return new CommonResponseModel(true, 11101, 'Updated successfully');
      } catch (error) {
          return new CommonResponseModel(false, 11102, 'Update failed', error.message);
      }
  }

  async getShiftByEmpId(empId: any): Promise<CommonResponseModel> {
    try {
      const result = await this.shiftChangeRepository.getShiftByEmpId(empId);
      return new CommonResponseModel(true, 111, 'Data retried successfully', result)
    } catch (err) {
      throw err
    }
  }
   
}