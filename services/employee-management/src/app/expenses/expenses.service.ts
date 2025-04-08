import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Express } from 'express';
import { ExpensesEntity } from './entity/expenses.entity';
import { CreateExpensesDto } from './dto/expenses-dto';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { UpdateExpensesDto } from './dto/update-expense-model.dto';
import { ExpensesFileEntity } from './entity/expenses-file.entity';
import { CommonResponseModel, ExpensesFeatures, ReferenceFeatures } from '@hrexpert/shared-models';
import { ExpensesFileRepository } from './repo/expenses-file.repository';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesEntity)
    private readonly expensesRepository: Repository<ExpensesEntity>,
    private expensesFileRepository: ExpensesFileRepository,
    private datasource: DataSource,
  ) { }


  async createExpenseDocument(expenseDto: CreateExpensesDto): Promise<CommonResponse> {
    const currentYear = new Date().getFullYear();
    const generatedCode = await this.generateIncrementalCode();

    const expensesCode = `${expenseDto.employeeName}/${expenseDto.branch}/${currentYear}/${generatedCode}`;
    const expense = this.expensesRepository.create({
      ...expenseDto,
      expensesCode: expensesCode,
    });
    const savedExpense = await this.expensesRepository.save(expense);
    return new CommonResponse(true, 1, 'Expenses created successfully', [savedExpense]);
  }


  private async generateIncrementalCode(): Promise<string> {
    const lastExpense = await this.expensesRepository
      .createQueryBuilder('expense')
      .orderBy('expense.expensesCode', 'DESC') // Get the latest record
      .getOne();

    let lastCodeNumber = 0;
    if (lastExpense && lastExpense.expensesCode) {
      const parts = lastExpense.expensesCode.split('/');
      const lastThreeDigits = parts[parts.length - 1]; // Get the last part
      lastCodeNumber = parseInt(lastThreeDigits, 10);
    }

    lastCodeNumber++; // Increment the last number

    return lastCodeNumber.toString().padStart(3, '0'); // Ensure it's always 3 digits
  }




  async updateExpenseDocument(expensesId: number, updateExpenseDto: UpdateExpensesDto): Promise<ExpensesEntity> {
    console.log('Updating Record with Id:', expensesId);
    console.log('Update Dto:', updateExpenseDto);

    const expenses = await this.expensesRepository.findOne({ where: { expenses_id: expensesId } });
    if (!expenses) {
      throw new Error('Expenses not found');
    }
    Object.assign(expenses, updateExpenseDto);
    return this.expensesRepository.save(expenses)
  }


  async findAllExpenseDocuments(): Promise<any[]> {
    const data: any[] = await this.expensesRepository.find();

    for (const rec of data) {
      const files = await this.datasource.getRepository(ExpensesFileEntity).find({ where: { featuresRefNo: rec.expenses_id, featuresRefName: ExpensesFeatures.ER } })
      for (const file of files) {
        if (!rec.filesData) {
          rec.filesData = []
        }
        rec.filesData.push({
          fileName: file?.fileName,
          fileid: file?.fileUploadId,
          filePath: file?.filePath,
          featuresRefNo: file?.featuresRefNo
        })

      }
    }
    return data;
  }

  async findOneExpenseDocumentByid(expensesId: number): Promise<ExpensesEntity> {
    return this.expensesRepository.findOne({ where: { expenses_id: expensesId } });
  }

  async removeExpenseDocument(expensesId: number): Promise<void> {
    await this.expensesRepository.delete(expensesId);
  }

  async updateExpenseFileUpload(filesData: any, id: any): Promise<CommonResponseModel> {
    try {
      const query = await this.expensesFileRepository.findOne({ where: { fileName: filesData[0].filename } })
      if (query) {
        throw new Error("File with the same name already exists");
      }
      const fileObj = new ExpensesFileEntity();
      fileObj.featuresRefNo = id;
      fileObj.fileName = filesData[0].filename;
      fileObj.originalName = filesData[0].originalname;
      fileObj.filePath = filesData[0].path;
      fileObj.featuresRefName = ExpensesFeatures.ER
      fileObj.fileDescription = ExpensesFeatures.ER
      fileObj.type = ExpensesFeatures.ER;
      const save = await this.expensesFileRepository.save(fileObj);
      return new CommonResponseModel(true, 65433, "FileUploaded Successfully", save);
    } catch (error) {
      return new CommonResponseModel(false, 33565, error.message);
    }
  }

  async removeUploadExpenseDocument(fileid: string) {
    const findExistedFile = await this.expensesFileRepository.findOne({ where: { fileUploadId: fileid } })
    if (findExistedFile?.fileName) {
      const path = join(__dirname, '../../../', 'expenses_upload_files', findExistedFile?.fileName)
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }
    }
    return await this.expensesFileRepository.delete(fileid);
  }

}
