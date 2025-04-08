import { Module } from '@nestjs/common';
import { ClientAppsService } from './client-apps.service';
import { ClientAppsController } from './client-apps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAppsEntity } from './entitys/client-apps.entity';
import { ClientAppsRepository } from './repositories/client-apps.repo';
import { ClientAppsAdapter } from './adapters/client-apps.adapter';
import { ApplicationExceptionHandler } from '@hrexpert/backend-utils';

@Module({
  imports: [TypeOrmModule.forFeature([ClientAppsEntity])],
  controllers: [ClientAppsController],
  providers: [ClientAppsService, ClientAppsRepository, ClientAppsAdapter,ApplicationExceptionHandler]
})
export class ClientAppsModule { }
