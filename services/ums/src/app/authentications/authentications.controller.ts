import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsDto } from './dtos/authentications.dto';

import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { Response } from 'express';
import { LoginUserDto } from './dtos/user-login.dto';
import { Throttle } from '@nestjs/throttler';
import { CommonResponse, UsersResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserNameDto } from './dtos/username.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';


@ApiTags('Auth')
@Controller('authentications')
export class AuthenticationsController {

  constructor(
    private readonly authenticationsService: AuthenticationsService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {

  }



  // @Post('createAuth')
  // async createAuthentication(@Body() authDto: AuthenticationsDto): Promise<CommonResponse> {
  //   try {
  //     return await this.authenticationsService.createAuthentication(authDto)
  //   } catch (error) {
  //     return this.applicationExceptionHandler.returnException(CommonResponse, error)
  //   }
  // }

  @Throttle(3, 60)
  @Public()
  @Post('getSalt')
  async getSalt(@Body() updateDto: LoginUserDto): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.getSalt(updateDto.username);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  @Throttle(3, 60)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() response: Response): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.login(req, response);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }


  @Post('getAllUsers')
  async getAllUsers(): Promise<UsersResponse> {
    try {
      return await this.authenticationsService.getAllUsers();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(UsersResponse, error);
    }
  }

  @Post('usersUpdate')
  async usersUpdate(@Body() updateDto: AuthenticationsDto): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.usersUpdate(updateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  @Post('usersActive')
  async usersActive(@Body() updateDto: any): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.usersActive(updateDto)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  @Post('changePassword')
  async changePassword(@Body() updateDto: ChangePasswordDto): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.changePassword(updateDto.username, updateDto.oldPassword, updateDto.newPassword)
    } catch (error) {
      return this.applicationExceptionHandler. returnException(CommonResponse, error)
    }
  }

  @Throttle(3, 60)
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() req: UserNameDto): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.sendForgotPasswordOtp(req.username);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }

  @Throttle(3, 60)
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() req: ResetPasswordDto): Promise<CommonResponse> {
    try {
      return await this.authenticationsService.resetPassword(req.username, req.otp, req.newPassword);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error)
    }
  }


}
