import { ActionTypeEnum } from "@hrexpert/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('non_rec_terms_logs')
export class NonRecTermsLogsEntity {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column('int', { name: 'employee_id', nullable: true })
  employeeId: number

  @Column('int', { name: 'component_id', nullable: true })
  componentId: number

  @Column('int', { name: 'non_rec_id', nullable: true })
  nonRecurringId: number

  @Column('enum', {
    name: 'action_type',
    enum: ActionTypeEnum,
    nullable: true
  })
  actionType: ActionTypeEnum;

  @Column('varchar', {
    name: "role",
    length: 50,
    nullable: true,
  })
  role: string

  @Column('json', { name: 'previous_values', nullable: true })
  previousValues: object;

  @Column('json', { name: 'updated_values', nullable: true })
  updatedValues: object;

  @Column('varchar', {
    name: "remarks",
    nullable: true,
  })
  remarks: Text

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'updated_user'
  })
  updatedUser: string | null;

}