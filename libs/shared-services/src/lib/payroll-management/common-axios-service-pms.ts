import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from '../config';

export class PMSCommonAxiosService {
    URL = configVariables.APP_PMS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        const fullUrl = `${this.URL}${urlEndPoint}`;
        return await AxiosInstance.post(fullUrl, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                console.log(err);
                throw new Error(err.message);
            });
    }

}
