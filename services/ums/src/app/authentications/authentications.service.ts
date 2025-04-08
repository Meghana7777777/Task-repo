import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import { DataSource } from 'typeorm';

import { ErrorResponse, GlobalResponseObject } from '@hrexpert/backend-utils';
import { UsersIdDto } from '@hrexpert/shared-models';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  CommonResponse,
  UserPermissionsDto,
  UsersResponse,
} from 'libs/shared-models/src/lib/ums/ums-common';
import { SendOptions } from '../../__common__/mailer/dtos/send-mail.dto';
import { GSuiteMailerService } from '../../__common__/mailer/g-sute-mailer.service';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { UserRolesService } from '../user-roles/user-roles.service';
import { AuthenticationAdapter } from './decorators/authentication-adapter';
import { AuthenticationsDto } from './dtos/authentications.dto';
import { JwtPayload } from './dtos/jwt.payload';
import { LoginUserDto } from './dtos/user-login.dto';
import { AuthenticationEntity } from './entities';
import { AuthenticationRepository } from './repositories/authentication.repository';
import { UsersService } from '@hrexpert/shared-services';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: AuthenticationRepository,
    private readonly jwtService: JwtService,
    private readonly userRoleMappingService: UserRolesService,
    private readonly adapter: AuthenticationAdapter,
    private configService: ConfigService,
    private mailServer: GSuiteMailerService,
    private userService: UsersService
  ) {}

  async createAuthentication(
    req: AuthenticationsDto,
    transactionalEntityManager: GenericTransactionManager
  ) {
    const emailVerification = await transactionalEntityManager
      .getRepository(AuthenticationEntity)
      .count({ where: { email: req.email } });
    if (emailVerification) {
      throw new ErrorResponse(
        54650,
        'Oops! This Email Is Already Registered. Please Use A Different Email..'
      );
    } else {
      const entity = new AuthenticationEntity();
      entity.email = req.email;
      entity.createdUser = req.createdUser;
      entity.password = req.password;
      entity.userName = req.username;
      if (req.authenticationId) {
        entity.id = req.authenticationId;
        entity.updatedUser = req.createdUser;
      }
      const saveData = await transactionalEntityManager
        .getRepository(AuthenticationEntity)
        .save(entity);
      return saveData;
    }
  }

  async login(req: any, @Res() response: Response): Promise<CommonResponse> {
    const userData = await this.repository.findOne({
      where: { email: req.body.username },
    });
    try {
      if (!userData) {
        throw new ErrorResponse(
          5498,
          `Oops! We couldn't find your account. Please register to create a new account..`
        );
      }
      if (
        userData.noOfFailedLogin &&
        this.configService.get('rateLimiting').maxLoginAttempts ===
          userData.noOfFailedLogin
      ) {
        throw new ErrorResponse(
          8985,
          `Access limit exceeded. Please try again after one hour`
        );
      }
      const userPayload: JwtPayload = {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.body.email,
        phone: '',
        externalRefNo: req.user.externalRefNo,
      };
      const accessToken = this.generateAccessToken(userPayload);
      const refreshToken = this.generateRefreshToken(userPayload);

      const reqID: UsersIdDto = new UsersIdDto(
        userData.email,
        req.user.usersId,
        req.user.usersId,
        req.user.unitId
      );
     
      const menusData =
        await this.userRoleMappingService.getAllPermissionsByUserId(reqID);
      // const filesData = await this.fileService.getSavedFilesData(user.usersId, ReferenceFeatures.USER);
      //console.log(menusData, '11111111111111111');

      let accessMenuObj: UserPermissionsDto;
      let roles = [];
      if (menusData.status) {
        const rolesRes = await this.userRoleMappingService.getAllRolesByUserId(
          reqID
        );
        if (rolesRes.status) {
          roles = rolesRes.data;
        }
        accessMenuObj = { ...menusData.data };
      } else {
        accessMenuObj = new UserPermissionsDto(
          req.user.id,
          userData.email,
          undefined,
          undefined,
          roles,
          userData.user.employeeId,
          userData.user.employeeCode,
          req.user.email,
          
        );
      }
      const secretData = {
        accessToken,
        refreshToken,
      };
      await this.setCurrentRefreshToken(refreshToken, req.body.usersId);
      if (
        this.configService.get('jwtConfig').jwtByCookieOrHeader === 'cookie'
      ) {
        response.cookie('tokens-data', secretData, {
          httpOnly: true,
          expires: new Date(new Date().getTime() + 86409000),
        });
      }
      // response.redirect('http://localhost:4200/')
      const responseObj = { ...secretData, accessMenuObj };
      response.send(
        new CommonResponse(
          true,
          5454,
          "Welcome back! You're now logged in",
          responseObj
        )
      );
      return new CommonResponse(
        true,
        9665,
        "`Welcome back! You're now logged in`",
        responseObj
      );
    } catch (error) {
      if (userData) {
        let otherFields = {};
        if (
          userData.noOfFailedLogin ==
          this.configService.get('rateLimiting').maxLoginAttempts - 1
        ) {
          otherFields['accountLockedOn'] = () => 'CURRENT_TIMESTAMP(6)';
        }
        await this.repository.update(
          { email: req.body.email },
          { noOfFailedLogin: () => 'noOfFailedLogin + 1', ...otherFields }
        );
      }
    }
  }

  // @LogActions({ isAsync: true })
  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    const user = await this.repository.findOne({
      where: { email: username },
      relations: ['user'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found !');
    }
    const hashedPassword = await bcrypt.hash(oldPassword, user.salt);
    const isPasswordValid = hashedPassword == user.password;
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const entity = new AuthenticationEntity();
    entity.email = username;
    entity.createdUser = user.createdUser;
    entity.password = newPassword;
    entity.userName = username;
    if (user.id) {
      entity.id = user.id;
      entity.updatedUser = username;
    }
    const saveData = await this.repository.save(entity);
    return new CommonResponse(true, 66666, 'Password Changed Successfully');
  }

  async getSalt(username: string): Promise<CommonResponse> {
    const user = await this.repository.findOne({ where: { email: username } });
    if (!user) {
      return new GlobalResponseObject(false, 132, 'User Not Found');
    }
    return new CommonResponse(true, 66666, 'User Was Updated Successfully');
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.repository.findOne({
      where: { email: username },
      relations: ['user'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found !');
    }
    const hashedPassword = await bcrypt.hash(password, user.salt);
    const isPasswordValid = hashedPassword == user.password;
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    let externalRefNo = JSON.parse(JSON.stringify(user))?.user?.externalRefNo
      ? JSON.parse(JSON.stringify(user))?.user?.externalRefNo
      : '';
    let usersId = JSON.parse(JSON.stringify(user))?.user?.id
      ? JSON.parse(JSON.stringify(user))?.user?.id
      : '';
    delete user.password;
    delete user.salt;
    delete user.hashedRefreshToken;
    delete user.user;
    return { ...user, usersId, externalRefNo };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.repository.findOne({ where: { email: username } });
    if (!user) return null;
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      delete user.password;
      delete user.salt;
      delete user.hashedRefreshToken;
      return { ...user };
    }
    return null;
  }

  async logOut(
    loginUserDto: LoginUserDto,
    @Res() response: Response
  ): Promise<any> {
    await this.repository.update(
      { email: loginUserDto.username },
      {
        hashedRefreshToken: null,
      }
    );
    response.clearCookie('tokens-data');
    return response.send(
      new CommonResponse(
        true,
        66666,
        'Authentication Has Been Successfully Done'
      )
    );
  }

  generateAccessToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwtConfig').jwtSecret,
      expiresIn: `${this.configService.get('jwtConfig').jwtExpiryTime}`,
    });
    return token;
  }

  generateRefreshToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwtConfig').refreshSecret,
      expiresIn: `${this.configService.get('jwtConfig').refreshExpiryTime}`,
    });
    return token;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.repository.update(
      { id: userId },
      {
        hashedRefreshToken,
      }
    );
  }

  async refreshJwtAccessToken(
    req: any,
    @Res() response: Response
  ): Promise<any> {
    const { user } = req;
    const userData: JwtPayload = {
      id: user.usersId,
      fullName: user.fullName,
      email: user.email,
      phone: '',
      externalRefNo: user.externalRefNo,
    };
    const accessToken = this.generateAccessToken(userData);
    const refreshToken = req?.cookies['tokens-data'].refreshToken;
    const secretData = {
      accessToken,
      refreshToken,
    };
    response.cookie('tokens-data', secretData, {
      httpOnly: true,
      expires: new Date(new Date().getTime() + 86409000),
    });
    return response.send(
      new CommonResponse(
        true,
        66666,
        'Authentication has been Successfully done',
        secretData
      )
    );
  }

  async getAllUsers(): Promise<UsersResponse> {
    const records: any = await this.repository.getAllUsers();
    if (records.length == 0) {
      return new GlobalResponseObject(false, 33333, 'Records Not Found');
    }
    return new UsersResponse(true, 53, 'users retrieved SuccessFully', records);
  }

  async usersActive(req: any): Promise<CommonResponse> {
    console.log(req, 'odhvg');
    const updateIsActive = await this.repository.update(
      { id: req.id },
      { isActive: req.isActive }
    );
    if (updateIsActive.affected) {
      return new GlobalResponseObject(true, 1, 'Done');
    } else {
      return new GlobalResponseObject(false, 0, 'Falslssl');
    }

    return new CommonResponse(true, 66666, 'User Was Updated Successfully');
  }

  async usersUpdate(updateDto: AuthenticationsDto): Promise<CommonResponse> {
    const findOne = await this.repository.findOne({
      where: { id: updateDto.usersId },
    });
    const activeFind = await this.repository.findOne({
      where: { isActive: true },
    });
    if (!findOne) {
      return new GlobalResponseObject(
        false,
        44444,
        'Dear User You Does Not Have Account'
      );
    }
    if (!activeFind) {
      return new GlobalResponseObject(
        false,
        55555,
        'Dear User Your Account Not In  Activate'
      );
    }
    // await this.repository.update({ id: updateDto.usersId }, { fullName: updateDto.fullName, email: updateDto.email, updatedUser: updateDto.updatedUser })
    return new CommonResponse(true, 66666, 'User Was Updated Successfully');
  }

  // @LogActions({ isAsync: true })
  async sendForgotPasswordOtp(username: string): Promise<CommonResponse> {
    const user = await this.repository.findOne({ where: { email: username } });
    if (!user) {
      throw new Error('User with this email does not exist.');
    }

    if (user.otpExpiryTime && new Date(user.otpExpiryTime) > new Date()) {
      throw new Error(
        'An OTP was already sent and is still valid. Please wait for it to expire.'
      );
    }

    // Generate a random OTP and its expiry time
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const otpExpiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save OTP details in the database
    user.sentOtp = otp;
    user.otpSentTime = new Date().toISOString();
    user.otpExpiryTime = otpExpiryTime.toISOString();
    await this.repository.save(user);

    const emailText = `Dear Sir/Madam ${username}, 

        Your One Time Password (OTP) is ${otp} to reset your Password.

        This OTP is valid for 15 minutes or 1 successful attempt whichever is earlier.

        Please do not share this One Time Password with anyone.


        In case you need any further clarification for the same, please do get in touch immediately with support@schemaxtech.com or your nearest branch.

        Regards,
        Schemax.`;

    const sendOptions = new SendOptions();
    sendOptions.to = username;
    sendOptions.from = `"HRxpert Alerts" <alerts@schemaxtech.com`;
    sendOptions.text = emailText;
    sendOptions.attachments = [];
    sendOptions.subject = `One Time Password - ${otp}`;
    await this.mailServer.sendGSuiteMail(sendOptions);
    return new CommonResponse(
      true,
      66666,
      'Your OTP to reset password has been sent to your mail successfully'
    );
  }

  // @LogActions({ isAsync: true })
  async resetPassword(
    username: string,
    otp: string,
    newPassword: string
  ): Promise<CommonResponse> {
    const user = await this.repository.findOne({ where: { email: username } });
    if (!user) {
      throw new Error('User with this email does not exist.');
    }

    // Check if OTP matches and is still valid
    const currentTime = new Date();
    if (user.sentOtp !== otp || currentTime > new Date(user.otpExpiryTime)) {
      throw new Error('Invalid or expired OTP.');
    }

    // Update user's password and clear OTP details
    user.password = newPassword;
    user.sentOtp = null;
    user.otpSentTime = null;
    user.otpExpiryTime = null;
    await this.repository.save(user);
    return new CommonResponse(
      true,
      66666,
      'Password has been updated successfully'
    );
  }
}
