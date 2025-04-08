import { Injectable } from '@nestjs/common';
import { ScopeDto } from './dto/scopes.dto';
import { ScopesRepository } from './repo/scopes.repo';
import { ScopeAdapter } from './scopes-adapter';
import { ScopesIdDto } from './dto/scope-id.dto';
import { GetAllScopesResponse, GetAllScopesDto, GetAllScopesDropDownResponse, ScopesDropDownDto } from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class ScopeService {
  constructor(
    private readonly scopeRepo: ScopesRepository,
    private readonly adapter: ScopeAdapter,
  ) { }

  async createScope(scopeDto: ScopeDto): Promise<CommonResponse> {
    const conversion = this.adapter.convertTotoEntity(scopeDto)
    const save = await this.scopeRepo.save(conversion);
    return new CommonResponse(true, 1234, `created successfully`)
  }

  async getAllScopes(): Promise<GetAllScopesResponse> {
    const getAll = await this.scopeRepo.find();
    const data: GetAllScopesDto[] = [];
    for (const entity of getAll) {
      const conversion = this.adapter.convertEntityToDto(entity);
      data.push(conversion);
    }
    return new GetAllScopesResponse(true, 1233, 'Data Retried Successfully', data)
  }


  async getAllScopesDropDown(): Promise<GetAllScopesDropDownResponse> {
    const dropdown = await this.scopeRepo.find({ select: ['name', 'id'] });
    const data: ScopesDropDownDto[] = [];
    for (const entity of dropdown) {
      const dropdownConversion = this.adapter.convertDropDownEntityToDto(entity);
      data.push(dropdownConversion);
    }
    return new GetAllScopesDropDownResponse(true, 3456, 'Data Retrieved Successfully', data)
  }

  async activateAndDeactivatedScope(activateDto: ScopesIdDto): Promise<CommonResponse> {
    const deactivate = await this.scopeRepo.findOne({ where: { id: activateDto.scopeId } });
    const activate = await this.scopeRepo.update({ id: activateDto.scopeId }, { isActive: !deactivate.isActive })
    return new CommonResponse(true, 1233, `Status ${deactivate.isActive ? 'Deactivated' : 'Activated'} successfully`)
  }
}
