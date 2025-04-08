import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from "multer";
import { join } from "path";
import { MeetingRoomIdReq, RoomBookingDto } from '../../../../../libs/shared-models/src/lib/metting-room/';
import { DateTimeDto } from './dto/dateTime.dto';
import { ScheduleStatusDto } from './dto/schedule-dto';
import { SlotsDto } from './dto/time-slot-dto';
import { TrainingCenterDto } from './dto/training-center-dto';
import { ValidationDto } from './dto/validation-dto';
import { TrainingCenterService } from './training-center-service.';
@Controller('training-center-controller')
export class TrainingCenterController {
    constructor(
        private service: TrainingCenterService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    @Post('/createMeetingRoom')
    @ApiBody({ type: TrainingCenterDto })
    async createMeetingRoom(@Body() req: TrainingCenterDto): Promise<CommonResponseModel> {
        // console.log('Received payload:', req); 
        try {
            return await this.service.createMeetingRoom(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllMeetingRooms')
    async getAllMeetingRooms(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAllMeetingRooms();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateMeetingRoom')
    @ApiBody({ type: TrainingCenterDto })
    async updateMeetingRoom(@Body() req: TrainingCenterDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateMeetingRoom(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateMeetingRoom')
    @ApiBody({ type: TrainingCenterDto })
    async activateOrDeactivateMeetingRoom(@Body() dto: TrainingCenterDto): Promise<CommonResponseModel> {
        try {
            return await this.service.activateOrDeactivateMeetingRoom(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveMeetingRooms')
    async getActiveMeetingRooms(): Promise<CommonResponseModel> {
        try {
            return await this.service.getActiveMeetingRooms();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/bookMeetingRoom')
    async bookMeetingRoom(@Body() req: RoomBookingDto): Promise<CommonResponseModel> {
        try {
            return await this.service.bookMeetingRoom(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getMeetingSchedules')
    async getMeetingSchedules(@Body() req?: MeetingRoomIdReq): Promise<CommonResponseModel> {
        try {
            return await this.service.getMeetingSchedules(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAvailableRooms')
    async getAvailableRooms(): Promise<CommonResponseModel> {
        try {
            return await this.service.getAvailableRooms();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/imageUpload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        limits: { files: 1 },
        storage: diskStorage({
            destination: (req, file, callback) => {
                const dest = join(__dirname, '../../../../', `uploaded_image_files`);
                // console.log('Destination folder:', dest);

                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true });
                }
                callback(null, dest);
            },
            filename: (req, file, callback) => {
                const uniqueName = `${Date.now()}-${file.originalname}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG)$/)) {
                return callback(new Error('Only jpg,png,jpeg files are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async imageUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
        try {
            const result = await this.service.imageUpload(file.path, file.filename, uploadData.id, file.originalname);
            return result;
        } catch (error) {
            console.error('Error during image upload:', error);
            return new CommonResponseModel(false, 500, 'Internal server error', null);
        }
    }

    @Post('/updateScheduleStatus')
    @ApiBody({ type: ScheduleStatusDto })
    async updateScheduleStatus(@Body() req: ScheduleStatusDto): Promise<CommonResponseModel> {
        try {
            return await this.service.updateScheduleStatus(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getScheduleDataByDate')
    @ApiBody({ type: SlotsDto })
    async getScheduleDataByDate(@Body() roomId: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getScheduleDataByDate(roomId);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getTodayAvailabilitySlots')
    @ApiBody({ type: SlotsDto })
    async getTodayAvailabilitySlots(@Body() req: SlotsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getTodayAvailabilitySlots(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/validateTimeSlots')
    @ApiBody({ type: ValidationDto })
    async validateTimeSlots(@Body() req: ValidationDto): Promise<CommonResponseModel> {
        try {
            return await this.service.validateTimeSlots(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getTodayAvailabilitySlotsT')
    @ApiBody({ type: SlotsDto })
    async getTodayAvailabilitySlotsT(@Body() req: SlotsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getTodayAvailabilitySlotsT(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getScheduleDataWithDate')
    @ApiBody({ type: SlotsDto })
    async getScheduleDataWithDate(@Body() req: SlotsDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getScheduleDataWithDate(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getRoomSlots')
    @ApiBody({ type: DateTimeDto })
    async getRoomSlots(@Body() req: DateTimeDto): Promise<CommonResponseModel> {
        try {
            return await this.service.getRoomSlots(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
