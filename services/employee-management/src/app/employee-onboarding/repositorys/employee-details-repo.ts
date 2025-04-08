import { ApplyLeaveBrachDto, BankPaySharedDto, BranchReq, CommonResponseModel, DashboardReq, EmpDataReq, EmployeeBulkRequest, EmployeeCodeReq, EmployeeDetailsDto, EmployeeDocDto, EmployeeEduDetailsDto, EmployeeExperienceDetailsDto, EmployeeFamilyDetailsDto, EmployeeIdProofsDto, EmployeeMobileReq, EmployeeRMRequest, EmployeeShiftReq, GenderEnum, lateMinReq, TypeOfJoiningEnum } from "@hrexpert/shared-models";
import { EmployeeFilterReq } from "@hrexpert/shared-services";
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BranchReqDto } from "../../branches/branch-req.dto";
import { Branches } from "../../branches/branches.entity";
import { DepartmentsEntity } from "../../departments/entites/departments-entity";
import { DesignationsEntity } from "../../designations/entites/designations.entity";
import { Division } from "../../division/division.entity";
import { EmployeeType } from "../../employee-type/dto/employee-type-entity";
import { EmployeeTypeRepository } from "../../employee-type/dto/employee-type-repository";
import { IdProofRepository } from "../../id-proof/dto/id-proof-repo";
import { MemoEntity } from "../../memo/memo.entity";
import { PerformanceManagementEntity } from "../../performance-management/entites/performance-management.entity";
import { QualificationsRepository } from "../../qualifications/repositories/qualifications.repository";
import { RelationsRepository } from "../../relations/dto/relations.repo";
import { EmployeeDetailsDTO } from "../dto/emp-dto";
import { Employee } from "../entities/employee-details.entity";
import { EmployeeExperienceDetails } from "../entities/employee-experience.entity";

