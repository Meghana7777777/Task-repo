import { ApplicationExceptionHandler, CommonResponseModel } from "@hrexpert/backend-utils";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ComponentNamesService } from "./components.service";


@ApiTags('component-names')
@Controller('component-names')
export class ComponentNamesController {
    constructor(
        private readonly componentNamesService: ComponentNamesService,
        private readonly applicationExceptionHandler: ApplicationExceptionHandler

    ) { }

    @Post('/createComponentNames')
    async createComponentNames(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.componentNamesService.createComponentNames(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/updateComponentNames')
    async updateComponentNames(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.componentNamesService.updateComponentNames(req);
        } catch (err) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, err);
        }
    }

    @Post('/getComponentsNames')
    async getComponentsNames(): Promise<CommonResponseModel> {
        try {
            return await this.componentNamesService.getComponentsNames();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/getActiveComponentsNames')
    async getActiveComponentsNames(): Promise<CommonResponseModel> {
        try {
            return await this.componentNamesService.getActiveComponentsNames();
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }

    @Post('/activateOrDeactivateComponentsNames')
    @ApiBody({})
    async activateOrDeactivateComponentsNames(@Body() dto: any): Promise<CommonResponseModel> {
        try {
            return await this.componentNamesService.activateOrDeactivateComponentsNames(dto);
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
        }
    }



}