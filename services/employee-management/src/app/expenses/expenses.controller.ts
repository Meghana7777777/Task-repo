import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, Res, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { CreateExpensesDto } from './dto/expenses-dto';
import { ExpensesEntity } from './entity/expenses.entity';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { UpdateExpensesDto } from './dto/update-expense-model.dto';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@ApiTags('expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService,
    private applicationExceptionHandler: ApplicationExceptionHandler
  ) { }

  @Post('createExpenseDocument')
  create(@Body() createDocumentDto: CreateExpensesDto): Promise<CommonResponse> {
    console.log('ppppppppppp', createDocumentDto)
    return this.expensesService.createExpenseDocument(createDocumentDto);

  }

  @Post('findAllExpenseDocuments')
  findAll() {
    return this.expensesService.findAllExpenseDocuments();
  }

  @Put('updateExpenseDocument/:id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateExpensesDto) {
    const expensesId = Number(id);
    if (isNaN(expensesId)) {
      throw new BadRequestException(`Invalid ID provided: ${id}`);
    }
    return this.expensesService.updateExpenseDocument(expensesId, updateDocumentDto);
  }


  // Delete a document by ID
  @Delete('removeExpenseDocument/:id')
  remove(@Param('expensesId') expensesId: number) {
    return this.expensesService.removeExpenseDocument(expensesId);
  }

  // Get a document by ID
  @Get('findOneExpenseDocumentByid/:id')
  findOne(@Param('expensesId') expensesId: number) {
    return this.expensesService.findOneExpenseDocumentByid(expensesId);
  }

  @Post('/updateExpenseFileUpload')
  @UseInterceptors(FilesInterceptor('file', 10, {
    storage: diskStorage({
      destination: join(__dirname, '../../../', 'expenses_upload_files'),
      filename: (req, file, callback) => {
        console.log(file.originalname);
        const name = file.originalname;
        callback(null, `${name}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(xlsx|xls|pdf|jpg|png|jpeg|doc|PDF|ppt|pptx|doc|docx|csv|zip|gif)$/)) {
        return callback(new Error('Only xlsx,xls,pdf, jpg, png, doc, jpeg files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async updateExpenseFileUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<any> {
    try {
      return await this.expensesService.updateExpenseFileUpload(file, uploadData.id)
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }

  @Delete('removeUploadDocument/:fileid')
  async removeUploadDocument(@Param('fileid') fileid: string) {
    try {
      const deleteResult = await this.expensesService.removeUploadExpenseDocument(fileid);

      return { 'File deleted successfully.': deleteResult };
    } catch (error) {
      return this.applicationExceptionHandler.returnException(CommonResponse, error);
    }
  }
}
