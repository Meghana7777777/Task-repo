import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { Client } from "../../organization/entities/organization.entity";
import { UserEntity } from "../../users/entities/users.entity";
import { RolesEntity } from "../../roles/entities/roles.entity";
import { ClientAppsEntity } from "../../client-applications/entitys/client-apps.entity";


@Entity('_ums_units')
export class UnitEntity extends UMSAbstractEntity {
    @Column("varchar", {
        name: 'name',
        length: 225
    })
    name: string;

    @Column('varchar', {
        name: 'description',
        length: 225
    })
    description: string;

    @ManyToOne(() => Client, (org: Client) => org.units, { nullable: false })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @OneToMany(() => UserEntity, (users: UserEntity) => users.unit)
    users: UserEntity[];

    @OneToMany(() => RolesEntity, (roles) => roles.unit)
    roles: RolesEntity;

    @OneToMany(() => ClientAppsEntity, (clientApps) => clientApps.unit)
    clientApps: ClientAppsEntity;
}


