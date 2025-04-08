 import { ApplicationExceptionHandler, GetAllUserResponse, GetAllUsersDropDown, UsersIdDto } from '@hrexpert/shared-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { OrganizationIdReqDto } from '../organization/dtos/activate.dto';
import { UnitIdDto } from '../units/dto/unit-id-request.dto';
import { UsersDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('Users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler) { }

  @Post('createUser')
  async userCreation(@Body() createRequest: UsersDto): Promise<CommonResponse> {
    try {
      return await this.usersService.userCreation(createRequest);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
  @Post('getAllUsers')
  async getAllUsers(): Promise<GetAllUserResponse> {
    try {
      return await this.usersService.getAllUsers()
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllUserResponse, error);
    }
  }
  @Post('getAllUsersDropdown')
  async getAllUsersDropdown(): Promise<GetAllUsersDropDown> {
    try {
      return await this.usersService.getAllUsersDropdown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllUsersDropDown, error)
    }
  }
  @Post('activateDeactivateUsers')
  async activateDeactivateUsers(@Body() userDto: UsersIdDto): Promise<CommonResponse> {
    try {
      return await this.usersService.activateDeactivateUsers(userDto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }
  @Post('getUsersData')
  async getUsersData(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.usersService.getUsersData(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  

  @Post('getUsersByUnitId')
  async getUsersByUnitId(@Body() req: UnitIdDto): Promise<GetAllUserResponse> {
    try {
      return await this.usersService.getUsersByUnitId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(GetAllUserResponse, error)
    }
  }

  @Post('getUsersByOrgId')
  async getUsersByOrgId(@Body() req: OrganizationIdReqDto): Promise<CommonResponse> {
    try {
      return await this.usersService.getUsersByOrgId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  @Post('getUsersByRoleId')
  async getUsersByRoleId(@Body() req:any): Promise<CommonResponse> {
    try {
      return await this.usersService.getUsersByRoleId(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }
}
