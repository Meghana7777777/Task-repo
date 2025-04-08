import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { ScopesEntity } from "../../scopes/entites/scopes.entity";
import { RolePermissionEntity } from "../../role-permissions/entities/role-permissions.entity";
import { SubMenuEntity } from "../../sub-menus/entities/sub-menus.entity";
import { ApplicationEntity } from "../../applications/entities/application.entity";
import { ModulesEntity } from "../../modules/entities/modules.entity";
import { UserPermissionEntity } from "../../user-permissions/entities/user-permissions.entity";


@Entity('_ums_permissions')
export class PermissionsEntity extends UMSAbstractEntity {
    @Column('varchar', { name: 'name', length: 255 })
    name: string;

    @ManyToOne(() => ScopesEntity, (scope) => scope.permissions)
    @JoinColumn({ name: "scope_id" })
    scope: ScopesEntity;

    @ManyToOne(() => SubMenuEntity, (menu) => menu.permissions, { nullable: false })
    @JoinColumn({ name: "sub_menu_id" })
    subMenu: SubMenuEntity;

    @ManyToOne(type => ApplicationEntity, app => app.subMenus, { nullable: false })
    @JoinColumn({ name: 'application_id' })
    application: ApplicationEntity;

    @ManyToOne(type => ModulesEntity, module => module.permissions, { nullable: false })
    @JoinColumn({ name: 'module_id' })
    module: ModulesEntity;

    @OneToMany(() => RolePermissionEntity, (rolePerm) => rolePerm.permission)
    rolePermissions: RolePermissionEntity[];

    @OneToMany(() => UserPermissionEntity, (userPerm) => userPerm.user)
    userPermissions: UserPermissionEntity[];

}