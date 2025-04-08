import { Injectable } from '@nestjs/common';
import { ClientAppsAdapter } from './adapters/client-apps.adapter';
import { ActivateUserRolesDto } from './dtos/activate.dto';
import { ClientAppsRepository } from './repositories/client-apps.repo';
import { ClientAppsDto, ApplicationIdReqDto } from '@hrexpert/shared-models';
import { ActionsEnum, CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';



@Injectable()
export class ClientAppsService {
  constructor(
    private clientAppsRepo: ClientAppsRepository,
    private clientAppsAdapter: ClientAppsAdapter
  ) {

  }

  async mapOrUnMapAppsToClient(createDto: ClientAppsDto): Promise<CommonResponse> {
    if (createDto.actionType == ActionsEnum.DELETE)
      return this.deleteClientAppsMapping(createDto)
    const conversion = this.clientAppsAdapter.convertDtoToEntity(createDto);
    const saving = await this.clientAppsRepo.save(conversion)
    return new CommonResponse(true, 1234, 'created successfully', saving)
  };

  async deleteClientAppsMapping(createDto: ClientAppsDto) {
    await this.clientAppsRepo.delete({ id: createDto.clientAppsId })
    return new CommonResponse(true, 1234, 'User to Roles are un-mapped successfully')
  }

  async getAllAppsByApplicationId(req: ApplicationIdReqDto): Promise<CommonResponse> {
    const applicationId = req.applicationId;
    const getData = await this.clientAppsRepo.getAllAppsByApplicationId(applicationId);
    return new CommonResponse(true, 1234, "Data retrieved successfully", getData);
  }



  async activateOrDeactivate(deactivateDto: ActivateUserRolesDto): Promise<CommonResponse> {
    const deactivate = await this.clientAppsRepo.findOne({ where: { uuid: deactivateDto.id } })
    const activate = await this.clientAppsRepo.update({ uuid: deactivateDto.id }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1234, `Status ${deactivate.isActive ? 'deactivated' : 'activated'} successfully`);
  };


}
