import { DEFAULT_CONFIG } from "./config-default";
import { ConfigDataType, DBNames } from "./config.interface";
const dBType: any = process.env[`APP_DB_TYPE`] || DEFAULT_CONFIG.database.type;
const appEnv = process.env[`APP_ENV`] || DEFAULT_CONFIG.env

const dev:DBNames = {
    ems : "dev_hrms_ems",
    lms : "dev_hrms_lms",
    ums : "dev_hrms_ums",
    masters : "dev_hrms_masters"
}

const live : DBNames = {
    ems : "hrms_ems",
    lms : "hrms_lms",
    ums : "hrms_ums",
    masters : "hrms_masters",
}

const environments : {development : DBNames,live : DBNames} = {
    development : dev,
    live : live,
}


export default (): ConfigDataType => ({
    env: process.env[`APP_ENV`] || DEFAULT_CONFIG.env,
    port: process.env[`APP_SERVER_PORT`] ? parseInt(process.env[`APP_SERVER_PORT`], 10) : DEFAULT_CONFIG.port,
    logLevel: process.env[`APP_LOGGING_MODE`] || DEFAULT_CONFIG.logLevel,
    maxPayloadSize: process.env[`APP_MAX_PAY_LOAD_SIZE`] || DEFAULT_CONFIG.maxPayloadSize,
    responseTimeOut: process.env[`APP_RESPONSE_TIME_OUT`] ? parseInt(process.env[`APP_RESPONSE_TIME_OUT`]) : DEFAULT_CONFIG.responseTimeOut,
    staticFilesFolder: process.env[`APP_FILES_STORE_FOLDER_NAME`] || DEFAULT_CONFIG.staticFilesFolder,
    database: {
        type: dBType,
        host: process.env[`APP_DB_HOST`] || DEFAULT_CONFIG.database.host,
        port: parseInt(process.env[`APP_DB_PORT`]) || DEFAULT_CONFIG.database.port,
        username: process.env[`APP_DB_USER`] || DEFAULT_CONFIG.database.username,
        password: process.env[`APP_DB_PASS`] || DEFAULT_CONFIG.database.password,
        dbName: process.env[`APP_DB_DBNAME_CPS`] || DEFAULT_CONFIG.database.dbName,
        poolLimit: parseInt(process.env[`APP_DB_POOL_LIMIT`]) || DEFAULT_CONFIG.database.poolLimit,
        charset: process.env[`APP_DB_CHARSET`] || DEFAULT_CONFIG.database.charset,
    },
    rateLimiting: {
        ttl: parseInt(process.env['APP_THROTTLE_TTL']) || DEFAULT_CONFIG.rateLimiting.ttl,
        limit: parseInt(process.env['APP_THROTTLE_LIMIT']) || DEFAULT_CONFIG.rateLimiting.limit,
        maxLoginAttempts: parseInt(process.env['APP_THROTTLE_MAX_LOGINS']) || DEFAULT_CONFIG.rateLimiting.maxLoginAttempts,
    },
    dbNames :environments[appEnv]

   
});