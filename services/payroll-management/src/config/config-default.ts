import { ConfigDataType } from './config.interface';

export const DEFAULT_CONFIG: ConfigDataType = {
  env: 'development',
  port: 2003,
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
    dbName: 'dev_hrms_pms',
    poolLimit: 20,
    charset: 'utf8_general_ci',
  },

  rateLimiting: {
    ttl: 60,
    limit: 10,
    maxLoginAttempts: 3,
  },
  appSepcific: {

  },
  dbNames: {
    ems: "",
    lms: "",
    ums: "",
    masters: "",
    pms: "",
  }
};
