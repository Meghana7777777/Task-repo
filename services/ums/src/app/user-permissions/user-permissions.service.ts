import { Injectable } from '@nestjs/common';
import { UserPermsRepository } from './repo/user-perm.repo';
import { UserPermDto } from './dto/user-permission.dto';
import { UserPermsAdapter } from './user-permisons-adapter';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';

@Injectable()
export class UserPermissionsService {
  constructor(
    private readonly userPermsRepo: UserPermsRepository,
    private readonly adapter: UserPermsAdapter,
  ) {}

  async createUserPerm(userPermDto: UserPermDto): Promise<CommonResponse> {
    try {
      const userPerm = this.adapter.convertDtoToEntity(userPermDto);
      await this.userPermsRepo.save(userPerm);
      return new CommonResponse(true, 1234, 'UserPerm created successfully');
    } catch (error) {
      throw new Error('An error occurred while creating the UserPerm.');
    }
  }

  async getAllUserPerms(): Promise<CommonResponse> {
    try {
      const userPerms = await this.userPermsRepo.find();
      const data = userPerms.map(userPerm => this.adapter.convertEntityToDto(userPerm));
      return new CommonResponse(true, 1233, 'UserPerms retrieved successfully', data);
    } catch (error) {
      throw new Error('An error occurred while retrieving the UserPerms.');
    }
  }

  async getAllUserPermsDropDown(): Promise<CommonResponse> {
    try {
      const userPerms = await this.userPermsRepo.find({ select: ['id', ] });
      const data: any[] = userPerms.map(userPerm => ({
        id: userPerm.id,
      }));
      return new CommonResponse(true, 1233, 'UserPerms retrieved successfully', data);
    } catch (error) {
      throw new Error('An error occurred while retrieving the userPerms for dropdown.');
    }
  }

  async activateOrDeactivateUserPerm(activateDto: any): Promise<CommonResponse> {
    try {
      const userPerm = await this.userPermsRepo.findOne({ where: { id: activateDto.id } });
      if (!userPerm) {
        throw new Error('userPerm not found.');
      }
      userPerm.isActive = !userPerm.isActive;
      await this.userPermsRepo.save(userPerm);
      return new CommonResponse(true, 1233, 'UserPerms status changed successfully');
    } catch (error) {
      throw new Error('An error occurred while activating or deactivating the UserPerms.');
    }
  }
}
