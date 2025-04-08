import { Injectable } from '@nestjs/common';
import { ClientAppsEntity } from '../entitys/client-apps.entity';
import { Client } from '../../organization/entities/organization.entity';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { UnitEntity } from '../../units/entities/units.entity';
import { ClientAppsDto } from '@hrexpert/shared-models';

@Injectable()
export class ClientAppsAdapter {
    convertDtoToEntity(roleDto: ClientAppsDto): ClientAppsEntity {
        const entity = new ClientAppsEntity();
        const client = new Client();
        client.id = roleDto.clientId;
        entity.client = client;
        const apps = new ApplicationEntity();
        apps.id = roleDto.appsId;
        entity.application = apps;
        const unit = new UnitEntity();
        unit.id = roleDto.unitId;
        entity.unit = unit;
        if (roleDto.clientAppsId) {
            entity.id = roleDto.clientAppsId;
        }
        return entity;
    }

    convertEntitytoDto(req: ClientAppsEntity): ClientAppsDto {
        const dto = new ClientAppsDto(undefined, undefined, req.id, req.application.id, req.unit.id, req.application.applicationName, req.client.id, req.client.name, req.isActive, req.versionFlag, undefined);
        return dto;
    }

}
