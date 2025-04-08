import { Injectable } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repo';
import { RolesAdapter } from './adapters/roles.adapter';
import { RolesDto } from './dtos/roles.dto';
import { RolesIdReqDto } from './dtos/activate.dto';
import { RolesEntity } from './entities/roles.entity';
import { UnitEntity } from '../units/entities/units.entity';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { GetAllRolesResponse, GetAllRolesDto, GetAllRolesDropDownResponse, GetAllRolesDropDown, UnitIdDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';



@Injectable()
export class RolesService {
  constructor(
    private rolesRepo: RolesRepository,
    private rolesAdapter: RolesAdapter,

  ) {

  }

  async createRoles(createDto: RolesDto): Promise<CommonResponse> {
    const conversion = this.rolesAdapter.convertDtoToEntity(createDto);
    let internalMessage: string;
    if (createDto.rolesId) {
      internalMessage = "Updated Successfully"
      const findRecord = await this.rolesRepo.findOne({ where: { id: createDto.rolesId } });
      if (findRecord.versionFlag !== createDto.versionFlag) {
        return new GlobalResponseObject(false, 6561, 'Someone Already Modified This Record Please Refresh And Continue...')
      }
    } else {
      internalMessage = "Created Successfully"
    }
    await this.rolesRepo.save(conversion)
    return new CommonResponse(true, 1234, internalMessage)
  }

  async getAllRoles(): Promise<GetAllRolesResponse> {
    const getAll: RolesEntity[] = await this.rolesRepo.find({ relations: ['unit'] });
    const getData: GetAllRolesDto[] = [];
    for (const app of getAll) {
      const data = this.rolesAdapter.convertEntityToDto(app);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 65415, 'Data Not Found')
    } else {
      return new GetAllRolesResponse(true, 1234, "Data Retrieved Successfully", getData)
    }
  };


  // async getRolesById(id): Promise<any> {
  //   const getall = await this.rolesRepo.findOne({ where: { id: id } });
  //   return getall;
  // }

  async activateOrDeactivate(deactivateDto: RolesIdReqDto): Promise<CommonResponse> {
    const deactivate = await this.rolesRepo.findOne({ where: { id: deactivateDto.rolesId } })
    const activate = await this.rolesRepo.update({ id: deactivateDto.rolesId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1234, `Status ${deactivate.isActive ? 'deactivated' : 'activated'} successfully`);
  }

  async getAllRolesDropDown(): Promise<GetAllRolesDropDownResponse> {
    const dropdown = await this.rolesRepo.find({ select: ['name', 'id'] });
    const get: GetAllRolesDropDown[] = [];

    for (const getDropdown of dropdown) {
      const data = this.rolesAdapter.convertDropDownEntityToDto(getDropdown);
      get.push(data);
    }
    return new GetAllRolesDropDownResponse(true, 5675, "Data retrieved successfully", get);
  }

  async getAllRolesDropDownByUnitId(): Promise<GetAllRolesDropDownResponse> {
    const dropdown = await this.rolesRepo.find({ select: ['name', 'id'] });
    const get: GetAllRolesDropDown[] = [];

    for (const getDropdown of dropdown) {
      const data = this.rolesAdapter.convertDropDownEntityToDto(getDropdown);
      get.push(data);
    }
    return new GetAllRolesDropDownResponse(true, 5675, "Data retrieved successfully", get);
  }

  async getAllRolesByUnitId(req: UnitIdDto): Promise<GetAllRolesResponse> {
    const app = new UnitEntity();
    app.id = req.unitId;
    const getAll = await this.rolesRepo.find({ where: { unit: app }, relations: ['unit'] });
    const getData: GetAllRolesDto[] = [];
    for (const app of getAll) {
      const data = this.rolesAdapter.convertEntityToDto(app);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 45, 'No Data Found');
    }
    return new GetAllRolesResponse(true, 456, "Data Retrieved Successfully", getData)
  };


}
