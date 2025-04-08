import { Injectable } from '@nestjs/common';
import { ApplicationsDto } from './dto/applications.dto';
import { ApplicationRepository } from './repositories/application.repo';
import { ApplicationsAdapter } from './adapter/application.adapter';
import { ApplicationEntity } from './entities/application.entity';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { ApplicationsResponse, GetAllApplicationsDto, ApplicationIdReqDto, ApplicationsDropDownResponse, ApplicationsDropDownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class ApplicationsService {
  constructor(
    private applicationDataRepo: ApplicationRepository,
    private applicationsAdapter: ApplicationsAdapter
  ) {

  }

  async create(createDto: ApplicationsDto): Promise<CommonResponse> {
    let internalMessage: string;
    const conversion = this.applicationsAdapter.convertDtoToEntity(createDto);
    if(createDto.applicationId){
      const findRecord = await this.applicationDataRepo.findOne({ where: { id: createDto.applicationId } });
      if(!findRecord){
        return new CommonResponse(false, 404, "Record not found.");
      }
      if (createDto.versionFlag !== findRecord.versionFlag) {
        return new GlobalResponseObject(false, 541, "Someone Already Modified This Record Please Refresh And Continue...");
      }
      createDto.applicationId
      = conversion.id
      await this.applicationDataRepo.save(conversion)
      internalMessage = "Updated successfully";
    }
    else {
      await this.applicationDataRepo.save(conversion);
      internalMessage = "Created Successfully";
    }
    return new CommonResponse(true, 14, internalMessage);
  };


  async getAllApplications(): Promise<ApplicationsResponse> {
    const records: ApplicationEntity[] = await this.applicationDataRepo.find();
    const empty: GetAllApplicationsDto[] = [];
    for (const ap of records) {
      empty.push(new GetAllApplicationsDto(ap.applicationName, ap.id, ap.description, ap.isActive, ap.versionFlag));
    }
    if (!records.length) {
      return new GlobalResponseObject(false, 11, 'no records found');
    }
    return new ApplicationsResponse(true, 22, 'Applications Data retrived successfully', empty);
  }

  // async getApplicationsById(id): Promise<any> {
  //   const getall = await this.applicationdataRepo.findOne({ where: { id: id } });
  //   console.log(getall)
  //   return getall;

  async activateOrDeactivate(deactivateDto: ApplicationIdReqDto): Promise<CommonResponse> {
    const deactivate = await this.applicationDataRepo.findOne({ where: { id: deactivateDto.applicationId} })
    const activate = await this.applicationDataRepo.update({id: deactivateDto.applicationId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1234, `Status ${deactivate.isActive ? 'deactivated' : 'activated'} successfully`);
  }

  async getAllApplicationsDropDown(): Promise<ApplicationsDropDownResponse> {
    const getAll = await this.applicationDataRepo.find();
    const getData: ApplicationsDropDownDto[] = [];
    for (const app of getAll) {
      const data = this.applicationsAdapter.convertDropDownEntityToDto(app);
      getData.push(data);
    }
    return new ApplicationsDropDownResponse(true, 5675, "Data retrieved successfully", getData)
  }

}




