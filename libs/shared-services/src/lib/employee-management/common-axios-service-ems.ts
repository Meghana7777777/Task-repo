import { AxiosRequestConfig } from 'axios';
import { AxiosInstance } from '../axios-instance';
import { configVariables } from '../config';

export class EMSCommonAxiosService {
    
    URL = configVariables.APP_EMS_SERVICE_URL;
    axiosPostCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.post(this.URL + '' + urlEndPoint, data, config)
        .then(response => {
                console.log(configVariables.APP_EMS_SERVICE_URL,'ems service url')
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            })
    }

    axiosGetCall = async (urlEndPoint: string, data?: any, config?: AxiosRequestConfig) => {
        return await AxiosInstance.get(this.URL + '' + urlEndPoint, config)
        .then(response => {
                console.log(configVariables.APP_EMS_SERVICE_URL,'ems service url')
                if (response && (response.status >= 200 && response.status < 300)) {
                    return response.data;
                } else {
                    throw response;
                }
            }).catch(err => {
                throw new Error(err.message);
            })
    }

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