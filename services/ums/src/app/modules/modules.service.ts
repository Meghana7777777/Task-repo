import { Injectable } from '@nestjs/common';
import { ModulesRepository } from './repositorys/module.repo';
import { ModulesAdapter } from './modules-adapter';
import { ApplicationEntity } from '../applications/entities/application.entity';
import { GlobalResponseObject } from '@hrexpert/backend-utils';
import { ModuleDto, GetAllModulesResponse, ApplicationIdReqDto, ModulesIdReqDto, GetAllModulesDropDownResponse, ModulesDropDownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';


@Injectable()
export class ModulesService {
  constructor(
    private modulesRepo: ModulesRepository,
    private modulesAdapter: ModulesAdapter
  ) {

  }


  async create(createDto: ModuleDto): Promise<CommonResponse> {
    const conversion = this.modulesAdapter.convertDtoToEntity(createDto);
    const saving = await this.modulesRepo.save(conversion);
    return new CommonResponse(true, 1234, 'created successfully', saving);
  };

  async getAllModules(): Promise<GetAllModulesResponse> {
    const getAll = await this.modulesRepo.find({ relations: ['application'] });
    const getData: ModuleDto[] = [];
    for (const app of getAll) {
      const data = this.modulesAdapter.convertEntityToDto(app);
      getData.push(data);
    }

    if (getData.length === 0) {
      return new GlobalResponseObject(false, 123, 'No Data Found');
    }
    return new GetAllModulesResponse(true, 1234, "Data Retrieved Successfully", getData)
  };


  async getAllModulesByAppId(req: ApplicationIdReqDto): Promise<GetAllModulesResponse> {
    const app = new ApplicationEntity();
    app.id = req.applicationId;
    const getAll = await this.modulesRepo.find({ where: { application: app }, relations: ['application'] });
    const getData: ModuleDto[] = [];
    for (const app of getAll) {
      const data = this.modulesAdapter.convertEntityToDto(app);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 123, 'No Data Found');
    }
    return new GetAllModulesResponse(true, 1234, "Data Retrieved Successfully", getData)
  };

  async activateOrDeactivate(deactivateDto: ModulesIdReqDto): Promise<CommonResponse> {
    const deactivate = await this.modulesRepo.findOne({ where: { id: deactivateDto.moduleId } });
    const activate = await this.modulesRepo.update({ id: deactivateDto.moduleId }, { isActive: deactivate.isActive === true ? false : true })
    return new CommonResponse(true, 1234, `Status ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`);
  }


  async getAllModulesDropDown(): Promise<GetAllModulesDropDownResponse> {
    const getAll = await this.modulesRepo.find();
    const getData: ModulesDropDownDto[] = [];
    for (const app of getAll) {
      const data = this.modulesAdapter.convertDropDownEntityToDto(app);
      getData.push(data);
    }
    return new GetAllModulesDropDownResponse(true, 5675, "Data Retrieved Successfully", getData)
  }

  async getAllModulesDropDownByAppId(req: ApplicationIdReqDto): Promise<GetAllModulesDropDownResponse> {
    const app = new ApplicationEntity();
    app.id = req.applicationId;
    const getAll = await this.modulesRepo.find({ where: { application: app }, relations: ['application'] });
    const getData: ModulesDropDownDto[] = [];
    for (const app of getAll) {
      const data = this.modulesAdapter.convertDropDownEntityToDto(app);
      getData.push(data);
    }
    return new GetAllModulesDropDownResponse(true, 5675, "Data Retrieved Successfully", getData)
  }

}




