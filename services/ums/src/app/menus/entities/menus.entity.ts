import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { ModulesEntity } from "../../modules/entities/modules.entity";
import { SubMenuEntity } from "../../sub-menus/entities/sub-menus.entity";
import { ApplicationEntity } from "../../applications/entities/application.entity";
import { IconType } from "libs/shared-models/src/lib/ums/ums-common";



@Entity('_ums_menus')
export class MenusEntity extends UMSAbstractEntity {
    @Column('varchar', { name: 'name', length: 255 })
    name: string;

    @Column('int', { name: 'order' })
    order: number;

    @Column('enum', { name: 'icon_type', enum: IconType })
    iconType: IconType;

    @Column('varchar', { name: 'icon_name', length: 50 })
    iconName: string;

    @Column('varchar', { name: 'path', length: 255 })
    path: string;
  
    @Column('varchar', { name: 'component', length: 255 })
    component: string;

    @ManyToOne(type => ModulesEntity, module => module.menus, { nullable: false })
    @JoinColumn({ name: 'module_id' })
    module: ModulesEntity;

    @ManyToOne(type => ApplicationEntity, app => app.menus, { nullable: false })
    @JoinColumn({ name: 'application_id' })
    application: ApplicationEntity;

    @OneToMany(() => SubMenuEntity, (subMenu) => subMenu.menu)
    subMenus: SubMenuEntity[];

}