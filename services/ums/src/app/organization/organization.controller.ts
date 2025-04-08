import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationDto } from './dtos/organization.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationIdReqDto } from './dtos/activate.dto';
import { GetAllOrganizationResponse, DropdownOrganizationResponse, ApplicationExceptionHandler } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createOrganization')
  async createOrganization(@Body() createDto: OrganizationDto): Promise<CommonResponse> {
    try {
      return await this.organizationService.createOrganization(createDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }


  @Post('getAllOrganizations')
  async getAllOrganizations(): Promise<GetAllOrganizationResponse> {
    try {
      return await this.organizationService.getAllOrganizations()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllOrganizationResponse, error)
    }
  }
  @Post('getAllOrganizationsDropdown')
  async getAllOrganizationsDropdown(): Promise<DropdownOrganizationResponse> {
    try {
      return await this.organizationService.getAllOrganizationsDropdown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(DropdownOrganizationResponse, error)
    }
  }
  @Post('activateOrDeactivateOrganization')
  async activateOrDeactivateOrganization(@Body() dto:OrganizationIdReqDto): Promise<CommonResponse> {
    try {
      return await this.organizationService.activateOrDeactivateOrganization(dto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}
