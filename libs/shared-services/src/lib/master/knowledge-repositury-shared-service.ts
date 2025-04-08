import { AxiosRequestConfig } from 'axios';
import { MastersCommonAxiosService } from './common-axios-service-ems';
import { DocumentModelDto, GlobalResponseObject } from '@hrexpert/shared-models';

export class DocumentSharedService extends MastersCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/documents/' + childUrl;
    }

    // Add a new document
    async addDocument(
        req: DocumentModelDto,
        config?: AxiosRequestConfig
    ): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(
            this.getURLwithMainEndPoint('createDocument'),
            req,
            config
        );
    }


    // Get all documents, optionally filtering by criteria like type or status
    async getDocuments(
        filters: { type?: string; status?: string } = {},
        config?: AxiosRequestConfig
    ): Promise<any> {
        const url = this.getURLwithMainEndPoint('getDocuments');
        const result = await this.axiosPostCall(url, filters, config);
        return result;
    }


    // Update a document based on document ID
    async updateDocument(req: DocumentModelDto): Promise<GlobalResponseObject> {
        const { document_id, ...requestData } = req;
        console.log('UPDATE REQUEST:', req);
        const url = this.getURLwithMainEndPoint(`updateDocument/${document_id}`);
        return await this.axiosCall('PUT', url, requestData);
    }

    // Delete a document by its ID
    async deleteDocument(document_id: number): Promise<GlobalResponseObject> {
        const url = this.getURLwithMainEndPoint(`deleteDocument/:${document_id}`);
        console.log('DELETE URL:', url);
        return await this.axiosCall('DELETE', url);
    }


    // Get document details by ID
    async getDocumentDetails(document_id: number): Promise<any> {
        const url = this.getURLwithMainEndPoint(`getDocument/:${document_id}`);
        return await this.axiosCall('GET', url);
    }

    async getAllDocumentType(): Promise<any> {
        const url = this.getURLwithMainEndPoint(`getDocumentType`);
        return await this.axiosCall('POST', url);
    }

    async updateFileUpload(req: any): Promise<any> {
        const url = this.getURLwithMainEndPoint(`updateFileUpload`);
        return await this.axiosCall('POST', url, req);
    }


    async removeKRUploadDocument(fileid: string): Promise<GlobalResponseObject> {
        const url = this.getURLwithMainEndPoint(`removeKRUploadDocument/${fileid}`);
        console.log('DELETE URL:', url);
        return await this.axiosCall('DELETE', url);
    }
}
