import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UMSAbstractEntity } from "../../../database/common-entities";
import { RolesEntity } from "../../roles/entities/roles.entity";
import { UserEntity } from "../../users/entities/users.entity";

@Entity('_ums_user_roles')
export class UserRolesEntity extends UMSAbstractEntity {

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.userRoles, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @ManyToOne(() => RolesEntity, (user: RolesEntity) => user.userRoles, { nullable: false })
    @JoinColumn({ name: "role_id" })
    role: RolesEntity;

}

