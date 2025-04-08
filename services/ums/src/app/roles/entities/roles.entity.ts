import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { UserRolesEntity } from "../../user-roles/entitys/user-roles.entity";
import { UnitEntity } from "../../units/entities/units.entity";
import { RolePermissionEntity } from "../../role-permissions/entities/role-permissions.entity";

@Entity('_ums_roles')
export class RolesEntity extends UMSAbstractEntity {

    @Column('varchar', {
        name: 'name',
        length: 255
    })
    name: string;

    @Column('varchar', {
        name: 'description',
        length: 225
    })
    description: string;

    @ManyToOne(() => UnitEntity, (unit: UnitEntity) => unit.roles, { nullable: false })
    @JoinColumn({ name: 'unit_id' })
    unit: UnitEntity;

    @OneToMany(() => UserRolesEntity, (userRoles) => userRoles.role)
    userRoles: UserRolesEntity[];


    @OneToMany(() => RolePermissionEntity, (rolePerm) => rolePerm.role)
    rolePermissions: RolePermissionEntity[];

}