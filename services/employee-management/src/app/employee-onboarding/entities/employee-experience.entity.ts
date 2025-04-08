import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-details.entity";

@Entity('employee_experience_details')
export class EmployeeExperienceDetails {
  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column({ name: 'organisation', type: 'varchar',length:60,nullable:true })
  organisation: string;

  @Column({ name: 'from_date', type: 'date',nullable:true  })
  fromDate: string;

  @Column({ name: 'to_date', type: 'date',nullable:true  }) 
  toDate: string;

  @Column({ name: 'year_of_exp', type: 'int',nullable:true  })
  yearOfExp: number;

  @Column({ name: 'file_name', type: 'varchar', length: 255,nullable:true })
  fileName: string;

  @Column({ name: 'original_file_name', type: 'varchar', length: 255,nullable:true })
  originalFileName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 255,nullable:true })
  filePath: string;

  @Column({ name: 'file_type', type: 'varchar', length: 255,nullable:true })
  fileType: string;

  @ManyToOne( type => Employee, (employee) => employee.employeeExperienceDetails)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}