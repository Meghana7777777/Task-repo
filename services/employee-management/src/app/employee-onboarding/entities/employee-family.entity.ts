import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee-details.entity";

@Entity('employee_family_details')
export class EmployeeFamilyDetails {
  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column({ name: 'family_mem_name', type: 'varchar',length:100,nullable:true })
  familyMemName: string;

  @Column({ name: 'relation', type: 'int',nullable:true })
  relation: number;

  @Column({ name: 'contact_no', type: 'varchar',length:'10' ,nullable:true})
  contactNo: string;

  @Column({ name: 'family_id_type', type: 'int' ,nullable:true})
  familyIdType: number;

  @Column({ name: 'aadhaar_no', type: 'varchar',length:12 ,nullable:true})
  aadhaarNo: string;

  @ManyToOne((type) => Employee, (employee) => employee.employeeFamilyDetails)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}