import { Column, Entity } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";

@Entity('_ums_attributes')
export class AttributesEntity extends UMSAbstractEntity {
    @Column('varchar', {
        name: 'attribute_name',
        length: 40,
        nullable: false
    })
    attributeName: string;
}