import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { ApplicationEntity } from "../../applications/entities/application.entity";
import { Client } from "../../organization/entities/organization.entity";
import { UnitEntity } from "../../units/entities/units.entity";

@Entity('_ums_client_applications')
export class ClientAppsEntity extends UMSAbstractEntity {

    @ManyToOne(type => ApplicationEntity, app => app.clientApps, { nullable: false })
    @JoinColumn({ name: 'application_id' })
    application: ApplicationEntity;

    @ManyToOne(() => Client, (org: Client) => org.clientApps, { nullable: false })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @ManyToOne(() => UnitEntity, (unit: UnitEntity) => unit.clientApps, { nullable: false })
    @JoinColumn({ name: 'unit_id' })
    unit:UnitEntity;
}

