import { LoanSalaryStatusEnum, LoanSalaryTypeEnum } from "libs/shared-models/src/lib/enums";
import { AbstractEntity } from "services/masters/src/database/common-entities";
import { Column, Entity } from "typeorm";

@Entity('employee_loans')
export class EmployeeLoanEntity extends AbstractEntity {

  @Column('varchar', {
    nullable: false,
    name: 'employee_code',
  })
  employeeCode: string; 

  @Column('varchar', {
    nullable: false,
    name: 'employee_name',
  })
  firstName: string; 

  @Column('varchar', {
    nullable: false,
    name: 'designation',
  })
  designation: string; 

  @Column('date', {
    nullable: false,
    name: 'date_of_joining',
  })
  dateOfJoining: Date; 

  @Column('enum', {
    nullable: false,
    name: 'type',
    enum: LoanSalaryTypeEnum, 
  })
  type: LoanSalaryTypeEnum; 

  @Column('decimal', {
    nullable: false,
    name: 'advance_amount',
    precision: 10,
    scale: 2,
  })
  advanceAmount: number; 

  @Column('int', {
    nullable: false,
    name: 'installments',
  })
  installments: number;

  @Column('date', {
    nullable: false,
    name: 'effective_from',
  })
  effectiveFrom: Date; 

  @Column('varchar', {
    nullable: true,
    name: 'purpose',
  })
  purpose: string; 

  @Column('varchar', {
    nullable: true,
    name: 'reason'
  })
    reason: string;

  @Column('decimal', {
    nullable: false,
    name: 'amount_outstanding',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amountOutstanding: number; 

  @Column('date', {
    nullable: false,
    name: 'date_of_applying',
  })
  dateOfApplying: Date; 

  @Column({
    type: 'enum',
    enum: LoanSalaryStatusEnum,
    nullable: true,
    name: 'status'
})
status: LoanSalaryStatusEnum;

  @Column('varchar', {
    nullable: true,
    name: 'hod_mail'
  })
    hodMail: string;

  @Column({
    name: 'employee_id',
    nullable: true ,
})
employeeId: number;


@Column('varchar', {
  nullable: false,
  name: 'loan_ref_no',
})
loanRefNo: string; 

}