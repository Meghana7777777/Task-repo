import { AxiosRequestConfig } from 'axios';
import { MastersCommonAxiosService } from './common-axios-service-ems';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { FeatureFilesReqModel, FileUploadIdModel, GlobalResponseObject } from '@hrexpert/shared-models';

export class FileHandlingService extends MastersCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/file-handling/' + childUrl;
    };


    async fileUpload(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('fileUpload'), req, config);
    };

    async deleteSingleFile(req: FileUploadIdModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSingleFile'), req, config);
    }

    async getSavedFilesData(req: FeatureFilesReqModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getSavedFilesData'), req, config);
    }
}
