// src/controllers/master.controller.ts
import { ApplicationExceptionHandler, CommonResponseModel } from '@hrexpert/backend-utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MemoService } from './memo.service';


@Controller('/memo')
@ApiTags('/memo')
export class MemoController {
    constructor(
        private readonly memoService: MemoService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler,
    ) { }

 
    @Post('/createMemo')
    @ApiBody({})
    async createMemo(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.memoService.createMemo(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getAllMemo')
    async getAllMemo(): Promise<CommonResponseModel> {
        try {
            return await this.memoService.getAllMemo();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/updateMemo')
    @ApiBody({})
    async updateMemo(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.memoService.updateMemo(req);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveMemo')
    async getActiveMemo(): Promise<CommonResponseModel> {
        try {
            return await this.memoService.getActiveMemo();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateMemo')
    @ApiBody({})
    async activateOrDeactivateMemo(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.memoService.activateOrDeactivateMemo(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

}
