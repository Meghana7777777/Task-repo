import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-details.entity";

@Entity('employee_id_proofs')
export class EmployeeIdProofs {

  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column({ name: 'employee_id', type: 'int',nullable:true })
  employeeId: number;

  @Column({ name: 'id_type', type: 'int',nullable:true })
  idType: number;

  @Column({ name: 'id_number', type: 'varchar', length: 255,nullable:true })
  idNumber: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255,nullable:true })
  fileName: string;

  @Column({ name: 'original_file_name', type: 'varchar', length: 255,nullable:true })
  originalFileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 255,nullable:true })
  filePath: string;

  @Column({ name: 'file_type', type: 'varchar', length: 255,nullable:true })
  fileType: string;

  @ManyToOne((type) => Employee, (employee) => employee.employeeIdProofs)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}