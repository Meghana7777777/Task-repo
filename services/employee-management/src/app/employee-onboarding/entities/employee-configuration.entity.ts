import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee_form_configuration')
export class EmployeeFormConfiguration {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: 'employee_type', type: 'int' })
  employeeType: number;

  @Column({ name: 'field_name', type: 'varchar' })
  fieldName: string;

  @Column({ name: 'display_name', type: 'varchar' })
  displayName: string;

  @Column({ name: 'is_optional', type: 'boolean', default: false })
  isOptional: boolean;

  @Column({ name: 'is_visible', type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ name: 'is_editable', type: 'boolean', default: true })
  isEditable: boolean;

  @Column({ name: 'display_order', type: 'int', nullable: true })
  displayOrder: number;
}
