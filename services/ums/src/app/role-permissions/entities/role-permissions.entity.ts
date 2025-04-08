import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { PermissionsEntity } from "../../permissions/entities/permissions.entity";
import { RolesEntity } from "../../roles/entities/roles.entity";

@Entity('_ums_role_permissions')
export class RolePermissionEntity extends UMSAbstractEntity {


    @ManyToOne(() => PermissionsEntity, (pr) => pr.rolePermissions, { nullable: false })
    @JoinColumn({ name: "permission_id" })
    permission: PermissionsEntity;


    @ManyToOne(() => RolesEntity, (pr) => pr.rolePermissions, { nullable: false })
    @JoinColumn({ name: "role_id" })
    role: RolesEntity;
}