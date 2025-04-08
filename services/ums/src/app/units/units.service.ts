
import { Injectable } from '@nestjs/common';
import { UnitDto } from './dto/units.dto';
import { UnitsRepository } from './repo/unit.repository';
import { UnitIdDto } from './dto/unit-id-request.dto';
import { UnitAdapter } from './unit-adapters';
import { OrganizationIdReqDto } from '../organization/dtos/activate.dto';
import { promises } from 'dns';
import { Client } from '../organization/entities/organization.entity';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { GetAllUnitsResponse, GetAllUnitDto, OrganizationReqDto, GetAllUnitsDropDownResponse, GetAllUnitDropDownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class UnitsService {
  constructor(
    private readonly unitRepo: UnitsRepository,
    private readonly adapter: UnitAdapter,
  ) { }

  async createUnit(unitDto: UnitDto): Promise<CommonResponse> {
    let internalMessage: string;
    const convert = this.adapter.convertDtoToEntity(unitDto);
    if (unitDto.unitId) {
      internalMessage = "Updated Successfully";
      const findRecord = await this.unitRepo.findOne({ where: { id: unitDto.unitId } });
      if (unitDto.versionFlag !== findRecord.versionFlag) {
        return new GlobalResponseObject(false, 4567, "Someone Already Modified This Record Please Refresh And Continue...")
      }
    } else {
      internalMessage = "Created successfully";
    }
    await this.unitRepo.save(convert);
    return new CommonResponse(true, 1234, internalMessage)
  }

  async getAllUnits(): Promise<GetAllUnitsResponse> {
    const getAll = await this.unitRepo.find({ relations: ['client'] });
    const data: GetAllUnitDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllUnitsResponse(true, 1233, 'Data Retried Successfully', data)
  }

  async getAllUnitsDropDown(req: OrganizationReqDto): Promise<GetAllUnitsDropDownResponse> {
    const dropdown = await this.unitRepo.find();
    const data: GetAllUnitDropDownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropDownEntityToDto(entity);
      data.push(dropdownConversion);
    }
    return new GetAllUnitsDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }

  async ActivateDeactivateUnitDto(activateDto: UnitIdDto): Promise<CommonResponse> {
    const deactivate = await this.unitRepo.findOne({ where: { id: activateDto.unitId } });
    const activate = await this.unitRepo.update({ id: activateDto.unitId }, { isActive: !deactivate.isActive })

    return new CommonResponse(true, 1233, 'status changed successfully', activate);
  }

  async getUnitsByOrgId(req: OrganizationIdReqDto): Promise<GetAllUnitsResponse> {
    const data = new Client()
    data.id = req.organizationId
    const getAll = await this.unitRepo.find({ where: { client: data }, relations: ['client'] });
    const getData: GetAllUnitDto[] = [];
    for (const data of getAll) {
      const get = this.adapter.convertEntityToDto(data);
      getData.push(get);
    }

    if (getData.length === 0) {
      return new GetAllUnitsResponse(false, 56, 'No data found')
    }
    return new GetAllUnitsResponse(true, 768, 'Data Retrieved successfully', getData)
  }

}