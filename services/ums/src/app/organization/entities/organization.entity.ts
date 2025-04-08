import { Column, Entity, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { ClientAppsEntity } from "../../client-applications/entitys/client-apps.entity";
import { UnitEntity } from "../../units/entities/units.entity";
import { UserEntity } from "../../users/entities/users.entity";

@Entity('_ums_client')
export class Client extends UMSAbstractEntity {

    @Column('varchar', { name: 'name', length: 255 })
    name: string;

    @Column('varchar', { name: 'description', length: 255 })
    description: string;

    @OneToMany(() => UnitEntity, (units: UnitEntity) => units.client)
    units: UnitEntity[];

    @OneToMany(() => ClientAppsEntity, (units: ClientAppsEntity) => units.client)
    clientApps: ClientAppsEntity[];

    @OneToMany(() => UserEntity, (units: UserEntity) => units.client)
    user: UserEntity[];
}