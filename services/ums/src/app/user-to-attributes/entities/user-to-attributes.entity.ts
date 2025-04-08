import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { UserEntity } from "../../users/entities/users.entity";


@Entity('_ums_user_to_attributes')
export class UserToAttributes extends UMSAbstractEntity{

    @Column('varchar', {
        name: 'attribute',
        length: 40
    })
    attribute: string;

    @Column('varchar', {
        name: 'value',
        length: 225
    })
    value: string;


    @ManyToOne(() => UserEntity, (user: UserEntity) => user.userAttributes, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

}

