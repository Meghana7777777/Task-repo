import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { UMSAbstractEntity } from '../../../database/common-entities';
import { UserEntity } from './users.entity';

@Entity('_ums_users_child')
export class UserChildEntity extends UMSAbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.userChildren, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  userId: UserEntity;

  @Column('varchar', { name: 'unit_id', length: 40, nullable: true })
  unitIds: string;
}
