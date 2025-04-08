import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { EmpAssetMappingService } from './emp-asset-mapping.service';
import { EmpAsssetMappingDto } from './dto/emp-asset-mapping.dto';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/emp-asset-mapping')
@Controller('emp-asset-mapping')
export class EmpAssetMappingController {
    constructor(private readonly empAssetMappingService: EmpAssetMappingService) { }

    @Post('createEmpAssetMapping')
    async createEmpAssetMapping(@Body() empAssetMappingDto: EmpAsssetMappingDto,): Promise<CommonResponse> {
        return this.empAssetMappingService.createEmpAssetMapping(empAssetMappingDto);
    }

    @Post('updateEmpAssetMapping')
    async updateEmpAssetMapping(employeeId: any, @Body() empAssetMappingDto: any,): Promise<CommonResponse> {
        console.log('employeeId', employeeId)
        return this.empAssetMappingService.updateEmpAssetMapping(empAssetMappingDto);
    }

    @Delete('removeEmpAssetMapping/:employeeId')
    async removeEmpAssetMapping(@Param('employeeId') employeeId: number): Promise<CommonResponse> {
        return this.empAssetMappingService.removeEmpAssetMapping(employeeId);
    }

    @Post('getAllEmpAssets')
    async getEmpAssetMappings(): Promise<CommonResponse> {
        return this.empAssetMappingService.getEmpAssetMappings();
    }
}
