import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PayrollChecklistService } from './payroll-checklist.service';
import { PayrollChecklist } from './payroll-checklist.entity';
import { CommonResponseModel } from '@hrexpert/backend-utils';

@Controller('payroll-checklist')
export class PayrollChecklistController {
  applicationExceptionHandler: any;
  constructor(private readonly payrollChecklistService: PayrollChecklistService) { }

  @Post()
  async create(@Body() data: Partial<PayrollChecklist>): Promise<PayrollChecklist> {
    return this.payrollChecklistService.create(data);
  }

  @Get()
  async findAll(): Promise<PayrollChecklist[]> {
    return this.payrollChecklistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PayrollChecklist | null> {
    return this.payrollChecklistService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<PayrollChecklist>): Promise<PayrollChecklist | null> {
    return this.payrollChecklistService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: boolean }> {
    const deleted = await this.payrollChecklistService.delete(id);
    return { success: deleted };
  }

  @Post('/saveOrUpdateChecklist')
  async saveOrUpdateChecklist(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.payrollChecklistService.saveOrUpdateChecklist(req)
    }
    catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    }
  }

  @Post('/getChecklist')
  async getChecklist(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.payrollChecklistService.getChecklist(req)
    }
    catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponseModel, error);
    }
  }
}
