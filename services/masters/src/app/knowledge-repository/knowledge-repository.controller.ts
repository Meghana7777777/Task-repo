import { Controller, Get, Post, Body, Param, Put, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentService } from './knolwedge-repository.service';
import { CreateDocumentDto } from './dto/create-model-doc.dto';
import { CommonResponse, GlobalResponseObject } from 'libs/shared-models/src/lib/ums/ums-common';
import { UpdateDocumentDto } from './dto/update-model.doc';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService,
        private applicationExceptionHandler: ApplicationExceptionHandler
    ) { }

    // Create a new document
    @Post('createDocument')
    create(@Body() createDocumentDto: CreateDocumentDto): Promise<CommonResponse> {
        console.log('ppppppppppp', createDocumentDto)
        return this.documentService.createDocument(createDocumentDto);

    }

    // Update a document
    @Put('updateDocument/:id')
    update(@Param('id') id: number, @Body() updateDocumentDto: UpdateDocumentDto) {
        return this.documentService.updateDocument(id, updateDocumentDto);
    }

    // Get all documents
    @Post('getDocuments')
    findAll() {
        return this.documentService.findAllDocuments();
    }

    // Get a document by ID
    @Get('getDocument/:id')
    findOne(@Param('id') id: number) {
        return this.documentService.findOneDocumentByid(id);
    }

    // Delete a document by ID
    @Delete('deleteDocument/:id')
    remove(@Param('id') id: number) {
        return this.documentService.removeDocument(id);
    }

    @Post('/updateFileUpload')
    @UseInterceptors(FilesInterceptor('file', 10, {
        storage: diskStorage({
            destination: join(__dirname, '../../../', 'kr_upload_images'),
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
    async updateFileUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<any> {
        try {
            return await this.documentService.updateFileUpload(file, uploadData.id)
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponse, error);
        }
    }

    @Delete('removeKRUploadDocument/:fileid')
    async removeKRUploadDocument(@Param('fileid') fileid: string) {
        try {
            const deleteResult = await this.documentService.removeKRUploadDocument(fileid);

            return { 'File deleted successfully.': deleteResult };
        } catch (error) {
            return this.applicationExceptionHandler.returnException(CommonResponse, error);
        }
    }

}
