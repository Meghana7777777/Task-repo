import { AxiosRequestConfig } from 'axios';
import { DocumentModelDto, ExpensesModelDto, GlobalResponseObject } from '@hrexpert/shared-models';
import { MastersCommonAxiosService } from '../../master/common-axios-service-ems';
import { EMSCommonAxiosService } from '../common-axios-service-ems';

export class ExpensesSharedService extends EMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/expenses/' + childUrl;
    }

    // Add a new document
    async createExpenseDocument(req: ExpensesModelDto, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createExpenseDocument'),
            req,
            config
        );
    }


    // Get all documents, optionally filtering by criteria like type or status
    async getAllExpenseDocuments(
        filters: { type?: string; status?: string } = {},
        config?: AxiosRequestConfig
    ): Promise<any> {
        const url = this.getURLwithMainEndPoint('findAllExpenseDocuments');
        const result = await this.axiosPostCall(url, filters, config);
        return result;
    }

    // Update a document based on document ID
    async updateDocument(req: ExpensesModelDto): Promise<GlobalResponseObject> {
        const { expenses_id, ...requestData } = req;
        const url = this.getURLwithMainEndPoint(`updateExpenseDocument/${expenses_id}`);
        return await this.axiosCall('PUT', url, requestData);
    }

    // Delete a document by its ID
    async deleteDocument(expenses_id: number): Promise<GlobalResponseObject> {
        const url = this.getURLwithMainEndPoint(`removeExpenseDocument/:${expenses_id}`);
        console.log('DELETE URL:', url);
        return await this.axiosCall('DELETE', url);
    }


    // Get document details by ID
    async getDocumentDetails(expenses_id: number): Promise<any> {
        const url = this.getURLwithMainEndPoint(`findOneExpenseDocumentByid/:${expenses_id}`);
        return await this.axiosCall('GET', url);
    }

    async getAllDocumentType(): Promise<any> {
        const url = this.getURLwithMainEndPoint(`getDocumentType`);
        return await this.axiosCall('POST', url);
    }


    async updateExpenseFileUpload(req: any): Promise<any> {
        const url = this.getURLwithMainEndPoint(`updateExpenseFileUpload`);
        return await this.axiosCall('POST', url, req);
    }


    async removeUploadExpenseDocument(fileid: string): Promise<GlobalResponseObject> {
        const url = this.getURLwithMainEndPoint(`removeUploadDocument/${fileid}`);
        console.log('DELETE URL:', url);
        return await this.axiosCall('DELETE', url);
    }

}
