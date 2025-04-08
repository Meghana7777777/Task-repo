import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from '../config';

export class MastersCommonAxiosService {
    URL = configVariables.APP_MASTERS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            })
    }

    // Method for making POST, PATCH or PUT, DELETE requests based on the provided config
    axiosCall = async (method: 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'GET', urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        console.log('Request URL:', this.URL + '' + urlEndPoint);
        return await AxiosInstance[method.toLowerCase()](this.URL + '' + urlEndPoint, data, config)
            .then(response => {
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            });
    }
}