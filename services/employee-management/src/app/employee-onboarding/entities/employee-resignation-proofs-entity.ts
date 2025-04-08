import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-details.entity";

@Entity('employee_resignation_proofs')
export class EmployeeResignationProofs {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column({ name: 'employee_id', type: 'int', nullable: true })
  employeeId: number;

  @Column({ name: 'employee_code', type: 'varchar', length: 20, nullable: true })
  employeeCode: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'date_of_reliving', nullable: true })
  dateOfReliving: string;

  @Column('varchar', { name: 'employee_remarks', nullable: true })
  employeeRemarks: string;

  @Column({ name: 'file_name', type: 'varchar', length: 250, nullable: false })
  fileName: string;

  @Column({ name: 'original_file_name', type: 'varchar', length: 250, nullable: false })
  originalFileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 300, nullable: false })
  filePath: string;

}