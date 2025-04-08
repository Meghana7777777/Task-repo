import { TicketsCategoryEnum, TicketStatusEnum } from "@hrexpert/shared-models";
import { AbstractEntity } from "services/employee-management/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('employee_tickets')
export class EmployeeTicketsEntity extends AbstractEntity {

    @Column('enum', {
        name: 'category',
        enum: TicketsCategoryEnum,
        nullable: true
    })
    category: TicketsCategoryEnum;

    @Column('varchar', {
        name: "subject",
        length: 255,
        nullable: true,
    })
    subject: string

    @Column('text', { name: 'issue', nullable: true })
    issue: string;

    @Column('enum', {
        name: 'status',
        enum: TicketStatusEnum,
        nullable: true
    })
    status: TicketStatusEnum;

    @Column('int', { name: 'employee_id', nullable: true })
    employeeId: number

    @Column('text', { name: 'reply', nullable: true })
    reply: string;

}