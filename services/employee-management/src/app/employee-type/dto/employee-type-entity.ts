import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity, OneToMany } from "typeorm";
import { Employee } from "../../employee-onboarding/entities/employee-details.entity";

@Entity('employee_type')
export class EmployeeType extends AbstractEntity{
    
    @Column('varchar', {
        name: 'name',
        nullable: false,
    })
    name: string;
    @OneToMany((type) => Employee, (employee) => employee.employeeTypeId, { cascade: true, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
        employee: Employee[];

}