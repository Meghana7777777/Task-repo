
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrganizationIdReqDto } from './dtos/activate.dto';
import { OrganizationDto } from './dtos/organization.dto';
import { OrganizationAdapter } from './repo/adapter';
import { OrganizationRepo } from './repo/organization.repo';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { GetAllOrganizationResponse, GetAllOrganizations, DropdownOrganizationResponse, DropdownOrganizationDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class OrganizationService {
  constructor(
    private dataSource: DataSource,
    private readonly orgRepo: OrganizationRepo,
    private readonly adapter: OrganizationAdapter,
  ) { }

  async createOrganization(createDto: OrganizationDto): Promise<CommonResponse> {
    let internalMessage: string;
    const convert = this.adapter.convertDtoToEntity(createDto);
    if (createDto.organizationId) {
      internalMessage = "Updated Successfully";
      const findRecord = await this.orgRepo.findOne({ where: { id: createDto.organizationId } });
      if (createDto.versionFlag !== findRecord.versionFlag) {
        return new GlobalResponseObject(false, 56154, "Someone Already Modified This Record Please Refresh And Continue...");
      }
    } else {
      internalMessage = "Created Successfully";
    }
    await this.orgRepo.save(convert);
    return new CommonResponse(true, 1234, internalMessage);
  };


  async getAllOrganizations(): Promise<GetAllOrganizationResponse> {
    const getAll = await this.orgRepo.find();
    const data: GetAllOrganizations[] = [];
    for (const submit of getAll) {
      const get = this.adapter.convertEntityToDto(submit);
      data.push(get);
    }
    return new GetAllOrganizationResponse(true, 1233, 'Data retrieved successfully', data);
  };



  async getAllOrganizationsDropdown(): Promise<DropdownOrganizationResponse> {
    const dropdown = await this.orgRepo.find({ select: ['name', 'id'] });
    const data: DropdownOrganizationDto[] = [];
    for (const getDropdown of dropdown) {
      const get = this.adapter.convertDropDownEntityToDto(getDropdown);
      data.push(get);
    }
    return new DropdownOrganizationResponse(true, 3334, 'Data Retrieved Successfully', data);
  };



  async activateOrDeactivateOrganization(dto: OrganizationIdReqDto): Promise<CommonResponse> {
    const deactivate = await this.orgRepo.findOne({ where: { id: dto.organizationId } })
    const activate = await this.orgRepo.update({ id: dto.organizationId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1233, `Status ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`)
  }
}
