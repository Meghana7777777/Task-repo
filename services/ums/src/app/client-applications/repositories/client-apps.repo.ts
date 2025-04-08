import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ClientAppsEntity } from "../entitys/client-apps.entity";
import { AllUnitsResponseDto } from "@hrexpert/shared-models";



@Injectable()
export class ClientAppsRepository extends Repository<ClientAppsEntity>{
    constructor(private dataSource: DataSource) {
        super(ClientAppsEntity, dataSource.createEntityManager());
    }

    async getAllAppsByApplicationId(applicationId: number) {
        const queryData = await this.createQueryBuilder("ca") // Use "ca" alias for ClientAppsEntity
            .select(`ca.id, ca.application_id, ca.unit_id, u.name, c.id as clientId, c.name as clientName`)
            .leftJoin("ca.unit", "u")
            .leftJoin("ca.client", "c")
            .where(`ca.application_id = '${applicationId}'`)
            .getRawMany();
    
        const data = queryData.map((rec) => {
            return new AllUnitsResponseDto(
                rec.unitName,
                rec.application_id,
                rec.clientId,
                rec.unit_id,
                rec.name,
                rec.clientName
            );
        });
    
        return data;
    }
    
}