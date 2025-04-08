import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
  } from '@nestjs/typeorm';
  import { DataSourceOptions } from 'typeorm';
  import 'dotenv/config';
  import { ConfigService } from '@nestjs/config';
  import configuration from '../../config/configuration';
import { AuthenticationSubscriber } from '../../app/authentications/subscribers/authentication.subscriber';
  
  const databaseConfig = configuration().database;
  export const typeOrmConfig: DataSourceOptions = {
    type: 'mysql',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.dbName,
    timezone: 'UTC',
    // host: '143.244.137.136',
    // port: 3306,
    // username: 'xpparel',
    // password: 'Schemax@23',
    // database: 'xpparel_cps_live',
    migrations: ['dist/database/migrations/*.js*{.ts,.js}'],
    extra: {
      connectionLimit: databaseConfig.poolLimit,
      charset: databaseConfig.charset
    },
    poolSize: databaseConfig.poolLimit,
    supportBigNumbers: false
  };
  
  export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
      return {
        ...typeOrmConfig,
        synchronize:false,
        logging: true,
        subscribers: [AuthenticationSubscriber],
        //namingStrategy: new SnakeNamingStrategy(),
        //logger: new QueryLogger(new PinoLogger({ pinoHttp: { level: configService.get().logLevel } })),
        autoLoadEntities: true
      }
    },
  };
  
  