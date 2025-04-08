import { AbstractEntity } from 'services/employee-management/src/database/common-entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { Employee } from '../../employee-onboarding/entities/employee-details.entity';

@Entity('departments')
export class DepartmentsEntity extends AbstractEntity {

    @Column('int', {
        nullable: true,
        name: 'emp_id',
    })
    empId: number

    @Column('varchar', {
        nullable: true,
        length: 300,
        name: 'name'
    })
    name: string;

    @Column('varchar', {
        nullable: true,
        length: 10,
        name: 'code'
    })
    code: string;

    @Column('varchar', {
        nullable: true,
        length: 300,
        name: 'hod'
    })
    hod: string;

    @OneToMany((type) => Employee, (employee) => employee.departmentId, { cascade: true, onUpdate: 'CASCADE',onDelete:'RESTRICT' })
    employee: Employee[];
}