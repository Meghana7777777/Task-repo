import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { ApplicationEntity } from "../../applications/entities/application.entity";
import { MenusEntity } from "../../menus/entities/menus.entity";
import { PermissionsEntity } from "../../permissions/entities/permissions.entity";
import { SubMenuEntity } from "../../sub-menus/entities/sub-menus.entity";

@Entity('_ums_module')
export class ModulesEntity extends UMSAbstractEntity {

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

    @ManyToOne(type => ApplicationEntity, app => app.modules, { nullable: false })
    @JoinColumn({ name: 'application_id' })
    application: ApplicationEntity;

    @OneToMany(() => MenusEntity, (menu) => menu.module)
    menus: MenusEntity[];

    @OneToMany(() => SubMenuEntity, (subMenu) => subMenu.module)
    subMenus: SubMenuEntity[];

    @OneToMany(() => PermissionsEntity, (subMenu) => subMenu.module)
    permissions: PermissionsEntity[];
}