@Injectable()
export class EmployeeDetailRepository extends Repository<Employee> {
    private readonly dbNames: any
    constructor(@InjectRepository(Employee) private employeeDetailRepo: Repository<Employee>,
        private readonly configService: ConfigService,
        private relationRepo: RelationsRepository,
        private idproofRepo: IdProofRepository,
        private qualificationRepo: QualificationsRepository,
        private employeeTypeRepository: EmployeeTypeRepository,
    ) {
        super(employeeDetailRepo.target, employeeDetailRepo.manager, employeeDetailRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getAllEmployees(req: EmployeeFilterReq, isExcel = false): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.bank_branch AS bankBranch',
                'e.bank_eff_date AS bankEffDate',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive',
                'e.joining_status AS joinIngStatus',
                'e.mess_allowance AS messAllowance',
                'e.created_at AS createdAt',
                "CONCAT(ref_emp.first_name, ' ', ref_emp.last_name) AS referanceEmployeeName",
                'empType.name AS empTypeName',
                'empType.id AS employeeTypeIdData',
                'e.pay_mode AS payMode',
                'e.blood_group AS bloodGroup',
                'e.uan AS uan',
                'e.maritual_status AS maritualStatus',
                'e.shift AS shift',
                'e.is_pf_eligible AS isPfEligible',
                'e.is_esic_eligible AS isEsicEligible',
                'e.pf_eff_from_date AS pfEffFromDate',
                'e.esic_eff_from_date AS esicEffFromDate',
                'e.employee_status AS employeeStatus',
                'e.travelling_allownace AS travellingAllowance',
                'e.time_restrictions AS timeRestrictions',
                'e.attendence_allowance AS attnAllowance',
                'e.accomdation AS accomdation'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(Employee, 'ref_emp', 'ref_emp.id = e.referance_employee_name')
            .leftJoinAndSelect(EmployeeType, 'empType', 'empType.id = e.employee_type_id')
            // .leftJoinAndSelect('edu.employeeEduDetails', 'employeeEduDetails') 
            .leftJoinAndSelect('e.employeeEduDetails', 'edu')
            .where(`e.employee_status = 'OnRollEmployee'`);

        if (req?.departmentId) {
            queryBuilder.andWhere('dep.id = :departmentId', { departmentId: req.departmentId });
        }
        if (req?.designationId) {
            queryBuilder.andWhere('des.id = :designationId', { designationId: req.designationId });
        }
        if (req?.branchId) {
            queryBuilder.andWhere('e.branch_id= :branchId', { branchId: req.branchId });
        }
        if (req?.searchEmpCode) {
            queryBuilder.andWhere('e.employee_code = :searchEmpCode', { searchEmpCode: req.searchEmpCode });
        }
        if (req?.employeeType !== undefined) {
            if (req?.employeeType === 1) {
                queryBuilder.andWhere('e.employee_type_id = :employeeType', { employeeType: req.employeeType });
            } else if (req?.employeeType === 0) {
                queryBuilder.andWhere('e.employee_type_id != 1');
            } else {
                queryBuilder.andWhere('e.employee_type_id = :employeeType', { employeeType: req.employeeType });
            }
        }

        if (req?.reportingManagerId) {
            queryBuilder.andWhere('rm.id = :reportingManagerId', { reportingManagerId: req.reportingManagerId });
        }
        if (req?.activeInactive && req.activeInactive.length > 0) {
            queryBuilder.andWhere('e.is_active IN (:...activeInactive)', { activeInactive: req.activeInactive });
        }
        queryBuilder.orderBy('e.id', 'DESC');

        const count = await queryBuilder.getCount();
        const totalActive = await queryBuilder.clone().andWhere('e.is_active = :isActive', { isActive: true }).getCount();
        const employeesTypeCount = await queryBuilder.clone()
            .andWhere('e.is_active = :isActive', { isActive: true })
            .andWhere('empType.name = :empTypeName', { empTypeName: 'EMPLOYEE' })
            .getCount();
        const workersTypeCount = await queryBuilder.clone()
            .andWhere('e.is_active = :isActive', { isActive: true })
            .andWhere('empType.name = :empTypeName', { empTypeName: 'WORKER' })
            .getCount();
        const totalInactive = await queryBuilder.clone().andWhere('e.is_active = :isActive', { isActive: false }).getCount();
        if (req && isExcel) {
            const queryBuilder = await this.createQueryBuilder('e')
                .select([
                    'e.id AS employeeId',
                    "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                    'e.referance_employee_name AS referanceEmployeeName',
                    'e.employee_code AS employeeCode',
                    'e.salutation AS salutation',
                    'e.emp_image AS empImage',
                    'e.aadhaar_no AS aadhaarNo',
                    'e.date_of_birth AS dateOfBirth',
                    'e.gender AS gender',
                    'e.date_of_joining AS dateOfJoining',
                    'e.mobile_no AS mobileNo',
                    'e.email_id AS emailId',
                    'e.current_address AS currentAddress',
                    'e.current_state AS currentState',
                    'e.current_pincode AS currentPincode',
                    'e.permanent_address AS permanentAddress',
                    'e.permanent_state AS permanentState',
                    'e.permanent_pincode AS permanentPincode',
                    'e.salary AS salary',
                    'e.pf_no AS pfNo',
                    'e.esic_no AS esicNo',
                    'e.bank_name AS bankName',
                    'e.bank_ac_no AS bankAcNo',
                    'e.bank_ifsc_code AS bankIfscCode',
                    'e.bank_branch AS bankBranch',
                    'e.bank_eff_date AS bankEffDate',
                    'e.nominee AS nominee',
                    'e.date_of_reliving AS dateOfReliving',
                    'e.reason_of_reliving AS reasonOfReliving',
                    'b.branch_name AS branchName',
                    'dep.name AS departmentName',
                    'des.name AS designationName',
                    'divi.division_name AS divisionName',
                    'e.is_active AS isActive',
                    'e.joining_status AS joinIngStatus',
                    'e.mess_allowance AS messAllowance',
                    'e.created_at AS createdAt',
                    "CONCAT(ref_emp.first_name, ' ', ref_emp.last_name) AS referanceEmployeeName",
                    "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManager",
                    'empType.name AS empTypeName',
                    'empType.id AS employeeTypeIdData',
                    'e.pay_mode AS payMode',
                    'e.blood_group AS bloodGroup',
                    'e.uan AS uan',
                    'e.maritual_status AS maritualStatus',
                    'e.shift AS shift',
                    'e.is_pf_eligible AS isPfEligible',
                    'e.is_esic_eligible AS isEsicEligible',
                    'e.pf_eff_from_date AS pfEffFromDate',
                    'e.esic_eff_from_date AS esicEffFromDate',
                    'e.employee_status AS employeeStatus',
                    'e.travelling_allownace AS travellingAllowance',
                    'e.time_restrictions AS timeRestrictions',
                    'e.attendence_allowance AS attnAllowance',
                    'e.accomdation AS accomdation',
                ])
                .leftJoin(Branches, 'b', 'b.id = e.branch_id')
                .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
                .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
                .leftJoin(Division, 'divi', 'divi.id = e.division_id')
                .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
                .leftJoin(Employee, 'ref_emp', 'ref_emp.id = e.referance_employee_name')
                .leftJoinAndSelect(EmployeeType, 'empType', 'empType.id = e.employee_type_id')
                .where("e.employee_status = 'OnRollEmployee'")
                .orderBy('e.id', 'DESC')
            // if (req.department) {
            //     queryBuilder.andWhere('dep.name = :department', { department: req.department });
            // }
            // if (req.designation) {
            //     queryBuilder.andWhere('des.name = :designation', { designation: req.designation });
            // }
            if (req?.departmentId) {
                queryBuilder.andWhere('dep.id = :departmentId', { departmentId: req.departmentId });
            }
            if (req?.designationId) {
                queryBuilder.andWhere('des.id = :designationId', { designationId: req.designationId });
            }
            if (req?.branchId) {
                queryBuilder.andWhere('e.branch_id= :branchId', { branchId: req.branchId });
            }
            if (req?.searchEmpCode) {
                queryBuilder.andWhere('e.employee_code = :searchEmpCode', { searchEmpCode: req.searchEmpCode });
            }
            // if (req?.employeeType) {
            //     queryBuilder.andWhere('e.employee_type_id = :employeeType', { employeeType: req.employeeType });
            // }
            if (req?.employeeType !== undefined) {
                if (req?.employeeType === 1) {
                    queryBuilder.andWhere('e.employee_type_id = :employeeType', { employeeType: req.employeeType });
                } else if (req?.employeeType === 0) {
                    queryBuilder.andWhere('e.employee_type_id != 1');
                } else {
                    queryBuilder.andWhere('e.employee_type_id = :employeeType', { employeeType: req.employeeType });
                }
            }
            if (req?.activeInactive) {
                queryBuilder.andWhere('e.is_active = :activeInactive', { activeInactive: req.activeInactive });
            }

            const excelData = await queryBuilder.getRawMany();
            const count = excelData.length;
            return new CommonResponseModel(
                true,
                1111,
                'Data retrieved successfully',
                { data: excelData, total: count, totalActive, totalInactive }
            );
        }
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        queryBuilder.limit(pageSize);
        queryBuilder.offset(offset);

        const employeeData = await queryBuilder.getRawMany();
        for (const employee of employeeData) {
            employee.employeeExperienceDetails = await this.getEmployeeExperienceDetails(employee.employeeId);
            employee.employeeIdProofs = await this.getEmployeeIdProofs(employee.employeeId);
        }

        return new CommonResponseModel(true, 1111, 'Data retrieved successfully', { data: employeeData, total: count, totalActive, totalInactive, employeeData, employeesTypeCount, workersTypeCount });
    }

    async getReportingManagerWithActiveAndEmployeeRepo(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.reporting_manager AS reportingManager',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
            ])
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.reporting_manager IS NOT NULL')
            .andWhere('e.employee_type_id = 1')
            .andWhere('e.is_active = 1')
            .groupBy('e.reporting_manager')
            .addGroupBy('reportingManagerName');
        const employeesWithManagers = await queryBuilder.getRawMany();
        return employeesWithManagers;
    }


    async getAllReportingManagerAndCodeRepo(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.reporting_manager AS reportingManager',
                "CONCAT(rm.first_name, ' ', rm.last_name, '- ',rm.employee_code) AS reportingManagerName",
            ])
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.reporting_manager IS NOT NULL')
            .andWhere('e.employee_type_id = 1')
            .andWhere('e.is_active = 1')
            .groupBy('e.reporting_manager')
            .addGroupBy('reportingManagerName');
        const employeesWithManagers = await queryBuilder.getRawMany();
        return employeesWithManagers;
    }

    // async getAllActiveEmployees(): Promise<any[]> {
    async getAllActiveEmployees(req?: BranchReq): Promise<any[]> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                `CONCAT(e.first_name, ' ', e.last_name) AS employeeName`,
                'e.employee_code AS employeeCode',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS divisionId',
                'e.shift AS shift',
                'e.salary AS salary',
                'e.is_pf_eligible AS isPfEligible',
                'e.is_esic_eligible AS isEsicEligible',
                'e.attendence_allowance AS isAttnIncentive',
                'e.max_absent_days AS maxAbsentDays',
                'e.incentive_days AS incentiveDays',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'b.branch_name AS branchName',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeTypeName',
                'e.mess_allowance AS messAllowance',
                'e.pay_mode AS payMode',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where('e.id >0')
            .andWhere('e.is_active = :isActive', { isActive: 1 })

        // Execute and return the results
        if (req?.branchId) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }
        const employees = await queryBuilder.getRawMany();
        return employees;
    }

    async getInActiveEmployeeList(req?: DashboardReq): Promise<any[]> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                // 'e.emp_grade AS empGrade',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeTypeName ',
                'e.mess_allowance AS messAllowance'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.id >0')
            .andWhere('e.is_active = :isActive', { isActive: 0 })
        if (req?.branchId) {
            queryBuilder.where('e.branch_id = :branchId', { branchId: req.branchId });
        }

        // Execute and return the results
        const employees = await queryBuilder.getRawMany();
        return employees;
    }



    async getAllEmpAginstDepartment(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'dep.name AS department',
                'COUNT(e.id) AS employeeCount',
                'e.department_id AS departmentId'
            ])
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .groupBy('e.department_id');

        return await queryBuilder.getRawMany()
    }

    async getAllEmployeesData(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                // 'e.emp_grade AS empGrade',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.mess_allowance AS messAllowance'

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager');

        // Execute and return the results
        const employees = await queryBuilder.getRawMany();
        return employees;

    }

    async getAllEmployeeData(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                // 'e.emp_grade AS empGrade',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'b.id',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.mess_allowance AS messAllowance',
                'e.is_pf_eligible AS isPfEligible',
                'e.is_esic_eligible AS isEsicEligible',
                'e.employee_type_id AS employeeTypeId'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.is_active = 1')
        if (req.branchId && req.branchId !== 0) {
            queryBuilder.andWhere('b.id = :branchId', { branchId: req.branchId });
        }
        if (req.divisionName && req.divisionName !== 0) {
            queryBuilder.andWhere('e.division_id = :divisionName', { divisionName: req.divisionName });
        }
        if (req.designationId && req.designationId !== 0) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
        }
        if (req.departmentId && req.departmentId !== 0) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }
        if (req.reportingManager === 0) {
            queryBuilder.andWhere('e.reporting_manager IS NULL');
        }
        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :id', { id: req.employeeId });
        }
        return await queryBuilder.getRawMany();
    }

    async getAllReportManagerData(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'b.branch_name AS branchName',
                'b.id',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.reporting_manager')
            .groupBy('e.reporting_manager')
        if (req.branchId && req.branchId !== 0) {
            queryBuilder.andWhere('b.id = :branchId', { branchId: req.branchId });
        }
        if (req.divisionName && req.divisionName !== 0) {
            queryBuilder.andWhere('e.division_id = :divisionName', { divisionName: req.divisionName });
        }
        if (req.designationId && req.designationId !== 0) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
        }
        if (req.departmentId && req.departmentId !== 0) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }
        if (req.reportingManager === 0) {
            queryBuilder.andWhere('e.reporting_manager IS NULL');
        }
        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :id', { id: req.employeeId });
        }
        return await queryBuilder.getRawMany();
    }
    async getEmployeeWithReportingManagerRepo(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.reporting_manager AS reportingManager',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
            ])
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.reporting_manager IS NOT NULL')
            .groupBy('e.reporting_manager')
            .addGroupBy('reportingManagerName');

        // Execute and return the results
        const employeesWithManagers = await queryBuilder.getRawMany();
        return employeesWithManagers;

    }

    async updateReportingManagerRepo(req: EmployeeRMRequest): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .update(Employee)
            .set({ reportingManager: req.reportingManager })
            .where('id IN (:...ids)', { ids: req.id });

        // Execute the update query
        const result = await queryBuilder.execute();
        return result;
    }


    async getAllFirstLastNameEmpCode(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS empId',
                'e.employee_code AS employeeCode',
                'e.leave_group AS leaveGroup',
                `CONCAT(e.first_name, ' ', e.last_name) AS employeeName`,
            ]);

        const result = await queryBuilder.getRawMany();
        return result
    }
    async getAllFirstLastNameEmpCodes(req: ApplyLeaveBrachDto): Promise<any> {
        console.log(req, '--------sdsdsdsds------------')
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS empId',
                'e.employee_code AS employeeCode',
                'e.branch_id AS branchId',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeTypeName',
                'e.branch_id AS branchId',
                'e.shift AS shift',
                'br.branch_name AS branchName',
                'e.leave_group AS leaveGroupId',
                'e.leaves_allocated AS leavesAllocatedId',
                `CONCAT(e.first_name, ' ', e.last_name) AS employeeName`,
            ])
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .leftJoin(Branches, 'br', 'br.id = e.branch_id');

        if (req?.branchId) {
            queryBuilder.where('e.branch_id = :branchId', { branchId: req.branchId });
        }

        if (req?.employeeTypeId !== undefined) {
            if (req?.employeeTypeId === 1) {
                queryBuilder.andWhere('e.employee_type_id = :employeeTypeId', { employeeTypeId: req.employeeTypeId });
            } else if (req?.employeeTypeId === 0) {
                queryBuilder.andWhere('e.employee_type_id != 1');
            } else {
                queryBuilder.andWhere('e.employee_type_id = :employeeTypeId', { employeeTypeId: req.employeeTypeId });
            }
        }

        // if (req?.leaveGroupId) {
        //     queryBuilder.where('e.leave_group = :leaveGroupId', { leaveGroupId: req.leaveGroupId });
        // }


        const result = await queryBuilder.getRawMany();
        return result
    }



    async getAllFirstLastNameEmpCodewithBranch(req?: DashboardReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS empId',
                'e.employeeCode AS employeeCode',
                `CONCAT(e.firstName, ' ', e.lastName) AS employeeName`,
            ]);

        if (req?.branchId) {
            queryBuilder.where('e.branch_id = :branchId', { branchId: req.branchId });
        }

        const result = await queryBuilder.getRawMany();
        return result;
    }


    async getAllEmployeesForShiftMap(req: EmployeeShiftReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.date_of_joining AS dateOfJoining',
                'e.branch_id AS branchId',
                'b.branch_name AS branchName',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS divisionName',
                'e.shift_group AS shiftGroup',
                'e.is_active AS isActive',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .where('e.id > :id', { id: 0 });

        if (req.department !== undefined) {
            queryBuilder.andWhere('e.department_id = :department', { department: req.department });
        }
        if (req.division !== undefined) {
            queryBuilder.andWhere('e.division_id = :division', { division: req.division });
        }
        if (req.branch !== undefined) {
            queryBuilder.andWhere('e.branch_id = :branch', { branch: req.branch });
        }
        if (req.shiftGroup !== undefined) {
            queryBuilder.andWhere('e.shift_group = :shiftGroup', { shiftGroup: req.shiftGroup });
        }

        return await queryBuilder.getRawMany();
    }


    async getDivisionsInEmpDetails(): Promise<any> {
        const query = `
            SELECT DISTINCT divi.id AS id, divi.division_name AS divisionName
            FROM ${this.dbNames.masters}.division divi
            INNER JOIN hrms_ems.employee e ON e.division = divi.id
            WHERE e.is_active = 1
        `;

        return await this.employeeDetailRepo.query(query);
    }

    async getBranchesInEmpDetails(): Promise<any> {
        const query = `
            SELECT DISTINCT b.id AS branchId, b.branch_name AS branchName
            FROM ${this.dbNames.masters}.branches b
            INNER JOIN hrms_ems.employee e ON e.branch = b.id
            WHERE e.is_active = 1
        `;

        return await this.employeeDetailRepo.query(query);
    }
    async getDepartmentsInEmpDetails(): Promise<any> {
        const query = `
            SELECT DISTINCT dep.id AS id, dep.name AS departmentName
            FROM dev_.departments dep 
            INNER JOIN hrms_ems.employee e ON e.department_id = dep.id
            WHERE e.is_active = 1
        `;

        return await this.employeeDetailRepo.query(query);
    }

    async getAllEmployeesTable(): Promise<EmployeeDetailsDto[]> {
        try {

            const queryBuilder = this.createQueryBuilder('e')
                .select([
                    'e.id AS id',
                    'e.aadhaarNo AS aadhaarNo',
                    'e.firstName AS firstName',
                ]);

            const result = await queryBuilder.getRawMany();
            return result.map((rec) => {
                const EmployeeFamilyDetailsDto = [];
                const EmployeeEduDetailsDto = [];
                const EmployeeExperienceDetailsDto = [];
                const EmployeeIdProofsDto = [];
                return new EmployeeDetailsDto(rec.id, rec.salutation, rec.empImage, rec.aadhaarNo, rec.firstName, rec.lastName, rec.employeeCode, rec.dateOfBirth, rec.gender, rec.departmentId,
                    rec.designationId, rec.branch, rec.division, rec.empGrade, rec.dateOfJoining, rec.mobileNo, rec.emailId, rec.qualification, rec.currentAddress, rec.rec.currentState, rec.currentVillage,
                    rec.currentPincode, rec.currentDistrict, rec.currentCountry, rec.permanentAddress, rec.permanentState, rec.permanentVillage, rec.permanentPincode, rec.permanentDistrict, rec.permanentCountry,
                    rec.salary, rec.messAllowance, rec.payMode, rec.pfNo, rec.esicNo, rec.isPfEligible, rec.isEsicEligible, rec.bankName, rec.bankBranch, rec.bankAcNo, rec.bankIfscCode,
                    rec.accommodation, rec.transportation, rec.nominee, rec.dateOfReliving, rec.reasonOfReliving, rec.isActive, rec.createdAt, rec.updatedAt, rec.createdUser, rec.updatedUser,
                    rec.shiftGroup, rec.bloodGroup, rec.maritualStatus, rec.emergencyContactNo, rec.filePath, rec.fileName, rec.originalName,
                    EmployeeFamilyDetailsDto,
                    EmployeeEduDetailsDto,
                    EmployeeExperienceDetailsDto,
                    EmployeeIdProofsDto,
                );
            })
        } catch (err) {
            console.log(err);
        }
    }

    async getBankPaymentReport(): Promise<any> {
        let query = `
            SELECT bank_name AS bankName, COUNT(bank_name) AS totalCount,SUM(salary) AS totalSalary
            FROM hrms_ems.employee 
            WHERE bank_name != ''
            GROUP BY bank_name`
        return await this.employeeDetailRepo.query(query);
    }

    async getBankPaymentChildReport(req: BankPaySharedDto): Promise<any> {
        console.log(req, '-==-=--=-==-')
        let query = `SELECT e.employee_code AS empCode,CONCAT(e.first_name) AS empName, e.mobile_no AS mobNo,e.salary,e.bank_name AS bankName, 
        e.bank_ac_no AS bankAccNo ,e.bank_ifsc_code AS bankIfscNo, d.name AS deptName
        FROM hrms_ems.employee  e
        LEFT JOIN hrms_masters.departments d ON d.id = e.id
                WHERE e.bank_name != ''`

        if (req.bankName) {
            query += ` AND e.bank_name = '${req.bankName}'`
        }
        query += ` ORDER BY e.id`;

        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.employeeCode AS empCode',
                `CONCAT(e.firstName) AS empName`,
                'e.mobileNo AS mobNo',
                'COUNT(e.bankName) AS total',
                'e.bankName AS bankName',
                'e.bankAcNo AS bankAccNo',
                'e.bankIfscCode AS bankIfscNo',
                'd.name AS deptName',
            ])
            .leftJoin(DepartmentsEntity, 'd', 'd.id = e.departmentId')
            .where('e.bankName != :empty', { empty: '' })
            .groupBy('e.bankName')
            .orderBy('e.id');

        return await queryBuilder.getRawMany();
    }

    async totalEmpCount(req: DashboardReq): Promise<any> {
        let query = `SELECT COUNT(employee_code) AS totalEmp,COUNT(CASE WHEN gender = '${GenderEnum.M}' THEN 1 END) AS maleCount, COUNT(CASE WHEN gender = '${GenderEnum.F}' THEN 1 END) AS femaleCount 
        FROM ${this.dbNames.ems}.employee
        WHERE 1=1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}`
        return await this.employeeDetailRepo.query(query);
    }

    async totalActiveEmpCount(req: DashboardReq): Promise<any> {
        let query = `SELECT COUNT(employee_code) AS totalEmp,COUNT(CASE WHEN gender = '${GenderEnum.M}' THEN 1 END) AS maleCount, COUNT(CASE WHEN gender = '${GenderEnum.F}' THEN 1 END) AS femaleCount 
        FROM ${this.dbNames.ems}.employee
        WHERE is_active = 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}`
        return await this.employeeDetailRepo.query(query);
    }

    async totalInActiveEmpCount(req: DashboardReq): Promise<any> {
        let query = `SELECT COUNT(employee_code) AS totalEmp,COUNT(CASE WHEN gender = '${GenderEnum.M}' THEN 1 END) AS maleCount, COUNT(CASE WHEN gender = '${GenderEnum.F}' THEN 1 END) AS femaleCount 
        FROM ${this.dbNames.ems}.employee
        WHERE is_active != 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}`
        return await this.employeeDetailRepo.query(query);
    }

    async totalNewJoins(req: DashboardReq): Promise<any> {
        let query = `SELECT 
        COUNT(employee_code) AS totalEmp,
        COUNT(CASE WHEN gender = '${GenderEnum.M}' THEN 1 END) AS maleCount,
        COUNT(CASE WHEN gender = '${GenderEnum.F}' THEN 1 END) AS femaleCount
        FROM ${this.dbNames.ems}.employee
        WHERE is_active = 1 AND date_of_joining >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}`
        return await this.employeeDetailRepo.query(query);
    }

    async totalReJoins(req: DashboardReq): Promise<any> {
        let query = `SELECT 
        COUNT(employee_code) AS totalEmp,
        COUNT(CASE WHEN gender = '${GenderEnum.M}' THEN 1 END) AS maleCount,
        COUNT(CASE WHEN gender = '${GenderEnum.F}' THEN 1 END) AS femaleCount
        FROM ${this.dbNames.ems}.employee
        WHERE is_active = 1 AND joining_status = '${TypeOfJoiningEnum.REJOIN}' ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}`
        return await this.employeeDetailRepo.query(query);
    }

    async employeeNameQuery(data: EmployeeDetailsDto): Promise<any> {
        let query = `
        SELECT emp.first_name, emp.reporting_manager AS reportingManager FROM ${this.dbNames.ems}.employee emp WHERE emp.id = "${data.id}"`
        return await this.employeeDetailRepo.query(query);
    }

    async mobileNumberQuery(data: EmployeeDetailsDto): Promise<any> {
        let query = `SELECT emp.mobile_no, emp.email_id, emp.first_name FROM ${this.dbNames.ems}.employee emp
       LEFT JOIN ${this.dbNames.lms}.apply_for_leaves al ON al.employee_id = emp.id
       WHERE emp.id = "${data.reportingManager}"
       GROUP BY emp.mobile_no
       `
        return await this.employeeDetailRepo.query(query)
    }
    async getCmpCodeByEmpDetails(req: EmployeeCodeReq): Promise<any> {
        let query = `SELECT  id ,employee_code,first_name,first_name,last_name,department_id ,designation_id, division_id ,branch_id,shift FROM ${this.dbNames.ems}.employee
        WHERE employee_code = "${req.employeeCode}" `
        return await this.employeeDetailRepo.query(query)
    }

    async getAllEmployeesByBranch(req?: BranchReq): Promise<any> {
        const queryBuilder = this.employeeDetailRepo.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS employeeName",
                'e.employee_code AS employeeCode',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS divisionId',
                'e.shift AS shift',
                'e.salary AS salary',
                'e.is_pf_eligible AS isPfEligible',
                'e.is_esic_eligible AS isEsicEligible',
                'e.attendence_allowance AS isAttnIncentive',
                'e.max_absent_days AS maxAbsentDays',
                'e.incentive_days AS incentiveDays',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'b.branch_name AS branchName',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeTypeName',
                'e.mess_allowance AS messAllowance',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where('e.id >0')
        //.andWhere('e.is_active = :isActive', { isActive: 1 })

        if (req?.branchId && req?.branchId != 'All' && req.branchId !== null) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }


        return await queryBuilder.getRawMany();
    }



    async getBranchAgainstEmployees(req: BranchReqDto): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                'e.employee_code AS employeeCode',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.branch_id AS unitId',
                'b.branch_name AS branch',
                // 'dep.name AS department',
                // 'des.name AS designation',
                // 'divi.division_name AS division',
                'e.is_active AS isActive'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            // .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            // .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            // .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .where('e.branch_id = :unitId', { unitId: req.unitId }); // Use '=' for matching branchId

        const data = await queryBuilder.getRawMany();
        return data;
    }

    async attendanceWhatsappAlertCountEmployee(): Promise<any> {
        try {
            // let query = `
            //     SELECT 
            //     COUNT(*) AS totalEmployees, 
            //     s.shift_type AS shiftType
            // FROM 
            //     ${this.dbNames.ems}.employee e
            // LEFT JOIN 
            //     ${this.dbNames.masters}.shifts s ON s.id = e.department_id
            //     WHERE 
            //     s.shift_type IS NOT NULL
            // GROUP BY 
            //     s.shift_type`

            let query = `
                          SELECT 
                  COUNT(DISTINCT e.id) AS totalEmployees, 
                  COALESCE(tc.shift_code, 'Others') AS shiftCode,
                  COALESCE(tc.shift, 'Others') AS shift,
                  COALESCE(s.shift_type, 'Others') AS shiftType,
                  e.shift_group,
                  br.branch_name AS branchName
              FROM 
                  ${this.dbNames.ems}.employee e
                  LEFT JOIN ${this.dbNames.lms}.attendance a ON a.emp_id = e.id
                  LEFT JOIN ${this.dbNames.lms}.team_calender tc ON tc.id = e.shift_group
                  LEFT JOIN ${this.dbNames.masters}.shifts s ON s.id = tc.shift
                  LEFT JOIN ${this.dbNames.masters}.branches br ON br.id = e.branch_id
              GROUP BY 
                  br.branch_name,
                  e.shift_group,
                  COALESCE(tc.shift_code, 'Others'),
                  COALESCE(tc.shift, 'Others'),
                  COALESCE(s.shift_type, 'Others');
              `
            console.log(query, 'query');
            return await this.employeeDetailRepo.query(query)
        } catch (err) {
            console.log(err);
        }
    }
    async getEmpTenureByGender(req: DashboardReq): Promise<any> {
        let query = `
            SELECT
            t.tenure,
            IFNULL(SUM(CASE WHEN e.gender = '${GenderEnum.M}' THEN 1 ELSE 0 END), 0) AS male,
            IFNULL(SUM(CASE WHEN e.gender = '${GenderEnum.F}' THEN 1 ELSE 0 END), 0) AS female,
            IFNULL(SUM(CASE WHEN e.gender NOT IN ('${GenderEnum.M}', '${GenderEnum.F}') THEN 1 ELSE 0 END), 0) AS others,
            IFNULL(COUNT(e.id), 0) AS total
        FROM (
            SELECT '0-1' AS tenure
            UNION ALL SELECT '1-2'
            UNION ALL SELECT '2-3'
            UNION ALL SELECT '3-5'
            UNION ALL SELECT '5-10'
            UNION ALL SELECT '10+'
        ) t
        LEFT JOIN ${this.dbNames.ems}.employee e ON t.tenure = CASE
            WHEN TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 1 THEN '0-1'
            WHEN TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) BETWEEN 1 AND 2 THEN '1-2'
            WHEN TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) BETWEEN 2 AND 3 THEN '2-3'
            WHEN TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) BETWEEN 3 AND 5 THEN '3-5'
            WHEN TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) BETWEEN 5 AND 10 THEN '5-10'
            ELSE '10+'
        END AND e.is_active = 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}
        GROUP BY t.tenure
        ORDER BY FIELD(t.tenure, '0-1', '1-2', '2-3', '3-5', '5-10', '10+')`
        return await this.employeeDetailRepo.query(query)
    }

    async getEmpGenderAge(req: DashboardReq): Promise<any> {
        let query = `
        WITH AgeGroups AS (
            SELECT '18-24' AS ageGroup
            UNION ALL SELECT '25-34'
            UNION ALL SELECT '35-44'
            UNION ALL SELECT '45-54'
            UNION ALL SELECT '55+'
        ),
        Genders AS(SELECT DISTINCT gender FROM ${this.dbNames.ems}.employee WHERE is_active = 1),
        AgeGroupGenderCombinations AS(SELECT ag.ageGroup, g.gender FROM AgeGroups ag CROSS JOIN Genders g)
        SELECT agc.ageGroup, agc.gender, 
            COALESCE(COUNT(e.id), 0) AS count
        FROM AgeGroupGenderCombinations agc
        LEFT JOIN ${this.dbNames.ems}.employee e ON agc.gender = e.gender AND
            agc.ageGroup = 
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 18 AND 24 THEN '18-24'
                    WHEN TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
                    WHEN TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
                    WHEN TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 45 AND 54 THEN '45-54'
                    ELSE '55+'
                END
            AND e.is_active = 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}
        GROUP BY agc.ageGroup, agc.gender
        ORDER BY agc.gender, 
            CASE agc.ageGroup
                WHEN '18-24' THEN 1
                WHEN '25-34' THEN 2
                WHEN '35-44' THEN 3
                WHEN '45-54' THEN 4
                ELSE 5
            END`
        return await this.employeeDetailRepo.query(query)
    }



    // async getAllEmployeeApprovalData(): Promise<any> {
    //     let query = `SELECT  id ,employee_code AS employeeCode,first_name,first_name,last_name,department_id ,designation_id, division_id ,branch_id FROM ${this.dbNames.ems}.employee
    //     WHERE employee_status = "APPROVAL" `
    //     return await this.employeeDetailRepo.query(query)
    // }
    async getAllEmployeeApprovalData(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                'e.blood_group AS bloodGroup',
                'e.shift_group AS shiftGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.mess_allowance AS messAllowance',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
                'e.emergency_contact_no AS emergencyContactNo',
                'e.maritual_status AS maritualStatus',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'e.created_at AS createdAt'

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where(`e.employee_status = 'LessAgeLimit'`);
        // Execute and return the results
        return await queryBuilder.getRawMany();
    }


    async getAllEmpBelowAgeWorkingData(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.blood_group AS bloodGroup',
                'e.shift_group AS shiftGroup',
                'e.leaveGroup AS leaveGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.mess_allowance AS messAllowance',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
                'e.emergency_contact_no AS emergencyContactNo',
                'e.maritual_status AS maritualStatus',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'e.created_at AS createdAt'

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where(`e.employee_status = 'OnRollEmployee'`);
        // Execute and return the results
        return await queryBuilder.getRawMany();
    }

    async getAllDocEmployeeId(req: EmployeeDocDto): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                'e.employee_code AS employeeCode',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
                'e.is_active AS isActive',
                'e.branch_id AS branchId'

            ])
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
        }

        if (req.departmentId) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }

        if (req.desginationid) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.desginationid });
        }

        if (req.divisionId) {
            queryBuilder.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId });
        }

        if (req.branch && req.branch != 'All') {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branch });
        }


        queryBuilder.orderBy('e.id', 'ASC');

        const data = await queryBuilder.getRawMany();
        return data;
    }


    async getAllWeekEmployees(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.nominee AS nominee',
                'e.mess_allowance AS messAllowance',
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .where(`e.employee_status = 'OnRollEmployee'`);

        // Apply filters dynamically
        if (req.department) {
            queryBuilder.andWhere('dep.name = :department', { department: req.department });
        }
        if (req.designation) {
            queryBuilder.andWhere('des.name = :designation', { designation: req.designation });
        }
        if (req?.branchId) {
            queryBuilder.andWhere('e.branch_id= :branchId', { branchId: req.branchId });
        }
        if (req.search) {
            queryBuilder.andWhere(
                `(CONCAT(e.first_name, ' ', e.last_name) LIKE :search COLLATE utf8_general_ci)`,
                { search: `%${req.search}%` }
            );
        }
        if (req.searchEmpCode) {
            queryBuilder.andWhere(
                'e.employee_code LIKE :searchEmpCode',
                { searchEmpCode: `%${req.searchEmpCode}%` }
            );
        }

        queryBuilder.orderBy('e.id', 'ASC'); // Adjust field for ordering as needed

        // Pagination
        const page = req.page || 1;
        const pageSize = req.pageSize || 10;
        const offset = (page - 1) * pageSize;

        queryBuilder.limit(pageSize);
        queryBuilder.offset(offset)

        const data = await queryBuilder.getRawMany();
        const count = await queryBuilder.getCount();
        return { data, count }
    }

    async getDOBofEmp(req: DashboardReq): Promise<any> {
        let query = `
        SELECT e.id, CONCAT(e.first_name,'',e.last_name) AS name,e.date_of_birth AS date, d.name AS department, b.branch_name AS branchName
        FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
        LEFT JOIN ${this.dbNames.ems}.branches b on b.id = e.branch_id
        WHERE e.is_active = 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''} AND
        DATE_FORMAT(CONVERT_TZ(e.date_of_birth, '+00:00', '+05:30'), '%m-%d')
            BETWEEN DATE_FORMAT(CONVERT_TZ(CURDATE(), '+00:00', '+05:30'), '%m-%d') 
            AND DATE_FORMAT(CONVERT_TZ(DATE_ADD(CURDATE(), INTERVAL 6 DAY), '+00:00', '+05:30'), '%m-%d')
        ORDER BY MONTH(e.date_of_birth), DAY(e.date_of_birth), YEAR(e.date_of_birth)`
        return await this.employeeDetailRepo.query(query)
    }

    async sendBirthdayMessages(req: DashboardReq): Promise<any> {
        let query = `
        SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.date_of_birth AS DATE, d.name AS department, e.mobile_no AS mobileNo,TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) AS age
        FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
        WHERE DATE_FORMAT(e.date_of_birth, '%m-%d') = DATE_FORMAT(CONVERT_TZ(NOW(), '+00:00', '+05:30'), '%m-%d') AND e.is_active = 1 ${req.branchId ? `AND branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND division_id = ${req.divisionId}` : ''} ${req.departmentId ? `AND department_id = ${req.departmentId}` : ''} ${req.empTypeId ? `AND employee_type_id = ${req.empTypeId}` : ''}
        ORDER BY MONTH(e.date_of_birth), DAY(e.date_of_birth), YEAR(e.date_of_birth)`
        return await this.employeeDetailRepo.query(query)
    }


    async getAllEmployeesTableFormsRepo(req: EmployeeDetailsDto): Promise<any> {
        try {
            const queryBuilder = this.employeeDetailRepo.createQueryBuilder('employee');
            let relationQuery = `SELECT rel.id,rel.relation FROM ${this.dbNames.ems}.relations rel`
            let idProofQuery = `SELECT idp.id,idp.name FROM ${this.dbNames.ems}.id_proof idp`
            let qualificationQuery = `SELECT qal.id,qal.name FROM ${this.dbNames.ems}.qualifications qal`
            let empQuery = `SELECT emp.id,emp.employee_code,emp.reporting_manager,emp.first_name FROM ${this.dbNames.ems}.employee emp`
            queryBuilder
                .leftJoinAndSelect('employee.employeeEduDetails', 'employeeEduDetails')
                .leftJoinAndSelect('employee.employeeExperienceDetails', 'employeeExperienceDetails')
                .leftJoinAndSelect('employee.employeeIdProofs', 'employeeIdProofs')
                .leftJoinAndSelect('employee.departmentId', 'department')
                .leftJoinAndSelect('employee.designationId', 'designation')
                .leftJoinAndSelect('employee.branchId', 'branch')
                .leftJoinAndSelect('employee.divisionId', 'division')
                .leftJoinAndSelect('employee.employeeTypeId', 'employee_type')
                .leftJoinAndSelect('employee.employeeFamilyDetails', 'employeeFamilyDetails')

            if (req.departmentId) {
                queryBuilder.andWhere('employee.departmentId = :departmentId', { departmentId: req.departmentId });
            }
            if (req.divisionId) {
                queryBuilder.andWhere('employee.divisionId = :divisionId', { divisionId: req.divisionId });
            }
            if (req.designationId) {
                queryBuilder.andWhere('employee.designationId = :designationId', { designationId: req.designationId });
            }
            if (req.employeeTypeId) {
                queryBuilder.andWhere('employee.employeeTypeId = :employeeTypeId', { employeeTypeId: req.employeeTypeId });
            }
            if (req.employeeCode) {
                queryBuilder.andWhere('employee.employee_code = :employeeCode', { employeeCode: req.employeeCode });
            }
            if (req.branchId && req.branchId !== 'ALL') {
                queryBuilder.andWhere('employee.branchId = :branchId', { branchId: req.branchId });
            }
            if (req.id) {
                queryBuilder.andWhere('employee.id = :id', { id: req.id });
            }
            if (req.reportingManager) {
                queryBuilder.andWhere('employee.reporting_manager = :rm', { rm: req.reportingManager });
            }

            const excelData = await queryBuilder.getMany();
            const relationData = await this.relationRepo.query(relationQuery)
            const idProofData = await this.idproofRepo.query(idProofQuery)
            const qualificationData = await this.qualificationRepo.query(qualificationQuery)
            const allEmployees = await this.employeeDetailRepo.query(empQuery)
            const transformedExcelData = excelData.map((employee) => {
                const updatedFamilyDetails = employee.employeeFamilyDetails.map(familyDetail => {
                    const matchingRelation = relationData.find(relation => relation.id === familyDetail.relation);
                    if (matchingRelation) {
                        familyDetail.relation = matchingRelation.relation;
                    }
                    return familyDetail;
                });

                const updatedEmployeeIdProofDetails = employee.employeeIdProofs.map((idProofDeatil) => {
                    const matchingIdProof = idProofData.find(id => id.id === idProofDeatil.idType)
                    if (matchingIdProof) {
                        idProofDeatil.idType = matchingIdProof.name
                    }
                    return idProofDeatil;
                });


                const updatedEducationDetails = employee.employeeEduDetails.map((eduDeatil) => {
                    const matchingQualification = qualificationData.find(id => id.id === eduDeatil.empQualification)
                    if (matchingQualification) {
                        eduDeatil.empQualification = matchingQualification.name
                    }
                    return eduDeatil;
                });

                let reportingManagerNameData = "-";
                let reportingManagerCodeData = "-";
                const rName = employee.reportingManager;
                if (rName) {
                    const matchData = allEmployees.find(emp => emp.id === rName);
                    if (matchData) {
                        reportingManagerNameData = matchData.first_name || "-";
                        reportingManagerCodeData = matchData.employee_code || "-";
                    }
                }

                return {
                    ...employee,
                    employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
                    employeeFamilyDetails: updatedFamilyDetails,
                    employeeIdProofs: updatedEmployeeIdProofDetails,
                    employeeEduDetails: updatedEducationDetails,
                    reportingManagerName: reportingManagerNameData,
                    reportingManagerCode: reportingManagerCodeData
                };
            });

            // const excelData = await this.employeeDetailRepo.find(queryOptions);
            // const transformedExcelData = excelData.map((employee) => ({
            //     ...employee,
            //     employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
            // }));
            return transformedExcelData
        } catch (err) {
            console.error("Error fetching employee data:", err);
        }
    }

    async getReportingManagerName(req: any): Promise<any> {
        let query = `SELECT id, first_name as firstNameRM, last_name AS lastNameRM FROM ${this.dbNames.ems}.employee
        WHERE reporting_manager = "${req.employeeId}" `
        return await this.employeeDetailRepo.query(query)
    }

    async getAllEmployeesPersonalImformationManagementRepo(req: any): Promise<any> {
        try {
            const queryBuilder = this.employeeDetailRepo.createQueryBuilder('employee');
            let relationQuery = `SELECT rel.id,rel.relation FROM ${this.dbNames.ems}.relations rel`
            let idProofQuery = `SELECT idp.id,idp.name FROM ${this.dbNames.ems}.id_proof idp`
            let qualificationQuery = `SELECT qal.id,qal.name FROM ${this.dbNames.ems}.qualifications qal`
            let employeeTypeQuery = `SELECT et.id AS id, et.name AS employeTypeName FROM ${this.dbNames.ems}.employee_type et`

            queryBuilder
                .leftJoinAndSelect('employee.employeeEduDetails', 'employeeEduDetails')
                .leftJoinAndSelect('employee.employeeExperienceDetails', 'employeeExperienceDetails')
                .leftJoinAndSelect('employee.employeeIdProofs', 'employeeIdProofs')
                .leftJoinAndSelect('employee.departmentId', 'department')
                .leftJoinAndSelect('employee.designationId', 'designation')
                .leftJoinAndSelect('employee.branchId', 'branch')
                .leftJoinAndSelect('employee.divisionId', 'division')
                .leftJoinAndSelect('employee.employeeFamilyDetails', 'employeeFamilyDetails')
                .where('employee.employee_code = :employeeCode', { employeeCode: req?.employeeCode });


            const excelData = await queryBuilder.getMany();
            const relationData = await this.relationRepo.query(relationQuery)
            const idProofData = await this.idproofRepo.query(idProofQuery)
            const qualificationData = await this.qualificationRepo.query(qualificationQuery)
            const employeeTypeData = await this.employeeTypeRepository.query(employeeTypeQuery)

            const transformedExcelData = excelData.map((employee) => {
                const updatedFamilyDetails = employee.employeeFamilyDetails.map(familyDetail => {
                    const matchingRelation = relationData.find(relation => relation.id === familyDetail.relation);
                    if (matchingRelation) {
                        familyDetail.relation = matchingRelation.relation;
                    }
                    return familyDetail;
                });

                const updatedIdProofDetails = employee.employeeIdProofs.map((idProofDeatil) => {
                    const matchingIdProof = idProofData.find(id => id.id === idProofDeatil.idType)
                    if (matchingIdProof) {
                        idProofDeatil.idType = matchingIdProof.name
                    }
                    return idProofDeatil;
                });

                const updatedEducationDetails = employee.employeeEduDetails.map((eduDeatil) => {
                    const matchingQualification = qualificationData.find(id => id.id === eduDeatil.empQualification)
                    if (matchingQualification) {
                        eduDeatil.empQualification = matchingQualification.name
                    }
                    return eduDeatil;
                });


                const employeeType = employeeTypeData.find(id => id.id === employee.employeeTypeId)



                return {
                    ...employee,
                    employeeType,
                    employeeTypeData,
                    employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
                    employeeFamilyDetails: updatedFamilyDetails,
                    employeeIdProofs: updatedIdProofDetails,
                    employeeEduDetails: updatedEducationDetails,
                };
            });
            return transformedExcelData
        } catch (err) {
            console.error("Error fetching employee data:", err);
        }
    }

    async getEmployeeDetailsById(employeeId: number): Promise<EmployeeDetailsDTO | null> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.is_esic_eligible AS isEsicEligible',
                'e.is_pf_eligible AS isPfEligible',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                'e.blood_group AS bloodGroup',
                'e.shift_group AS shiftGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.current_address AS currentAddress',
                'e.current_district AS currentDistrict',
                'e.current_village AS currentVillage',
                'e.current_state AS currentState',
                'e.current_country AS currentCountry',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_district AS permanentDistrict',
                'e.permanent_state AS permanentState',
                'e.permanent_country AS permanentCountry',
                'e.permanent_pincode AS permanentPincode',
                'e.permanent_village AS permanentVillage',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.accomdation AS accomdation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'divi.id AS divisionId',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
                'e.emergency_contact_no AS emergencyContactNo',
                'e.maritual_status AS maritualStatus',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'e.employee_referance AS employeeReferance',
                'e.referance_employee_name AS referanceEmployeeName',
                'e.referance_mobile_num AS referanceMobileNumber',
                'e.referance_Name AS referanceName',
                'e.is_active AS isActive',
                'e.salary AS salary',
                'e.is_pf_eligible AS isPfEligible',
                'e.is_esic_eligible AS isEsicEligible',
                'e.attendence_allowance AS isAttnIncentive',
                'e.max_absent_days AS maxAbsentDays',
                'e.incentive_days AS incentiveDays',
                'e.mess_allowance AS messageAllowance',
                'e.mess_allowance AS messAllowance',
                'e.bank_branch AS bankBranch',
                'e.shift AS shift',
                'e.bank_eff_date AS bankEffDate',
                'e.uan AS uan',
                'e.pf_eff_from_date AS pfEffFromDate',
                'e.esic_eff_from_date AS esicEffFromDate',
                'e.prob_from_date AS probFromDate',
                'e.prob_to_date AS probToDate',
                'e.prob_period_months AS probationPeriodMonths',
                'e.prob_period_days AS probationPeriodDays',
                'e.travelling_allownace AS travellingAllowance',
                'e.date_of_re_joining AS dateOfRejoining',
                'e.trip_cost AS tripCost',
                'e.pay_mode AS payMode',
                'e.time_restrictions AS timeRestrictions',
                'e.attendence_allowance AS attendanceAllowance',
                'e.wcf AS wcf',
                'e.nssf AS nssf',
                'e.created_at AS createdAt',
            ])

            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where(`e.employee_status = 'OnRollEmployee'`)
            .andWhere('e.id = :employeeId', { employeeId });

        const employeeData = await queryBuilder.getRawOne();

        if (!employeeData) {
            return null;
        }

        const familyDetails = await this.getEmployeeFamilyDetails(employeeId);
        const eduDetails = await this.getEmployeeEduDetails(employeeId);
        const experienceDetails = await this.getEmployeeExperienceDetails(employeeId);
        const idProofs = await this.getEmployeeIdProofs(employeeId);

        const employeeDetails = new EmployeeDetailsDTO();
        Object.assign(employeeDetails, employeeData);
        employeeDetails.employeeFamilyDetails = familyDetails;
        employeeDetails.employeeEduDetails = eduDetails;
        employeeDetails.employeeExperienceDetails = experienceDetails;
        employeeDetails.employeeIdProofs = idProofs;

        return employeeDetails;
    }

    private async getEmployeeFamilyDetails(employeeId: number): Promise<EmployeeFamilyDetailsDto[]> {
        const queryBuilder = this.manager.createQueryBuilder()
            .select([
                'ef.id AS id',
                'ef.family_mem_name AS familyMemName',
                'ef.relation AS relation',
                'ef.contact_no AS contactNo',
                'ef.aadhaar_no AS aadhaarNo',
                'ef.employee_id AS employeeId',
                'ef.family_id_type AS familyIdType'
            ])
            .from('employee_family_details', 'ef')
            .where('ef.employee_id = :employeeId', { employeeId });

        const results = await queryBuilder.getRawMany();
        return results.map(result => new EmployeeFamilyDetailsDto(
            result.id,
            result.familyMemName,
            result.relation,
            result.contactNo,
            result.familyIdType,
            result.aadhaarNo,
            result.employeeId
        ));
    }

    private async getEmployeeEduDetails(employeeId: number): Promise<EmployeeEduDetailsDto[]> {
        const queryBuilder = this.manager.createQueryBuilder()
            .select([
                'ed.id AS id',
                'ed.emp_qualification AS empQualification',
                'ed.specialization AS specialization',
                'ed.year_of_pass AS yearOfPass',
                'ed.percentage AS percentage',
                'ed.university AS university',
                'ed.college_name AS collegeName',

            ])
            .from('employee_edu_details', 'ed')
            .where('ed.employee_id = :employeeId', { employeeId });

        const results = await queryBuilder.getRawMany();
        return results.map(result => new EmployeeEduDetailsDto(
            result.id,
            result.empQualification,
            result.specialization,
            result.yearOfPass,
            result.percentage, result.university, result.collegeName
        ));
    }

    private async getEmployeeExperienceDetails(employeeId: number): Promise<EmployeeExperienceDetailsDto[]> {
        const queryBuilder = this.manager.createQueryBuilder()
            .select([
                'eed.id AS id',
                'eed.organisation AS organisation',
                'eed.from_date AS fromDate',
                'eed.to_date AS toDate',
                'eed.year_of_exp AS yearOfExp',
                'eed.organisation',
                'eed.file_name AS file'
            ])
            .from('employee_experience_details', 'eed')
            .where('eed.employee_id = :employeeId', { employeeId });

        const results = await queryBuilder.getRawMany();
        return results.map(result => new EmployeeExperienceDetailsDto(
            result.id,
            result.organisation,
            result.fromDate,
            result.toDate,
            result.yearOfExp,
            result.file,
        ));
    }

    private async getEmployeeIdProofs(employeeId: number): Promise<EmployeeIdProofsDto[]> {
        const queryBuilder = this.manager.createQueryBuilder()
            .select([
                'ei.id AS id',
                'ei.employee_id AS employeeId',
                'ei.id_type AS idType',
                'ei.id_number AS idNumber',
                'ei.file_name AS file'

            ])
            .from('employee_id_proofs', 'ei')
            .where('ei.employee_id = :employeeId', { employeeId });

        const results = await queryBuilder.getRawMany();
        return results.map(result => new EmployeeIdProofsDto(
            result.id,
            result.employeeId,
            result.idType,
            result.idNumber,
            result.file,

        ));
    }

    async getAllEmpForRec(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.department_id AS departmentId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'b.branch_name AS branch',
                'dep.name AS department',
                'divi.division_name AS division',

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .where("1=1");
        if (req.branchId) {
            queryBuilder.andWhere('b.id= :branchId', { branchId: req.branchId });
        }
        queryBuilder.orderBy('e.employee_code', 'ASC');
        return await queryBuilder.getRawMany();
    }

    async getAllEmpData(req: any): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS employeeName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.date_of_joining AS dateOfJoining',
                'e.email_id AS emailId',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.salary AS monthlySalary',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designation',
                'divi.division_name AS divisionName',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
        const employees = await queryBuilder.getRawMany();
        return employees;

    }

    async getDivisionByBranchId(branchId: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select(` d.id, d.division_name as divisionName, e.branch_id`)
            .leftJoin(Division, 'd', 'd.id = e.division_id')
            .where('d.is_active = 1')
            .andWhere('e.division_id IS NOT NULL')
            .groupBy('d.id')
            .orderBy('d.division_name')
        branchId ? queryBuilder.andWhere('e.branch_id = :branchId', { branchId }) : null;
        return await queryBuilder.getRawMany();
    }

    async getDepartmentByBranchId(branchId: number): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select(`d.id,d.name as departmentName, e.branch_id`)
            .leftJoin(DepartmentsEntity, 'd', 'd.id = e.department_id')
            .where('d.is_active = 1')
            .andWhere('e.department_id IS NOT NULL')
            .groupBy('d.id')
            .orderBy('d.name')
        branchId ? queryBuilder.andWhere('e.branch_id = :branchId', { branchId }) : null;
        return await queryBuilder.getRawMany();
    }


    async referenceBasedEmployeeData(req: EmpDataReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.nominee AS nominee',
                "CONCAT(re.first_name, ' ', re.last_name) AS referanceEmployeeName",
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName ",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'br.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive',
                'e.joining_status AS joinIngStatus',
                'e.referance_employee_name AS referanceEmployeeId',
                'e.referance_mobile_num AS referanceMobileNumber',
                'e.referance_Name AS referanceName',
                'e. employee_referance AS employeeReferance',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',

            ])
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .leftJoin(Branches, 'br', 'br.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 're', 're.id = e.referance_employee_name')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')



        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
        }

        if (req.departmentId) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }

        if (req.designationId) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
        }

        if (req.divisionId) {
            queryBuilder.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId });
        }

        if (req.branchId) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }


        const result = await queryBuilder.getRawMany();
        return result
    }


    async getEmpDataForLeaves(req?: EmpDataReq): Promise<any> {
        const employees = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                'e.leave_group AS leaveGroupId',
                'e.date_of_joining AS doj',
                'e.branch_id AS branchId',
                'e.designation_id AS desId',
                'e.department_id AS deptId',
                'e.gender as gender',
                'e.maritual_status AS maritalStatus',
                'e.role as role',
                'e.division_id AS divId',
            ])
            .where('e.is_active = :isActive', { isActive: 1 })
            .andWhere('e.leaves_allocated = :leavesAllocated', { leavesAllocated: 0 })
            .andWhere('e.id = :id', { id: req.employeeId })
            .andWhere('e.branch_id = :branchId', { branchId: req.branchId })
            .andWhere('e.department_id = :departmentId', { departmentId: req.departmentId })
            .andWhere('e.designation_id = :designationId', { designationId: req.designationId })
            .andWhere('e.division_id = :divisionId', { divisionId: req.divisionId })
        if (req.employeeId) {
            employees.andWhere('e.id = :id', { id: req.employeeId })
        }
        if (req.branchId) {
            employees.andWhere('e.branch_id = :branchId', { branchId: req.branchId })
        }
        if (req.departmentId) {
            employees.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId })
        }
        if (req.designationId) {
            employees.andWhere('e.designation_id = :designationId', { designationId: req.designationId })
        }
        if (req.divisionId) {
            employees.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId })
        }
        return await employees.getRawMany();
    }

    async bulkEmpActiveInactive(req: EmployeeBulkRequest): Promise<any> {
        try {
            const result = await this.createQueryBuilder()
                .update(Employee)
                .set({ isActive: req.isActive })
                .where('id IN (:...ids)', { ids: req.id })
                .execute();
            return result;
        } catch (error) {
            console.error('Error executing bulkEmpActiveInactive query:', error);
            throw new Error('Error executing bulkEmpActiveInactive query');
        }
    }
    async getAllRMUnassignedEmployeeData(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                // 'e.prefix AS prefix',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                // 'e.emp_grade AS empGrade',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                // 'e.qualification AS qualification',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                // 'e.accommodation AS accommodation',
                // 'e.transportation AS transportation',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'b.id',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.mess_allowance AS messAllowance'

            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where('e.is_active = 1')
            .andWhere('e.reporting_manager IS NULL')
        if (req.branchId && req.branchId !== 0) {
            queryBuilder.andWhere('b.id = :branchId', { branchId: req.branchId });
        }
        return await queryBuilder.getRawMany();
    }


    async getEmpByCode(req: EmployeeCodeReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.employee_code AS employeeCode',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.blood_group AS bloodGroup',
                'e.shift_group AS shiftGroup',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'divi.id AS divisionId',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
            ])

            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where(`e.employee_status = 'OnRollEmployee'`)
            .andWhere('e.employee_code = :employeeCode', { employeeCode: req.employeeCode });

        const employeeData = await queryBuilder.getRawOne();

        return employeeData;
    }

    async getEmpByContact(req: EmployeeMobileReq): Promise<any> {
        console.log('Params:', { status: 'OnRollEmployee', mobileNo: req.mobileNo });

        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.employee_code AS employeeCode',
                'e.mobile_no AS mobileNo',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS divisionId',
                'e.blood_group AS bloodGroup',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'et.name AS employeeType'
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where('CAST(TRIM(e.mobile_no) AS CHAR) = :mobileNo', { mobileNo: req.mobileNo });;

        const employeeData = await queryBuilder.getRawOne() || {};

        if (!employeeData || Object.keys(employeeData).length === 0) {
            console.log('No employee found with the given parameters');
            return null;
        }

        console.log(employeeData, "employeeData");
        return employeeData;
    }

    async getEmpDataForLateMinCal(req?: lateMinReq): Promise<any> {
        let query = `SELECT e.id AS employeeId, e.employee_code AS employeeCode, e.branch_id AS branchId, b.branch_name AS branchName, 
            e.department_id AS departmentId, d.name AS departmentName, CONCAT(e.first_name, ' ', e.last_name) AS fullName
            FROM ${this.dbNames.ems}.employee e 
            LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch_id
            LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
            LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division_id
            LEFT JOIN ${this.dbNames.ems}.designations dis ON dis.id = e.designation_id
            WHERE b.branch_name LIKE '%CORPORATE%'`;

        const queryParams: any[] = [];

        if (req.employeeId) {
            query += ` AND e.id = ?`;
            queryParams.push(req.employeeId);
        }

        if (req.employeeCode) {
            query += ` AND e.employee_code = ?`;
            queryParams.push(req.employeeCode);
        }

        if (req.branchId) {
            query += ` AND e.branch_id = ?`;
            queryParams.push(req.branchId);
        }

        if (req.departmentId) {
            query += ` AND e.department_id = ?`;
            queryParams.push(req.departmentId);
        }

        if (req.designationId) {
            query += ` AND e.designation_id = ?`;
            queryParams.push(req.designationId);
        }

        if (req.divisionId) {
            query += ` AND e.division_id = ?`;
            queryParams.push(req.divisionId);
        }

        return await this.employeeDetailRepo.query(query, queryParams);
    }


    async getOnlyRequestEmployeeId(req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS id',
                'e.id AS employeeId',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.employee_code AS employeeCode',
                'e.is_esic_eligible AS isEsicEligible',
                'e.is_pf_eligible AS isPfEligible',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'b.branch_name AS branch',
                'dep.name AS department',
                'des.name AS designation',
                'divi.division_name AS division',
                'divi.id AS divisionId',
                'e.employee_type_id AS employeeTypeId',
                'et.name AS employeeType',
                'e.is_active AS isActive',
                'e.attendence_allowance AS isAttnIncentive',
                'e.incentive_days AS incentiveDays',
                'e.mess_allowance AS messageAllowance',
                'e.pf_eff_from_date AS pfEffFromDate',
                'e.esic_eff_from_date AS esicEffFromDate',
                'e.prob_from_date AS probFromDate',
                'e.prob_to_date AS probToDate',
                'e.prob_period_months AS probationPeriodMonths',
                'e.prob_period_days AS probationPeriodDays',
                'e.travelling_allownace AS travellingAllowance',
                'e.date_of_re_joining AS dateOfRejoining',
                'e.trip_cost AS tripCost',
                'e.pay_mode AS payMode',
                'e.time_restrictions AS timeRestrictions',
                'e.wcf AS wcf',
                'e.nssf AS nssf',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .where(`e.employee_status = 'OnRollEmployee'`)
        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :id', { id: req.employeeId });
        }
        return await queryBuilder.getRawOne();
    }

    async getEmployeeDetailsByRepo(req: EmpDataReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.nominee AS nominee',
                "CONCAT(re.first_name, ' ', re.last_name) AS referanceEmployeeName",
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName ",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'br.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive',
                'e.joining_status AS joinIngStatus',
                'e.referance_employee_name AS referanceEmployeeId',
                'e.referance_mobile_num AS referanceMobileNumber',
                'e.referance_Name AS referanceName',
                'e. employee_referance AS employeeReferance'
            ])
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .leftJoin(Branches, 'br', 'br.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 're', 're.id = e.referance_employee_name')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')

        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
        }
        if (req.departmentId) {
            queryBuilder.andWhere('e.department_id = :departmentId', { departmentId: req.departmentId });
        }
        if (req.designationId) {
            queryBuilder.andWhere('e.designation_id = :designationId', { designationId: req.designationId });
        }
        if (req.divisionId) {
            queryBuilder.andWhere('e.division_id = :divisionId', { divisionId: req.divisionId });
        }
        if (req.branchId) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }
        const result = await queryBuilder.getRawMany();
        return result
    }

    async getEmpHistoryRepo(req: EmpDataReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.nominee AS nominee',
                "CONCAT(re.first_name, ' ', re.last_name) AS referanceEmployeeName",
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'empexp.year_of_exp AS yearOfExperience',
                'br.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive',
                'e.joining_status AS joinIngStatus',
                'e.referance_employee_name AS referanceEmployeeId',
                'e.referance_mobile_num AS referanceMobileNumber',
                'e.referance_Name AS referanceName',
                'e.employee_referance AS employeeReferance',
                'me.date AS memoDate',
                'me.type AS memoType',
                'me.feedback_on AS memoFeedBackOn',
                'me.employee_id AS memoEmployeeId',
                'me.description AS memoDescription',
                'me.impact_on_bussiness AS memoImpactOnBussiness',
                'me.created_at AS memoCreatedAt'
            ])
            .leftJoin(EmployeeType, 'et', 'et.id = e.employee_type_id')
            .leftJoin(Branches, 'br', 'br.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 're', 're.id = e.referance_employee_name')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(MemoEntity, 'me', 'me.employee_id = e.id')
            .leftJoin(EmployeeExperienceDetails, 'empexp', 'empexp.employee_id = e.id');

        if (req.employeeId) {
            queryBuilder.andWhere('e.id = :employeeId', { employeeId: req.employeeId });
        }
        if (req.branchId) {
            queryBuilder.andWhere('e.branch_id = :branchId', { branchId: req.branchId });
        }
        const rawResults = await queryBuilder.getRawMany();
        const employeeMap: { [key: string]: any } = {};
        rawResults.forEach((row) => {
            if (!employeeMap[row.employeeId]) {
                employeeMap[row.employeeId] = {
                    employeeId: row.employeeId,
                    fullName: row.fullName,
                    employeeCode: row.employeeCode,
                    salutation: row.salutation,
                    empImage: row.empImage,
                    aadhaarNo: row.aadhaarNo,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    dateOfBirth: row.dateOfBirth,
                    gender: row.gender,
                    departmentId: row.departmentId,
                    designationId: row.designationId,
                    branchId: row.branchId,
                    division: row.division,
                    dateOfJoining: row.dateOfJoining,
                    mobileNo: row.mobileNo,
                    emailId: row.emailId,
                    currentAddress: row.currentAddress,
                    currentState: row.currentState,
                    currentPincode: row.currentPincode,
                    permanentAddress: row.permanentAddress,
                    permanentState: row.permanentState,
                    permanentPincode: row.permanentPincode,
                    salary: row.salary,
                    pfNo: row.pfNo,
                    esicNo: row.esicNo,
                    bankName: row.bankName,
                    bankAcNo: row.bankAcNo,
                    bankIfscCode: row.bankIfscCode,
                    nominee: row.nominee,
                    referanceEmployeeName: row.referanceEmployeeName,
                    reportingManagerName: row.reportingManagerName,
                    reportingManager: row.reportingManager,
                    dateOfReliving: row.dateOfReliving,
                    reasonOfReliving: row.reasonOfReliving,
                    filePath: row.filePath,
                    fileName: row.fileName,
                    originalname: row.originalname,
                    branchName: row.branchName,
                    departmentName: row.departmentName,
                    designationName: row.designationName,
                    divisionName: row.divisionName,
                    isActive: row.isActive,
                    joinIngStatus: row.joinIngStatus,
                    referanceEmployeeId: row.referanceEmployeeId,
                    referanceMobileNumber: row.referanceMobileNumber,
                    referanceName: row.referanceName,
                    employeeReferance: row.employeeReferance,
                    yearOfExperience: row.yearOfExperience,
                    memos: []
                };
            }

            if (row.memoEmployeeId) {
                employeeMap[row.employeeId].memos.push({
                    date: row.memoDate,
                    type: row.memoType,
                    feedBackOn: row.memoFeedBackOn,
                    description: row.memoDescription,
                    impactOnBussiness: row.memoImpactOnBussiness,
                    createdAt: row.memoCreatedAt
                });
            }
        });

        return Object.values(employeeMap);
    }

    async getAllEmployeesExcel(req: EmployeeFilterReq, isExcel = false): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'e.id AS employeeId',
                "CONCAT(e.first_name, ' ', e.last_name) AS fullName",
                'e.employee_code AS employeeCode',
                'e.salutation AS salutation',
                'e.emp_image AS empImage',
                'e.aadhaar_no AS aadhaarNo',
                'e.first_name AS firstName',
                'e.last_name AS lastName',
                'e.date_of_birth AS dateOfBirth',
                'e.gender AS gender',
                'e.department_id AS departmentId',
                'e.designation_id AS designationId',
                'e.branch_id AS branchId',
                'e.division_id AS division',
                'e.leaveGroup AS leaveGroup',
                'e.date_of_joining AS dateOfJoining',
                'e.mobile_no AS mobileNo',
                'e.email_id AS emailId',
                'e.current_address AS currentAddress',
                'e.current_state AS currentState',
                'e.current_pincode AS currentPincode',
                'e.permanent_address AS permanentAddress',
                'e.permanent_state AS permanentState',
                'e.permanent_pincode AS permanentPincode',
                'e.salary AS salary',
                'e.pf_no AS pfNo',
                'e.esic_no AS esicNo',
                'e.bank_name AS bankName',
                'e.bank_ac_no AS bankAcNo',
                'e.bank_ifsc_code AS bankIfscCode',
                'e.nominee AS nominee',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                'e.reporting_manager AS reportingManager',
                'e.date_of_reliving AS dateOfReliving',
                'e.reason_of_reliving AS reasonOfReliving',
                'e.file_path AS filePath',
                'e.file_name AS fileName',
                'e.original_name AS originalname',
                'b.branch_name AS branchName',
                'dep.name AS departmentName',
                'des.name AS designationName',
                'divi.division_name AS divisionName',
                'e.is_active AS isActive',
                'e.joining_status AS joinIngStatus',
                'e.mess_allowance AS messAllowance',
                'e.created_at AS createdAt',
            ])
            .leftJoin(Branches, 'b', 'b.id = e.branch_id')
            .leftJoin(DepartmentsEntity, 'dep', 'dep.id = e.department_id')
            .leftJoin(DesignationsEntity, 'des', 'des.id = e.designation_id')
            .leftJoin(Division, 'divi', 'divi.id = e.division_id')
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .where(`e.employee_status = 'OnRollEmployee'`);

        // Apply filters dynamically
        if (req.department) {
            queryBuilder.andWhere('dep.name = :department', { department: req.department });
        }
        if (req.designation) {
            queryBuilder.andWhere('des.name = :designation', { designation: req.designation });
        }
        if (req?.branchId && req.branchId !== 'All') {
            queryBuilder.andWhere('e.branch_id= :branchId', { branchId: req.branchId });
        }
        if (req.search) {
            queryBuilder.andWhere(
                `(CONCAT(e.first_name, ' ', e.last_name) LIKE :search)`,
                { search: `%${req.search}%` }
            );
        }
        if (req.searchEmpCode) {
            queryBuilder.andWhere(
                'e.employee_code LIKE :searchEmpCode',
                { searchEmpCode: `%${req.searchEmpCode}%` }
            );
        }

        // queryBuilder.orderBy('e.id', 'ASC');
        queryBuilder.orderBy('e.id', 'DESC')
        const count = await queryBuilder.getCount();

        if (isExcel) {
            const excelData = await queryBuilder.getRawMany();
            // console.log(excelData,"excel data")
            return new CommonResponseModel(
                true,
                1111,
                'Data retrieved successfully',
                { data: excelData, total: count }
            );
        }

        // Pagination for regular API call
        const page = Number(req.page) || 1;
        const pageSize = Number(req.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        queryBuilder.limit(pageSize);
        queryBuilder.offset(offset);

        const queryData = await queryBuilder.getRawMany();

        return new CommonResponseModel(
            true,
            1111,
            'Data retrieved successfully',
            { data: queryData, total: count }
        );
    }


    async getOnlyEmployeeType(): Promise<any[]> {
        return await this.createQueryBuilder('emp')
            .leftJoin('employee_type', 'etype', 'etype.id = emp.employee_type_id')
            .where('etype.name = :type', { type: 'EMPLOYEE' })
            .select([
                'emp.id AS id',
                'emp.employee_code AS employeeCode',
                "CONCAT(emp.first_name, ' ', emp.last_name) AS employeeName",
                'etype.id AS employeeTypeId',
                'etype.name AS employeeType',
            ])
            .getRawMany();
    }

    async getAllRMAndAssignedEmployeesRepo(): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            .select([
                'COUNT(e.reporting_manager) AS employeeCount',
                "CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName",
                "rm.employee_code AS reportingManagerCode",
                "GROUP_CONCAT(e.employee_code) AS employeeCodes",
                "SUM(CASE WHEN prms.status = 'Employee Saved' THEN 1 ELSE 0 END) AS employeeSavedCount",
                "SUM(CASE WHEN prms.status = 'Employee Confirmed' THEN 1 ELSE 0 END) AS employeeConfirmedCount",
                "SUM(CASE WHEN prms.status = 'RM Saved' THEN 1 ELSE 0 END) AS rmsSavedCount",
                "SUM(CASE WHEN prms.status = 'RM Confirmed' THEN 1 ELSE 0 END) AS rmsConfirmedCount",
            ])
            .leftJoin(Employee, 'rm', 'rm.id = e.reporting_manager')
            .leftJoin(PerformanceManagementEntity, 'prms', 'prms.emp_code = e.employee_code')
            .where('e.reporting_manager IS NOT NULL')
            .groupBy('e.reporting_manager')
            .addGroupBy('rm.first_name')
            .addGroupBy('rm.last_name')
            .addGroupBy('rm.employee_code')

        const employeesWithManagers = await queryBuilder.getRawMany();
        return employeesWithManagers.map(manager => {
            const employeeCodes = manager.employeeCodes.split(',');
            const statusCount = {
                employeeSavedCount: manager.employeeSavedCount || 0,
                employeeConfirmedCount: manager.employeeConfirmedCount || 0,
                rmsSavedCount: manager.rmsSavedCount || 0,
                rmsConfirmedCount: manager.rmsConfirmedCount || 0,
                openCount: (Number(manager.employeeCount) || 0) - (Number(manager.employeeSavedCount) || 0) - (Number(manager.rmsSavedCount) || 0) + (Number(manager.employeeConfirmedCount) || 0) + (Number(manager.rmsConfirmedCount) || 0)

            };
            for (const code of employeeCodes) {
                if (!employeeCodes.includes(code)) {
                    statusCount.openCount += 1;
                }
            }
            return {
                employeeCount: manager.employeeCount,
                reportingManagerName: manager.reportingManagerName,
                reportingManagerCode: manager.reportingManagerCode,
                employeeCodes: manager.employeeCodes,
                statusCounts: statusCount
            };
        });
    }




}
