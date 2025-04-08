import {
  ApplicationExceptionHandler,
  CandidateNameReq,
  CandidateProfileReq,
  CommonResponseModel,
} from '@hrexpert/shared-models';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import fs from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CandidateProfileDto } from './entites/profile-dto';
import { RecruitmentInterviewsDto } from './entites/recruitment-interviews-dto';
import { RecruitmentDto } from './entites/requrirement-dto';
import { RecruitmentService } from './recruitment.service';
@Controller('/Recruitment')
@ApiTags('/Recruitment')
export class RecruitmentController {
  constructor(
    private service: RecruitmentService,
    private readonly applicationExceptionHandler: ApplicationExceptionHandler
  ) {}
  @Post('/createRecruitment')
  @ApiBody({ type: RecruitmentDto })
  async createRecruitment(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.service.createRecruitment(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/updateRecruitment')
  async updateRecruitment(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.service.updateRecruitment(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/getRecruitment')
  async getRecruitment(): Promise<CommonResponseModel> {
    try {
      return await this.service.getRecruitment();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  // @Post('/getRecruitmentCompanyDropDown')
  // async getRecruitmentCompanyDropDown(): Promise<CommonResponseModel> {
  //     try {
  //         return await this.service.getRecruitmentCompanyDropDown();
  //     } catch (error) {
  //         return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
  //     }
  // }

  @Post('/activateDeactivateRecruitment')
  async activateDeactivateRecruitment(
    @Body() dto: any
  ): Promise<CommonResponseModel> {
    try {
      return await this.service.activateDeactivateRecruitment(dto);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/createProfile')
  @ApiBody({ type: CandidateProfileDto })
  async createProfile(@Body() req: any): Promise<CommonResponseModel> {
    console.log('createProfile', req);
    try {
      return await this.service.createProfile(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/createRecImageProfile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
      limits: { files: 1 },
      storage: diskStorage({
          destination: join(__dirname, '../../../', 'employee-directory/recruitment-resumes'),
          filename: (req, file, callback) => {
              console.log(file.originalname);
              const name = file.originalname;
              callback(null, `${name}`);
          },
      }),
      fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF|ppt|pptx|doc|docx|csv|zip|gif)$/)) {
              return callback(new Error('Only jpg,png,jpeg files are allowed!'), false);
          }
          callback(null, true);
      },
  }))
  async createRecImageProfile(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
      try {
          return await this.service.createRecImageProfile(file.path, file.filename, uploadData.id);
      } catch (error) {
      }
  }

  @Post('/updateProfileRecruitment')
  @ApiBody({ type: CandidateProfileReq })
  async updateProfileRecruitment(
    @Body() req: CandidateProfileReq
  ): Promise<CommonResponseModel> {
    try {
      return await this.service.updateProfileRecruitment(req);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/getRecruitmentProfiles')
  async getRecruitmentProfiles(): Promise<CommonResponseModel> {
    try {
      return await this.service.getRecruitmentProfiles();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }
  @Post('/getRecruitmentProfilesDropDown')
  async getRecruitmentProfilesDropDown(): Promise<CommonResponseModel> {
    try {
      return await this.service.getRecruitmentProfilesDropDown();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }
  @Post('/getProfileReportById')
  async getProfileReportById(): Promise<CommonResponseModel> {
    try {
      return await this.service.getProfileReportById();
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }

  @Post('/createRecruitmentInterviews')
  @ApiBody({ type: RecruitmentInterviewsDto })
  async createRecruitmentInterviews(
    @Body() req: any
  ): Promise<CommonResponseModel> {
    try {
      return await this.service.createRecruitmentInterviews(req);
    } catch (err) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        err
      );
    }
  }

  @Post('/getAllRecruitmentInterviews')
  async getAllRecruitmentInterviews(@Body() req: any): Promise<any> {
    try {
      return await this.service.getAllRecruitmentInterviews();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/updateRecruitmentInterviews')
  @ApiBody({ type: RecruitmentInterviewsDto })
  async updateRecruitmentInterviews(@Body() req: any): Promise<any> {
    try {
      return await this.service.updateRecruitmentInterviews(req);
    } catch (err) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        err
      );
    }
  }

  @Post('/getReferenceNamewithCandidateName')
  @ApiBody({ type: CandidateNameReq })
  async getReferenceNamewithCandidateName(@Body() reqModel: CandidateNameReq) {
    try {
      return this.service.getReferenceNamewithCandidateName(reqModel);
    } catch (error) {
      return this.applicationExceptionHandler.returnException(
        CommonResponseModel,
        error
      );
    }
  }
  @Post('/getProfilesToAssign')
  async getProfilesToAssign(@Body() req: any): Promise<any> {
    try {
      return await this.service.getProfilesToAssign(req);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/assignProfiles')
  async assignProfiles(@Body() req: any): Promise<any> {
    try {
      return await this.service.assignProfiles(req);
    } catch (err) {
      console.log(err);
    }
  }
  @Post('/getAssignedProfiles')
  async getAssignedProfiles(@Body() req: any): Promise<any> {
    try {
      return await this.service.getAssignedProfiles(req);
    } catch (err) {
      console.log(err);
    }
  }

  // @Post('/fileUpload')
  // @UseInterceptors(
  //   FilesInterceptor('file', 10, {
  //     storage: diskStorage({
  //       destination: (req, file, callback) => {
  //         // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  //         // console.log(req.body);

  //         // console.log(file);
  //         const destinationPath = join(__dirname, '../../../../');
  //         // console.log(destinationPath)
  //         // const destinationPath = upload_files/SD-${(req.body.reqNo).replace(/\//g, "_")};
  //         // const destinationPath = https://edoc7.shahi.co.in/upload_files/PO-${req.body.poNumber};

  //         // const destinationPath = ${config.download_path}+/PO-${req.body.poNumber};

  //         try {
  //           // Attempt to create the directory if it doesn't exist
  //           fs.mkdirSync(destinationPath, { recursive: true });
  //           callback(null, destinationPath);
  //         } catch (error) {
  //           // console.error('Error creating directory:', error);
  //           callback(error, null);
  //         }
  //       },
  //       // destination: (req, file, callback) => {
  //       //   callback(null, ./upload-files/PO-${req.body.customerPo});
  //       // },
  //       filename: (req, file, callback) => {
  //         // console.log(req);
  //         // console.log(file);
  //         // console.log("");
  //         const name = file.originalname.split('.')[0];
  //         const fileExtName = extname(file.originalname);
  //         const randomName = Array(4)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //         callback(null, ` ${name}-${randomName}${fileExtName}`);
  //       },
  //     }),
  //     fileFilter: (req, file, callback) => {
  //       if (
  //         !file.originalname.match(/\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF)$/)
  //       ) {
  //         return callback(
  //           new Error(
  //             'Only xlsx,xls,pdf, jpg, png, doc, jpeg files are allowed!'
  //           ),
  //           false
  //         );
  //       }
  //       callback(null, true);
  //     },
  //   })
  // )
  // async updateStylePath(
  //   @UploadedFiles() file: File[],
  //   @Body() req: any
  // ): Promise<CommonResponseModel> {
  //   console.log(file, '-------file');
  //   try {
  //     return await this.service.updateProfileRecruitment(req, file);
  //   } catch (error) {
  //     console.log(error, 'error');
  //     return this.applicationExceptionHandler.returnException(
  //       CommonResponseModel,
  //       error
  //     );
  //   }
  // }

  @Post('/getRecruitmentTrackerReport')
  async getRecruitmentTrackerReport(@Body() req?: any): Promise<any> {
    try {
      return await this.service.getRecruitmentTrackerReport(req);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/getProfile')
  async getProfile(@Body() req: any): Promise<any> {
    try {
      return await this.service.getProfile(req);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/updateIsProfileRegistered')
  async updateIsProfileRegistered(@Body() req: any): Promise<any> {
    try {
      return await this.service.updateIsProfileRegistered(req);
    } catch (err) {
      console.log(err);
    }
  }
}
