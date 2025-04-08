import { AxiosRequestConfig } from 'axios';
import { CommonResponse } from 'libs/shared-models/src/lib/ums/ums-common';
import { FeatureFilesReqModel, FileUploadIdModel, GlobalResponseObject } from '@hrexpert/shared-models';
import { MastersCommonAxiosService } from '../../master/common-axios-service-ems';
import { EMSCommonAxiosService } from '../common-axios-service-ems';

export class ExpensesUploadSharedService extends EMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/expenses-files/' + childUrl;
    };

    async expensesFileUpload(req: any, config?: AxiosRequestConfig): Promise<CommonResponse> {
        console.log(req,'iiiiiiiiiiiiiiiiii');
        
        return await this.axiosPostCall(this.getURLwithMainEndPoint('expensesFileUpload'), req, config);
      }

    async deleteSingleFile(req: FileUploadIdModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('deleteSingleFile'), req, config);
    }

    async getExpenseSavedFilesData(req: FeatureFilesReqModel, config?: AxiosRequestConfig): Promise<CommonResponse> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('getExpenseSavedFilesData'), req, config);
    }
}
