import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-details.entity";

@Entity('employee_edu_details')
export class EmployeeEduDetails {
  @PrimaryGeneratedColumn("increment", { name: "id" })
  id: number;

  @Column({ name: 'emp_qualification', type: 'int',nullable:true })
  empQualification: number;

  @Column({ name: 'university', type: 'varchar',nullable:true })
  university: string;

  @Column({ name: 'college_name', type: 'varchar',nullable:true })
  collegeName: string;

  @Column({ name: 'specialization', type: 'varchar',nullable:true })
  specialization: string;

  @Column({ name: 'year_of_pass', type: 'date',nullable:true })
  yearOfPass: string;

  @Column({ name: 'percentage', type: 'int',nullable:true})
  percentage: number;

  @ManyToOne((type) => Employee, (employee) => employee.employeeEduDetails)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
