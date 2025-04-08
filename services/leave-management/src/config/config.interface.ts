/**
 * Configuration data for the app.
 */

export interface RedisConfig {
  host: string;
  port: string;
  ttl: number;
}

export interface TransactionalDBConfig {
  type: any;
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
  poolLimit: number;
  charset: string;
}


export interface RateLimiting {
  ttl: number,
  limit: number,
  maxLoginAttempts: number
}

export interface AppSpecificParams {
}

export interface DBNames {
  ems : string,
  lms : string,
  ums : string,
  masters:string,
  pms: string
}

export interface ConfigDataType {
  /**
   * The name of the environment.
   * @example 'test', 'development', 'staging', 'production'
   */
  env: string;

  /** The port number of the http server to listen on. */
  port: number;

  /**
   * The log level to use.
   * @example 'verbose', 'info', 'warn', 'error'
   */
  logLevel?: string;
  /**
   * The request payload max size
   */
  maxPayloadSize: string;
  /**
   * Folder for static files that needs to be served
   */
  staticFilesFolder: string;

  /**
   * 
   */
  responseTimeOut: number;

  database: TransactionalDBConfig;
  rateLimiting: RateLimiting;
  appSepcific: AppSpecificParams
  dbNames : DBNames;
}
