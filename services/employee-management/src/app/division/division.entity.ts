
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { Employee } from "../employee-onboarding/entities/employee-details.entity";

@Entity('division')
export class Division extends AbstractEntity{
    
    @Column('varchar', {
        name: 'division_name',
        nullable: false,
    })
    divisionName: string;

    @Column('varchar', {
        name: 'division_code',
        nullable: false,
    })
    divisionCode: string;

    @OneToMany((type) => Employee, (employee) => employee.divisionId, { cascade: true, onUpdate: 'CASCADE',onDelete:'RESTRICT' })
    employee: Employee[];
}