import { DataSource } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';

export const dataSource = new DataSource(typeOrmConfig);
