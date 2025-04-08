import { AxiosRequestConfig } from 'axios';
import { EmpAsssetMappingModel, GlobalResponseObject } from '@hrexpert/shared-models';
import { EMSCommonAxiosService } from '../common-axios-service-ems';

export class EmpAssetMappingSharedService extends EMSCommonAxiosService {
    private getURLwithMainEndPoint(childUrl: string) {
        return '/emp-asset-mapping/' + childUrl;
    }

    private ExpensesTypeController = "/emp-asset-mapping"


    async createEmpAssetMapping(empAssetMappingDto: EmpAsssetMappingModel, config?: AxiosRequestConfig): Promise<GlobalResponseObject> {
        return await this.axiosPostCall(this.getURLwithMainEndPoint('createEmpAssetMapping'),
            empAssetMappingDto,
            config
        );
    }

    async getAllEmpAssets(): Promise<any> {
        const url = this.getURLwithMainEndPoint('getAllEmpAssets');
        return await this.axiosCall('POST', url);
    }

    async updateEmpAssetMapping(req: any,): Promise<any> {
        return this.axiosPostCall(this.ExpensesTypeController + '/updateEmpAssetMapping', req);
    }

    async removeEmpAssetMapping(employeeId: number): Promise<GlobalResponseObject> {
        const url = this.getURLwithMainEndPoint(`removeEmpAssetMapping/${employeeId}`);
        console.log('DELETE URL:', url);
        return await this.axiosCall('DELETE', url);
    }

}
