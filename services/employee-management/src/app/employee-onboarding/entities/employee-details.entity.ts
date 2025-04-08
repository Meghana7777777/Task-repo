import { AccomdationEnum, BloodGroups, EmployeeReferenceEnum, EmployeeStatus, GenderEnum, PaymodeEnum, TypeOfJoiningEnum, YesNoEnum } from '@hrexpert/shared-models';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Branches } from '../../branches/branches.entity';
import { DepartmentsEntity } from '../../departments/entites/departments-entity';
import { DesignationsEntity } from '../../designations/entites/designations.entity';
import { Division } from '../../division/division.entity';
import { EmployeeType } from '../../employee-type/dto/employee-type-entity';
import { EmployeeEduDetails } from './employee-education.entity';
import { EmployeeExperienceDetails } from './employee-experience.entity';
import { EmployeeFamilyDetails } from './employee-family.entity';
import { EmployeeIdProofs } from './employee-idproof';
@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn("increment", { name: "id", })
  id: number;

  @Column({ name: 'salutation', type: 'varchar', nullable: true })
  salutation: string;

  @Column({ name: 'employee_code', type: 'varchar', length: 20, nullable: true })
  employeeCode: string;

  @Column({ name: 'emp_image', type: 'varchar', length: 30, nullable: true })
  empImage: string;

  @Column({ name: 'aadhaar_no', type: 'varchar', length: 12, nullable: true })
  aadhaarNo: string;

  @Column({ name: 'first_name', type: 'varchar', length: "60", nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 60, nullable: true })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'gender', type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @Column({ name: 'date_of_joining', type: 'date', nullable: true })
  dateOfJoining: string;

  @Column({ name: 'mobile_no', type: 'varchar', length: 10, nullable: true })
  mobileNo: string;

  @Column({ name: 'email_id', type: 'varchar', length: 60, nullable: true })
  emailId: string;


  @Column({ name: 'reporting_manager', type: 'int', width: 11, nullable: true })
  reportingManager: number;

  @Column({ name: 'current_address', type: 'text', nullable: true })
  currentAddress: string;

  @Column({ name: 'current_village', type: 'varchar', length: 40, nullable: true })
  currentVillage: string;

  @Column({ name: 'current_state', type: 'varchar', length: 40, nullable: true })
  currentState: string;

  @Column({ name: 'current_district', type: 'varchar', length: 40, nullable: true })
  currentDistrict: string;

  @Column({ name: 'current_country', type: 'varchar', length: 440, nullable: true })
  currentCountry: string;

  @Column({ name: 'current_pincode', type: 'varchar', length: 10, nullable: true })
  currentPincode: string;

  @Column({ name: 'permanent_address', type: 'text', nullable: true })
  permanentAddress: string;

  @Column({ name: 'permanent_state', type: 'varchar', length: 20, nullable: true })
  permanentState: string;

  @Column({ name: 'permanent_village', type: 'varchar', length: 20, nullable: true })
  permanentVillage: string;

  @Column({ name: 'permanent_district', type: 'varchar', length: 20, nullable: true })
  permanentDistrict: string;

  @Column({ name: 'permanent_country', type: 'varchar', length: 20, nullable: true })
  permanentCountry: string;

  @Column({ name: 'permanent_pincode', type: 'varchar', length: 10, nullable: true })
  permanentPincode: string;

  @Column({ name: 'salary', type: 'int', width: 11, nullable: true })
  salary: number;

  @Column({ name: 'mess_allowance', type: 'int', width: 20, nullable: true })
  messAllowance: number;

  @Column({ name: 'pf_no', type: 'varchar', length: 20, nullable: true })
  pfNo: string;

  @Column({ name: 'esic_no', type: 'varchar', length: 20, nullable: true })
  esicNo: string;

  @Column({ name: 'is_pf_eligible', nullable: true })
  isPfEligible: string;

  @Column({ name: 'is_esic_eligible', nullable: true })
  isEsicEligible: string;

  @Column({ name: 'bank_name', type: 'varchar', length: 20, nullable: true })
  bankName: string;

  @Column({ name: 'bank_branch', type: 'varchar', length: 20, nullable: true })
  bankBranch: string;

  @Column({ name: 'bank_ac_no', type: 'varchar', length: 20, nullable: true })
  bankAcNo: string;

  @Column({ name: 'bank_ifsc_code', type: 'varchar', length: 20, nullable: true })
  bankIfscCode: string;

  @Column({ name: 'nominee', type: 'varchar', length: 20, nullable: true })
  nominee: string;

  @Column({ name: 'date_of_reliving', type: 'varchar', nullable: true })
  dateOfReliving: string;

  @Column({ name: 'reason_of_reliving', type: 'varchar', length: 100, nullable: true })
  reasonOfReliving: string;

  @Column({ name: 'shift', nullable: true })
  shift: string;

  @Column({ name: 'blood_group', type: 'enum', enum: BloodGroups, nullable: true })
  bloodGroup: BloodGroups;

  @Column({ name: 'maritual_status', type: 'varchar', nullable: true })
  maritualStatus: string;

  @Column({ name: 'emergency_contact_no', type: 'varchar', length: 10, nullable: true })
  emergencyContactNo: string;

  // @Column({ name: 'employee_type_id', type: 'int', width: 11, nullable: true })
  // employeeTypeId: number;

  @Column({ name: 'salary_structure', type: 'varchar', length: 40, nullable: true })
  salaryStructure: string;

  @Column({ name: 'travelling_allownace', type: "varchar", length: 20, nullable: true })
  travellingAllowance: string;

  @Column({ name: 'time_restrictions', type: "enum", enum: YesNoEnum, nullable: true })
  timeRestrictions: YesNoEnum;

  @Column({ name: 'attendence_allowance', type: "varchar", length: 20, nullable: true })
  attendanceAllowance: string;

  @Column({ name: 'accomdation', type: 'enum', enum: AccomdationEnum, nullable: true })
  accomdation: AccomdationEnum;

  @Column({ name: 'employee_status', type: 'enum', enum: EmployeeStatus, default: "OnRollEmployee", nullable: true })
  employeeStatus: EmployeeStatus;

  @Column({ name: 'joining_status', type: 'enum', enum: TypeOfJoiningEnum, default: "NEW EMPLOYEE", nullable: true })
  joiningStatus: TypeOfJoiningEnum;
  @Column({ name: 'employee_referance', type: 'enum', enum: EmployeeReferenceEnum, nullable: true })
  employeeReferance: EmployeeReferenceEnum;

  @Column({ name: 'referance_employee_name', type: 'int', nullable: true })
  referanceEmployeeName: number;

  @Column({ name: 'referance_mobile_num', type: 'varchar', nullable: true })
  referanceMobileNumber: string;

  @Column({ name: 'employee_remarks', type: 'varchar', nullable: true })
  employeeRemarks: string;

  @Column({ name: 'role', type: 'varchar', nullable: true })
  role: string;

  @Column({ name: 'old_employee_code', type: 'json', nullable: true })
  oldEmployeeCode: object;

  @Column({ name: 'referance_Name', type: 'varchar', nullable: true })
  referanceName: string;

  @Column({ name: 'bank_eff_date', type: 'varchar', length: 20, nullable: true })
  bankEffDate: string;

  @Column({ name: 'cash_eff_date', type: 'varchar', length: 20, nullable: true })
  cashEffDate: string;

  @Column({ name: 'max_absent_days', type: 'varchar', length: 255, nullable: true })
  maxAbsentDays: string;

  @Column({ name: 'incentive_days', type: 'varchar', length: 255, nullable: true })
  incentiveDays: string;


  @Column({ name: 'is_active', type: 'boolean', nullable: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'created_user'
  })
  createdUser: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'updated_user'
  })
  updatedUser: string | null;


  @Column('varchar', {
    nullable: true,
    length: 300,
    name: 'file_path'
  })
  filePath: string;

  @Column('varchar', {
    nullable: true,
    length: 250,
    name: 'file_name'
  })
  fileName: string;

  @Column('varchar', {
    nullable: true,
    length: 250,
    name: 'original_name'
  })
  originalName: string;

  @Column({ name: 'leaves_allocated', type: 'boolean', nullable: true, default: false })
  leavesAllocated: boolean;

  @Column({ name: 'pay_mode', type: 'enum', enum: PaymodeEnum, nullable: true })
  payMode: PaymodeEnum;

  @Column({ name: 'pf_eff_from_date', type: 'varchar', length: 25, nullable: true })
  pfEffFromDate: string;

  @Column({ name: 'esic_eff_from_date', type: 'varchar', length: 25, nullable: true })
  esicEffFromDate: string;

  @Column({ name: 'trip_cost', type: 'int', nullable: true })
  tripCost: number;

  @Column({ name: 'uan', type: 'varchar', length: 255, nullable: true })
  uan: string;

  @Column({ name: 'prob_from_date', type: 'varchar', length: 255, nullable: true })
  probFromDate: string;

  @Column({ name: 'prob_to_date', type: 'varchar', length: 255, nullable: true })
  probToDate: string;

  @Column({ name: 'prob_period_months', type: 'int', nullable: true })
  probationPeriodMonths: number;

  @Column({ name: 'prob_period_days', type: 'int', nullable: true })
  probationPeriodDays: number;

  @Column({ name: 'date_of_re_joining', type: 'varchar', nullable: true })
  dateOfRejoining: string;

  @Column({ name: 'wcf', nullable: true })
  wcf: string;

  @Column({ name: 'nssf', nullable: true })
  nssf: string;

  @Column('int', { name: 'leave_group', nullable: true, })
  leaveGroup: number

  @Column({ name: 'last_attn_day', type: 'varchar', length: 255, nullable: true })
  lastAttnDay: string;

  @Column({ name: 'last_leave_day', type: 'varchar', length: 255, nullable: true })
  lastLeaveDay: string;

  // Relationships
  @OneToMany((type) => EmployeeFamilyDetails, (employeeFamilyDetails) => employeeFamilyDetails.employee, { cascade: true, onUpdate: 'CASCADE' })
  employeeFamilyDetails: EmployeeFamilyDetails[];

  @OneToMany((type) => EmployeeEduDetails, (employeeEduDetails) => employeeEduDetails.employee, { cascade: true, onUpdate: 'CASCADE' })
  employeeEduDetails: EmployeeEduDetails[];

  @OneToMany((type) => EmployeeExperienceDetails, (employeeExperienceDetails) => employeeExperienceDetails.employee, { cascade: true, onUpdate: 'CASCADE' })
  employeeExperienceDetails: EmployeeExperienceDetails[];

  @OneToMany((type) => EmployeeIdProofs, (employeeIdProofs) => employeeIdProofs.employee, { cascade: true, onUpdate: 'CASCADE' })
  employeeIdProofs: EmployeeIdProofs[];

  @ManyToOne((type) => DepartmentsEntity, (department) => department.employee)
  @JoinColumn({ name: 'department_id' })
  departmentId: DepartmentsEntity;

  @ManyToOne((type) => DesignationsEntity, (designation) => designation.employee)
  @JoinColumn({ name: 'designation_id' })
  designationId: DesignationsEntity;

  @ManyToOne((type) => Branches, (branches) => branches.employee)
  @JoinColumn({ name: 'branch_id' })
  branchId: Branches;

  @ManyToOne((type) => Division, (division) => division.employee)
  @JoinColumn({ name: 'division_id' })
  divisionId: Division;
  @ManyToOne((type) => EmployeeType, (employeeType) => employeeType.employee)
  @JoinColumn({ name: 'employee_type_id' })
  employeeTypeId: EmployeeType;

}
