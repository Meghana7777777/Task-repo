import { ComponentTypeEnum, RoundStrgEnum, TypeEnum } from "@hrexpert/shared-models";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { PayrollEmployeeComponentAmountsEntity } from "../../payroll-emp-comp-amt/entites/payroll-emp-comp-amt.entity";
import { EmpNonRecTermsEntity } from "../../payroll-records/entites/emp-non-rec-terms.entity";
import { EmpRecComponentsEntity } from "../../payroll-records/entites/emp-rec-components.entity";
import { PayrollRecordsEntity } from "../../payroll-records/entites/payroll-records.entity";
import { PayrollTypesComponentsEntity } from "./payroll-types-components.entity";

@Entity('payroll_components')
export class PayrollComponentsEntity {

    @PrimaryGeneratedColumn("increment", {
        name: "id",
    })
    id: number;

    @Column('varchar', {
        name: 'component_name',
        nullable: true,
    })
    componentName: string;

    @Column('varchar', {
        name: 'column_name',
        nullable: true,
    })
    columnName: string;

    @Column({
        name: 'column_order',
        nullable: true,
    })
    columnOrder: number;

    @Column({
        name: 'is_derived',
        nullable: true,
    })
    isDerived: boolean;

    @Column('text', {
        name: 'derived_rule',
        nullable: true,
    })
    derivedRule: Text;

    @Column('enum', {
        name: 'round_strg',
        enum: RoundStrgEnum,
        nullable: true
    })
    roundStrg: RoundStrgEnum;

    @Column('text', {
        name: 'calculated_rule',
        nullable: true,
    })
    calculatedRule: Text;

    @Column('varchar', {
        name: 'cutoff_amount',
        nullable: true,
    })
    cutoffAmount: string;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

    @Column({
        name: "eff_date",
        nullable: false
    })
    effDate: string;

    @Column('enum', {
        name: 'type',
        enum: TypeEnum,
        nullable: true
    })
    type: TypeEnum;

    @Column('enum', {
        name: 'component_type',
        enum: ComponentTypeEnum,
        nullable: true
    })
    componentType: ComponentTypeEnum;

    @Column({
        name: 'is_pf_earning',
        nullable: true,
    })
    isPfEarning: boolean;

    @Column({
        name: 'is_esi_earning',
        nullable: true,
    })
    isEsiEarning: boolean;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: string;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "created_user",
    })
    createdUser: string | null;

    @Column('int', {
        name: 'employee_type_id',
        nullable: true,
    })
    employeeTypeId: number;

    @Column('int', {
        name: 'branch_id',
        nullable: true,
    })
    branchId: number;
    
    @Column({
        name: 'is_gross_derived',
        nullable: true,
    })
    isGrossDerived: boolean;

    @UpdateDateColumn({
        name: "updated_at",
    })
    updatedAt: string;

    @Column("varchar", {
        nullable: true,
        length: 40,
        name: "updated_user",
    })
    updatedUser: string | null;

    @VersionColumn({
        default: 1,
        name: "version_flag",
    })
    versionFlag: number;

    @Column('text', {
        name: 'payroll_code',
        nullable: true,
    })
    payrollCode: Text;

    @Column('varchar', {
        name: 'payroll_type',
        nullable: true,
    })
    payrollType: string;

    @Column('varchar', {
        name: 'state',
        nullable: true,
    })
    state: string;


    @OneToMany((type) => PayrollTypesComponentsEntity, (payRollTypesComponent) => payRollTypesComponent.payRollComponent, { cascade: true })
    payRollTypesComponent: PayrollTypesComponentsEntity[]

    // @OneToMany((type) => PayrollRecordsEntity, (payRollRecords) => payRollRecords.payRollEmployees, { cascade: true })
    // payRollRecords: PayrollRecordsEntity[]

    @OneToMany((type) => PayrollEmployeeComponentAmountsEntity, (payrollEmployeeComponents) => payrollEmployeeComponents.payrollComponents, { cascade: true })
    payrollEmployeeComponents: PayrollEmployeeComponentAmountsEntity[]

    @OneToMany((type) => EmpRecComponentsEntity, (empRecComponents) => empRecComponents.payRollComponent, { cascade: true })
    empRecComponents: EmpRecComponentsEntity[]

    @OneToMany((type) => EmpNonRecTermsEntity, (empNonRecTerms) => empNonRecTerms.payRollComponent, { cascade: true })
    empNonRecTerms: EmpNonRecTermsEntity[]

    @OneToMany((type) => PayrollRecordsEntity, payRollRecordsEntity => payRollRecordsEntity.payRollComponents, { cascade: true })
    payRollRecordsEntity: PayrollRecordsEntity[]
}