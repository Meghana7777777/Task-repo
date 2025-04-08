import { ConfigDataType } from './config.interface';

export const DEFAULT_CONFIG: ConfigDataType = {
  env: 'development',
  port: 2004,
  logLevel: 'info',
  maxPayloadSize: '1000mb',
  responseTimeOut: 600,
  staticFilesFolder: 'files',
  database: {
    type: 'mysql',
    host: '139.59.79.77',
    port: 3306,
    username: 'dev_hrmsv2',
    password: 'Dev@hrmsV2',
    dbName: 'dev_hrms_ums',
    poolLimit: 20,
    charset: 'latin1_swedish_ci',
  },
  rateLimiting: {
    ttl: 60,
    limit: 10,
    maxLoginAttempts: 3,
  },
  appSepcific: {
    palletRollCapacity: 10
  },
  jwtConfig: {
    jwtSecret: 'rebats',
    jwtExpiryTime: '300s',   //seconds(15 mins)     
    refreshSecret: 'rebats_refresh',
    refreshExpiryTime: '7d',//days(one week)
    jwtByCookieOrHeader: 'cookie'
  },
  
};
