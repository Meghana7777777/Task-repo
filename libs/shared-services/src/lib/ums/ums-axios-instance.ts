import axios, { AxiosError } from 'axios';
import { config } from './ums-config';
import axiosRetry from 'axios-retry';
// const http = require('http');
// const https = require('https');
const RETRY_CODES: string[] = config.APP_RETRY_CODES?.split(',');//network issue code
const APP_REQ_RETRY_STATUS_CODES: string[] = config.APP_REQ_RETRY_STATUS_CODES?.split(',');

export const UMSAxiosInstance = axios.create({
    //keepAlive pools and reuses TCP connections, so it's faster
    // httpAgent: new http.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 5, freeSocketTimeout: 30000 }),
    // httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 100, maxFreeSockets: 5, freeSocketTimeout: 30000 }),
});
axiosRetry(UMSAxiosInstance, {
    retries: config.APP_REQ_RETRY_MAX_ATTEMPTS, // number of retries
    retryDelay: (retryCount: number) => {
        if (retryCount === 0) return 0;
        return config.APP_REQ_RETRY_DELAY;// time interval between retries
    },
    retryCondition: (error: AxiosError) => {
        const { response, code } :any= error;
        const { status } = response || {};
        if (RETRY_CODES?.includes(code)) return true;
        if (APP_REQ_RETRY_STATUS_CODES?.includes(`${status}`)) return true;
        return false;
    },
});





