
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AttributesAdapter } from './adapter';
import { AttributeIdReqDto } from './dtos/activate.dto';
import { AttributeDto } from './dtos/attribute.dto';
import { AttributesRepository } from './repositories/attribute.repository';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { GetAllAttributesResponse, GetAllAttributeDto, GetAllAttributesDropDownResponse, GetAllAttributeDropDown } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class AttributesService {
  constructor(
    private dataSource: DataSource,
    private readonly attributesRepo: AttributesRepository,
    private readonly adapter: AttributesAdapter,
  ) {
  }

  async createAttribute(attributeDto: AttributeDto): Promise<CommonResponse> {
    let internalMessage: string;
    const conversion = this.adapter.convertDtoToEntity(attributeDto);
    if (attributeDto.attributeId) {
      internalMessage = "Updated Successfully"
      const findRecord = await this.attributesRepo.findOne({ where: { id: attributeDto.attributeId } });
      if (findRecord.versionFlag !== attributeDto.versionFlag) {
        return new GlobalResponseObject(false, 65465, 'Someone Already Modified This Record Please Refresh And Continue...')
      }
    } else {
      internalMessage = "Created Successfully"
    }
    await this.attributesRepo.save(conversion);
    return new CommonResponse(true, 1234, "created successfully");

  };


  async getAllAttributes(): Promise<GetAllAttributesResponse> {
    const getAll = await this.attributesRepo.find();
    if (getAll.length === 0) {
      return new GlobalResponseObject(true, 1233, 'Data Not Found')
    } else {
      const data: GetAllAttributeDto[] = [];
      for (const entity of getAll) {
        const conversion = this.adapter.convertEntityToDto(entity);
        data.push(conversion);
      }

      return new GetAllAttributesResponse(true, 1233, 'Data Retried Successfully', data)
    }

  }
  async getAllAttributesDropDown(): Promise<GetAllAttributesDropDownResponse> {
    const dropdown = await this.attributesRepo.find({ select: ['attributeName', 'id'] });
    const data: GetAllAttributeDropDown[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropDownEntityToDto(entity);
      data.push(dropdownConversion);
    }
    return new GetAllAttributesDropDownResponse(true, 1233, 'Data Retrieved Successfully', data)
  }

  async activateAndDeactivatedAttributes(activateDto: AttributeIdReqDto): Promise<CommonResponse> {
    const deactivate = await this.attributesRepo.findOne({ where: { id: activateDto.attributeId } });
    const activate = await this.attributesRepo.update({ id: activateDto.attributeId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1233, `status  ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`);
  }
}
