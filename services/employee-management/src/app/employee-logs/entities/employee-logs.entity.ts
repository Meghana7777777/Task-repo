import { SalutationEnum } from "@hrexpert/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('employee_logs')
export class EmployeeLogsEntity {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column('int', { name: 'employee_id', nullable: true })
  employeeId: number

  @Column('varchar', {
    name: "action_type",
    length: 50,
    nullable: true,
  })
  actionType: string

  @Column('varchar', {
    name: "role",
    length: 50,
    nullable: true,
  })
  role: string

  @Column('varchar', {
    name: "previous_values",
    length: 50,
    nullable: true,
  })
  previousValues: Text

  @Column('varchar', {
    name: "updated_values",
    length: 50,
    nullable: true,
  })
  updatedValues: Text

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