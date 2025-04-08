
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TourIntimationService } from './tour-intimation-service';
import { TourIntimationDto } from './dto/tour-intimation-dto';
import { TourIntimationEnum } from '@hrexpert/shared-models';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('tour-intimation')
@ApiTags('/tour-intimation')

export class TourIntimationController {
    constructor(
        private tourIntimationService: TourIntimationService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }


    @Post('/createtourIntimation')
    @ApiBody({ type: TourIntimationDto })
    async createtourIntimation(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.createtourIntimation(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/gettourIntimation')
    @ApiBody({})
    async gettourIntimation(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.gettourIntimation(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }


    @Post('/gettourEmployeeData')
    @ApiBody({})
    async gettourEmployeeData(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.gettourEmployeeData(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }


    @Post('/approve/:id')
    async approveLeave(@Param('id') id: number): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.updateTourStatus(id, TourIntimationEnum.APPROVED);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/reject/:id')
    async rejectLeave(@Param('id') id: number): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.updateTourStatus(id, TourIntimationEnum.REJECTED);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }


    @Post('/approveReject')
    @ApiBody({})
    async approveReject(@Body() req: { id: number, remarks: string, req: string, permissionAmount: number }): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.updateTourStatuswithRemarks(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/tourPdfUploadTemp')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        limits: { files: 1 },
        storage: diskStorage({
            destination: join(__dirname, '../../../', `employee-directory/tour-claim-pdfs`),
            filename: (req, file, callback) => {
                console.log(file.originalname);
                const name = file.originalname;
                callback(null, `${name}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG|pdf|PDF)$/)) {
                return callback(new Error('Only jpg,png,jpeg files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async pdfUploadTemp(@UploadedFile() file, @Body() data: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.pdfUploadTemp(file.path, file.filename, file.originalname, data);
        } catch (error) {
        }
    }

    @Post('/createtourClaim')
    @ApiBody({ type: TourIntimationDto })
    async createtourClaim(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.createtourClaim(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/gettourClaim')
    @ApiBody({})
    async gettourClaim(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.gettourClaim(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/TourClaimApprove')
    @ApiBody({})
    async TourClaimApprove(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.TourClaimApprove(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }

    @Post('/TourClaimReject')
    @ApiBody({})
    async TourClaimReject(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.tourIntimationService.TourClaimReject(req)
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err)
        }
    }
}
