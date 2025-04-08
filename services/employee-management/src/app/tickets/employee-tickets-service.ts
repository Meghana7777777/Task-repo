import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GenericTransactionManager } from '../../database/type-orm-transactions';
import { CommonResponseModel } from '@hrexpert/backend-utils';
import { EmployeeTicketsEntity } from './entities/employee-tickets-entity';
import { configVariables } from '@hrexpert/shared-services';
import { EmployeeTicketsRepository } from './entities/employee-tickets-repo';
import { TicketStatusEnum } from '@hrexpert/shared-models';

@Injectable()
export class EmployeeTicketsService {
    constructor(
        private dataSource: DataSource,
        private employeeTicketsRepository: EmployeeTicketsRepository
    ) { }


    async createTicket(req: any): Promise<CommonResponseModel> {
        const transactionalManager = new GenericTransactionManager(this.dataSource);
        try {
            await transactionalManager.startTransaction();
            const entity = new EmployeeTicketsEntity();
            entity.employeeId = req.employeeId
            entity.category = req.category
            entity.subject = req.subject
            entity.issue = req.issue
            const save = await transactionalManager.getRepository(EmployeeTicketsEntity).save(entity)
            await transactionalManager.completeTransaction();
            if (save) {
                return new CommonResponseModel(true, 1, 'Ticket Raised successfully')
            }
        } catch (err) {
            console.error('Error Raising ticket:', err);
            await transactionalManager.releaseTransaction();
            throw err;
        }
    }

    async getTickets(req?: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeTicketsRepository.find({ where: { employeeId: req?.employeeId } })
            return new CommonResponseModel(true, 1, 'Data Retrived successfully', data)
        } catch (err) {
            console.error('Error Retrieving data:', err);
            throw err;
        }
    }

    async getAllTickets(req?: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeTicketsRepository.getAllTickets(req)
            return new CommonResponseModel(true, 1, 'Data Retrived successfully', data)
        } catch (err) {
            console.error('Error Retrieving data:', err);
            throw err;
        }
    }

    async CloseTicket(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeTicketsRepository.update({ id: req.ticketId }, { reply: req.reply, status: TicketStatusEnum.Closed })
            return new CommonResponseModel(true, 1, 'status updated successfully', data)
        } catch (err) {
            console.error('Error Retrieving data:', err);
            throw err;
        }
    }




}


