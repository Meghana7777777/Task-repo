import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../database/common-entities";
import { Employee } from "../employee-onboarding/entities/employee-details.entity";

@Entity('branches')
export class Branches extends AbstractEntity {

    @Column('varchar', {
        name: 'branch_name',
        nullable: false,
    })
    branchName: string;

    @Column('varchar', {
        name: 'unit_name',
        nullable: false,
    })
    unitName: string;
    
    @Column('varchar', {
        name: 'company_name',
        nullable: false,
    })
    companyName: string;

    @Column('varchar', {
        name: 'address',
        nullable: false,
    })
    address: string;

    @Column('varchar', {
        name: 'state',
        nullable: false,
    })
    state: string;

    @Column('varchar', {
        name: 'branch_code',
        nullable: false,
    })
    branchCode: string;

    @Column('varchar', {
        name: 'is_employee',
        nullable: false,
    })
    isEmployee: number;

    @Column('varchar', {
        name: 'is_worker',
        nullable: false,
    })
    isWorker: number;

    @Column('varchar', {
        name: 'pt_applicable',
        nullable: true,
    })
    ptApplicable: string;

    @OneToMany((type) => Employee, (employee) => employee.branchId, { cascade: true, onUpdate: 'CASCADE', onDelete: 'RESTRICT' })
    employee: Employee[];

}