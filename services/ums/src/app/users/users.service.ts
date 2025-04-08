import { Injectable } from '@nestjs/common';

import { DataSource, In } from 'typeorm';

import { GlobalResponseObject } from '@hrexpert/backend-utils';
import {
  DropdownUsersDto,
  GetAllUserResponse,
  GetAllUsersDropDown,
  GetAllUsersDto,
  OrganizationReqDto,
  UsersIdDto,
} from '@hrexpert/shared-models';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { AuthenticationsService } from '../authentications/authentications.service';
import { AuthenticationsDto } from '../authentications/dtos/authentications.dto';
import { AuthenticationEntity } from '../authentications/entities';
import { Client } from '../organization/entities/organization.entity';
import { RolesIdReqDto } from '../roles/dtos/activate.dto';
import { RolesEntity } from '../roles/entities/roles.entity';
import { UnitIdDto } from '../units/dto/unit-id-request.dto';
import { UnitEntity } from '../units/entities/units.entity';
import { UserRolesRepository } from '../user-roles/repositories/user-roles.repo';
import { UsersDto } from './dtos/user.dto';
import { UserChildEntity } from './entities/user-child.entity';
import { UserEntity } from './entities/users.entity';
import { UsersAdapter } from './user-repo/adapter';
import { UserChildRepo } from './user-repo/user-child.repo';
import { UserRepo } from './user-repo/user-repo';
import { CreateUserChildDTO } from 'libs/shared-models/src/lib/ums/ums-common/users/create-user-child.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepo,
    private readonly adapter: UsersAdapter,
    private readonly dataSource: DataSource,
    private readonly authService: AuthenticationsService,
    private readonly userRole: UserRolesRepository,
    private readonly usersChildRepo: UserChildRepo
  ) {}

  
  async userCreation(req: UsersDto): Promise<CommonResponse> {
    const transactionalEntityManager = new GenericTransactionManager(this.dataSource);
    try {
        await transactionalEntityManager.startTransaction();

        const authDto = new AuthenticationsDto();
        authDto.email = req.email;
        authDto.password = req.password;
        authDto.username = req.userName;
        authDto.createdUser = req.createdUser;

        
        const authSave: AuthenticationEntity =
            await this.authService.createAuthentication(authDto, transactionalEntityManager);

      
        const userEntity = this.adapter.convertDtoToEntity(req);
        userEntity.authentication = authSave;

        
        const savedUser = await transactionalEntityManager
            .getRepository(UserEntity)
            .save(userEntity);

       
        if (req.children && req.children.length > 0) {
            const childEntities = req.children.map((childDto) => {
                const childEntity = new UserChildEntity();
                childEntity.unitIds = childDto.unitIds; 
                childEntity.userId = savedUser;

                return childEntity;
            });

            
            await transactionalEntityManager
                .getRepository(UserChildEntity)
                .save(childEntities);
        }

        await transactionalEntityManager.completeTransaction();

        return new CommonResponse(true, 2345, 'Created Successfully');
    } catch (error) {
        await transactionalEntityManager.releaseTransaction();
        return new CommonResponse(false, 500, 'Creation Failed', error.message);
    }
}
async getAllUsers(): Promise<GetAllUserResponse> {
    const getAll = await this.repo.find();
    const get: GetAllUsersDto[] = [];
    for (const data of getAll) {
      const submit = this.adapter.convertEntityToDto(data);
      get.push(submit);
    }
    return new GetAllUserResponse(
      true,
      1234,
      'Data retrieved succeessfully',
      get
    );
  }

  async getAllUsersDropdown(): Promise<GetAllUsersDropDown> {
    const dropdown = await this.repo.find({
      select: ['firstName', 'id'],
    });
    const data: DropdownUsersDto[] = [];
    for (const getDropdown of dropdown) {
      const get = this.adapter.convertDropdownEntityToDto(getDropdown);
      data.push(get);
    }
    return new GetAllUsersDropDown(
      true,
      2334,
      'Data retrieved succeesfully',
      data
    );
  }

  async activateDeactivateUsers(userDto: UsersIdDto): Promise<CommonResponse> {
    const deactivate = await this.repo.findOne({
      where: { id: userDto.usersId },
    });
    const activate = await this.repo.update(
      { id: userDto.usersId },
      { isActive: !deactivate.isActive }
    );
   
    const findData = await this.repo.findUsersData({id:userDto.usersId})
    
    let foundAuth;
    let foundIsActive;
    if (findData) {
      foundAuth = findData[0].authentication_id
      foundIsActive = findData[0].isActive
    }
    await this.authService.usersActive({id:foundAuth,isActive:foundIsActive})
    return new CommonResponse(
      true,
      1233,
      `Status ${
        !deactivate.isActive ? 'Activated' : 'Deactivated'
      } successfully`
    );
  }

  async getUsersByUnitId(req: UnitIdDto): Promise<GetAllUserResponse> {
    const app = new UnitEntity();
    app.id = req.unitId;
    const getAll = await this.repo.find({
      where: { unit: app },
      relations: ['unit','authentication'],
    });
    const getData: GetAllUsersDto[] = [];
    for (const app of getAll) {
      const data = this.adapter.convertEntityToDto(app);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 45, 'No Data Found');
    }
    return new GetAllUserResponse(
      true,
      456,
      'Data Retrieved Successfully',
      getData
    );
  }
  async getUsersByOrgId(req: OrganizationReqDto): Promise<GetAllUserResponse> {
    const apps = new Client();
    apps.id = req.organizationId;
    const getAll = await this.repo.find({
      where: { client: apps },
      relations: ['client','authentication'],
    });
    const getData: GetAllUsersDto[] = [];
    for (const apps of getAll) {
      const data = this.adapter.convertEntityToDto(apps);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 4, 'No Data Found');
    }
    getData.reverse();
    return new GetAllUserResponse(
      true,
      5,
      'Data Retrieved Successfully',
      getData
    );
  }

  async getUsersByRoleId(req: RolesIdReqDto): Promise<CommonResponse> {
    const roles = new RolesEntity();
    roles.id = req.rolesId;
    const userIdENtityData = await this.userRole.find({
      select: ['user'],
      relations:['user'],
      where: { role: roles },
    });
    const userIds = Array.from(new Set(userIdENtityData.map((rec) => rec.user.id)));
    const getAll = await this.repo.find({
      where: { id: In([...userIds]) },
      select: ['firstName',  'id'],
      relations: ['authentication'],
    });
    const getData: GetAllUsersDto[] = [];
    for (const roles of getAll) {
      const data = this.adapter.convertEntityToDto(roles);
      getData.push(data);
    }
    if (getData.length === 0) {
      return new GlobalResponseObject(false, 4, 'No Data Found');
    }
    getData.reverse();
    return new GetAllUserResponse(
      true,
      5,
      'Data Retrieved Successfully',
      getData
    );
  }

  async getUsersData(req:any): Promise<CommonResponse> {
    const ba: any = await this.repo.getUsersData(req);
    return new CommonResponse(true, 123, 'retrieved successfully', ba);
}
}
