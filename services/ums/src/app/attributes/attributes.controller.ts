
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttributesService } from './attributes.service';
import { AttributeIdReqDto } from './dtos/activate.dto';
import { AttributeDto } from './dtos/attribute.dto';

import { GetAllAttributesResponse, GetAllAttributesDropDownResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createAttribute')
  async createAttribute(@Body() atbDto: AttributeDto): Promise<CommonResponse> {
    try {
      return await this.attributesService.createAttribute(atbDto)
    } catch (error) {
    return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post("getAllAttributes")
  async getAllAttributes(): Promise<GetAllAttributesResponse> {
    try {
      return await this.attributesService.getAllAttributes()
    } catch (error) {
    return this.applicationExceptionHandler.returnException(GetAllAttributesResponse, error);
    }
  }
  @Post('getAllAttributesDropDown')
  async getAllAttributesDropDown(): Promise<GetAllAttributesDropDownResponse> {
    try {
      return await this.attributesService.getAllAttributesDropDown();
    } catch (error) {
    return this.applicationExceptionHandler.returnException(GetAllAttributesDropDownResponse, error);
    }
  }
  @Post('activateAndDeactivatedAttributes')
  async activateAndDeactivatedAttributes(@Body() activateDto:AttributeIdReqDto): Promise<CommonResponse>{
    try {
      return await this.attributesService.activateAndDeactivatedAttributes(activateDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse,error);
    }
  }
}
