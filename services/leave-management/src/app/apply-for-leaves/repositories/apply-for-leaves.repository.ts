import { ApplyForLeavesReqModel, ApplyLeavesReq, ApplyLeavesStatusReq, ApproveLeaveStatusReq } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplyForLeavesEntity } from "../entities/apply-for-leaves.entity";
import { EmployeeFilterReq } from "@hrexpert/shared-services";
import { Branches } from "services/employee-management/src/app/branches/branches.entity";
import { DepartmentsEntity } from "services/employee-management/src/app/departments/entites/departments-entity";
import { DesignationsEntity } from "services/employee-management/src/app/designations/entites/designations.entity";
import { Division } from "services/employee-management/src/app/division/division.entity";
import { Employee } from "services/employee-management/src/app/employee-onboarding/entities/employee-details.entity";


@Injectable()
export class ApplyForLeavesRepository extends Repository<ApplyForLeavesEntity> {
    private readonly dbNames: any


    constructor(@InjectRepository(ApplyForLeavesEntity) private applyForLeaveRepository: Repository<ApplyForLeavesEntity>,
        private readonly configService: ConfigService

    ) {
        super(applyForLeaveRepository.target, applyForLeaveRepository.manager, applyForLeaveRepository.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }

    async getAppliedForLeaves(req: ApplyLeavesReq): Promise<any[]> {
        let query = `SELECT 
                afl.apply_for_leaves_id AS applyForLeavesId,
                afl.employee_id AS employeeId,
                afl.employee_code AS employeeCode,
                afl.employee_name AS employeeName,
                afl.type_of_leave AS typeOfLeave,
                afl.from_date AS fromDate,
                afl.to_date AS toDate,
                afl.no_of_days AS noOfDays,
                afl.leave_reason AS leaveReason,
                afl.leave_address AS leaveAddress,
                afl.created_at AS createdAt,
                afl.created_user AS createdUser,
                afl.updated_user AS updatedUser,
                afl.version_flag,
                afl.status AS STATUS,
                tl.type_of_leave AS leaveTypeName
                FROM ${this.dbNames.lms}.apply_for_leaves afl
                LEFT JOIN ${this.dbNames.masters}.types_of_leaves tl ON tl.id = afl.type_of_leave
                 WHERE 1 = 1`;
        const replacements: any = {};
        if (req.selectedMonth !== undefined && req.selectedYear !== undefined) {
            const startOfMonth = `${req.selectedYear}-${String(req.selectedMonth).padStart(2, '0')}-01`;
            const endOfMonth = `${req.selectedYear}-${String(req.selectedMonth).padStart(2, '0')}-31`;
            query += ` AND afl.created_at BETWEEN '${startOfMonth}' AND '${endOfMonth}'`;
        }

        if (req.employeeId !== undefined) {
            query += ` AND afl.employee_id ='${req.employeeId}'`;
        }
        return await this.applyForLeaveRepository.query(query)
    }


    async getAppliedForLeavesOpen(req: ApproveLeaveStatusReq): Promise<any[]> {
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate,
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.created_at AS createdAt,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,  
        tl.leave_type_name AS leaveName,
        tl.leave_type_code AS leaveCode,
        tl.leave_type_id AS leaveTypeId,  
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName, 
        dv.division_name AS divisionName, 
        br.branch_name AS branchName,
        dg.name AS designationName,
        la.leave_group_code_id AS leaveGroupCodeId
        FROM ${this.dbNames.lms}.apply_for_leaves afl
        LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = afl.type_of_leave 
        LEFT JOIN ${this.dbNames.lms}.new_leave_allocations la ON la.employee_id = afl.employee_id AND la.leave_type_id = afl.type_of_leave
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
        WHERE afl.status ="OPEN"
        `
        if (req.departmentId) {
            query = query + ` and e.department_id = ${req.departmentId}`
        }
        if (req.desginationid) {
            query = query + ` and e.designation_id="${req.desginationid}"`
        }
        if (req.branchId) {
            query = query + ` and e.branch_id = ${req.branchId}`
        }
        if (req.employeeId) {
            query = query + ` and e.id = ${req.employeeId}`
        }
        if (req.divisionId) {
            query = query + ` and e.division_id = ${req.divisionId}`
        }
        if (req.reportingManager) {
            query = query + ` and e.reporting_manager = ${req.reportingManager}`
        }
        if (req.applyForLeavesId) {
            query = query + ` and afl.apply_for_leaves_id = ${req.applyForLeavesId}`
        }
        return await this.applyForLeaveRepository.query(query);
    }

    async getAppliedForLeavesApproved(req: ApproveLeaveStatusReq): Promise<any[]> {
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate, 
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,
        tl.leave_type_name AS leaveName,
        tl.leave_type_code AS leaveCode,
        tl.leave_type_id AS leaveTypeId,
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName,
        dg.name AS designationName,
        la.leave_group_code_id AS leaveGroupCodeId
        FROM ${this.dbNames.lms}.apply_for_leaves afl
        LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = afl.type_of_leave  
        LEFT JOIN ${this.dbNames.lms}.new_leave_allocations la ON la.employee_id = afl.employee_id AND la.leave_type_id = afl.type_of_leave
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
        WHERE afl.status ="APPROVED"
        `
        if (req.departmentId) {
            query = query + ` and e.department_id = ${req.departmentId}`
        }
        if (req.desginationid) {
            query = query + ` and e.designation_id="${req.desginationid}"`
        }
        if (req.branchId) {
            query = query + ` and e.branch_id = ${req.branchId}`
        }
        if (req.employeeId) {
            query = query + ` and e.id = ${req.employeeId}`
        }
        if (req.divisionId) {
            query = query + ` and e.division_id = ${req.divisionId}`
        }
        if (req.reportingManager) {
            query = query + ` and e.reporting_manager = ${req.reportingManager}`
        }
        if (req.applyForLeavesId) {
            query = query + ` and afl.apply_for_leaves_id = ${req.applyForLeavesId}`
        }
        return await this.applyForLeaveRepository.query(query);
    }

    async getAppliedForLeavesRejected(req: ApproveLeaveStatusReq): Promise<any[]> {
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate,
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,
        tl.leave_type_name AS leaveName,
        tl.leave_type_code AS leaveCode,
        tl.leave_type_id AS leaveTypeId,
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName,
        dg.name AS designationName,
        la.leave_group_code_id AS leaveGroupCodeId
        FROM ${this.dbNames.lms}.apply_for_leaves afl
        LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = afl.type_of_leave 
        LEFT JOIN ${this.dbNames.lms}.new_leave_allocations la ON la.employee_id = afl.employee_id AND la.leave_type_id = afl.type_of_leave
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
        WHERE afl.status ="REJECTED"
        `
        if (req.departmentId) {
            query = query + ` and e.department_id = ${req.departmentId}`
        }
        if (req.desginationid) {
            query = query + ` and e.designation_id="${req.desginationid}"`
        }
        if (req.branchId) {
            query = query + ` and e.branch_id = ${req.branchId}`
        }
        if (req.employeeId) {
            query = query + ` and e.id = ${req.employeeId}`
        }
        if (req.divisionId) {
            query = query + ` and e.division_id = ${req.divisionId}`
        }
        if (req.reportingManager) {
            query = query + ` and e.reporting_manager = ${req.reportingManager}`
        }
        if (req.applyForLeavesId) {
            query = query + ` and afl.apply_for_leaves_id = ${req.applyForLeavesId}`
        }
        return await this.applyForLeaveRepository.query(query);
    }

    async getAppliedForLeavesCancel(req: ApproveLeaveStatusReq): Promise<any[]> {
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate,
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,
        tl.leave_type_name AS leaveName,
        tl.leave_type_code AS leaveCode,
        tl.leave_type_id AS leaveTypeId,
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName,
        dg.name AS designationName,
        la.leave_group_code_id AS leaveGroupCodeId
        FROM ${this.dbNames.lms}.apply_for_leaves afl
        LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = afl.type_of_leave  
        LEFT JOIN ${this.dbNames.lms}.new_leave_allocations la ON la.employee_id = afl.employee_id AND la.leave_type_id = afl.type_of_leave
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
        WHERE afl.status ="CANCEL"
        `
        if (req.departmentId) {
            query = query + ` and e.department_id = ${req.departmentId}`
        }
        if (req.desginationid) {
            query = query + ` and e.designation_id="${req.desginationid}"`
        }
        if (req.branchId) {
            query = query + ` and e.branch_id = ${req.branchId}`
        }
        if (req.employeeId) {
            query = query + ` and e.id = ${req.employeeId}`
        }
        if (req.divisionId) {
            query = query + ` and e.division_id = ${req.divisionId}`
        }
        if (req.reportingManager) {
            query = query + ` and e.reporting_manager = ${req.reportingManager}`
        }
        return await this.applyForLeaveRepository.query(query);
    }


    async getLeaveHistory(req: { employeeId: number }): Promise<any> {
        let query = `
        SELECT 
            le.apply_for_leaves_id AS applyForLeavesId,
            le.employee_id AS employeeId,
            le.employee_code AS employeeCode,
            le.type_of_leave AS typeOfLeaveId,
            le.from_date AS fromDate,
            le.to_date AS toDate,
            le.no_of_days AS noOfDays,
            le.leave_to_day AS leaveToDay,
            le.leave_from_day AS leaveFromDay,
            le.leave_reason AS leaveReason,
            le.leave_address AS leaveAddress,
            le.created_at AS month,
            le.status AS status,
            le.remarks AS remarks,
            le.updated_at AS updatedAt,
            e.first_name AS firstName,
            t.id AS typeId,
            t.type_of_leave AS typeOfLeave
        FROM 
            ${this.dbNames.lms}.apply_for_leaves le
        LEFT JOIN 
            ${this.dbNames.ems}.employee e ON e.id = le.employee_id
        LEFT JOIN 
            ${this.dbNames.masters}.types_of_leaves t ON le.type_of_leave = t.id
        WHERE 
            1 = 1
    `;

        if (req.employeeId) {
            query += ` AND le.employee_id = ${req.employeeId}`;
        }
        try {
            const result = await this.query(query);  // this.query() is specific to TypeORM
            return result;
        } catch (error) {
            console.error("Error fetching leave history:", error);
            throw new Error("Unable to fetch leave history");
        }
    }


    async getAppliedForLeavesIdById(req): Promise<any[]> {
        const { applyForLeavesId } = req;
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate,
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,
        tl.leave_type_name AS leaveName,
        tl.leave_type_code AS leaveCode,
        tl.leave_type_id AS leaveTypeId,
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName,
        dg.name AS designationName,
        afl.leave_from_day as leaveFromDay,
        afl.leave_to_day as leaveToDay
        FROM ${this.dbNames.lms}.apply_for_leaves afl 
        LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = afl.type_of_leave 
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
        WHERE afl.apply_for_leaves_id IN (${applyForLeavesId.join(",")})
        `;
        return await this.applyForLeaveRepository.query(query);
    }
 
    async getAllRMLeaves (req: EmployeeFilterReq): Promise<any> {
        const queryBuilder = this.createQueryBuilder('e')
            let query = `
        SELECT 
            e.id AS id,
            CONCAT(e.first_name, ' ', e.last_name) AS fullName,
            e.employee_code AS employeeCode,
            e.salutation AS salutation,
            e.first_name AS firstName,
            e.last_name AS lastName,
            e.department_id AS departmentId,
            e.designation_id AS designationId,
            e.branch_id AS branchId,
            e.division_id AS division,
            CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName,
            e.reporting_manager AS reportingManager,
            b.branch_name AS branchName,
            b.id AS branchId,
            dep.name AS departmentName,
            des.name AS designationName,
            divi.division_name AS divisionName
        FROM ${this.dbNames.ems}employees e
        LEFT JOIN ${this.dbNames.ems}departments dep ON dep.id = e.department_id
        LEFT JOIN ${this.dbNames.ems}designations des ON des.id = e.designation_id
        LEFT JOIN ${this.dbNames.ems}divisions divi ON divi.id = e.division_id
        LEFT JOIN ${this.dbNames.ems}employees rm ON rm.id = e.reporting_manager
        WHERE e.reporting_manager IS NOT NULL
        GROUP BY e.reporting_manager, e.id;
        `
    // if (req.branchId && req.branchId !== 0) {
    //     queryBuilder.andWhere('b.id = :branchId', { branchId: req.branchId });
    // }
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

    async getAllRMData (): Promise<any>{
    let query =`
    SELECT 
            e.id AS employee_id,
            e.first_name AS employeeName,
            e.reporting_manager AS reporting_manager_id,
            ee.first_name AS managerName
        FROM ${this.dbNames.ems}.employee e
        JOIN ${this.dbNames.ems}.employee ee ON ee.id = e.reporting_manager
    `
    return await this.applyForLeaveRepository.query(query)
    }



    // async getReportingManagerData(req: ApproveLeaveStatusReq): Promise<any[]> {
    //     let query = `
    //     SELECT  
    //     afl.apply_for_leaves_id AS applyForLeavesId,
    //     afl.employee_id AS employeeId,
    //     afl.employee_code AS employeeCode,
    //     afl.employee_name AS employeeName,
    //     afl.type_of_leave AS typeOfLeave,
    //     afl.from_date AS fromDate,
    //     afl.to_date AS toDate,
    //     afl.no_of_days AS noOfDays,
    //     afl.leave_reason AS leaveReason,
    //     afl.leave_address AS leaveAddress,
    //     afl.created_user AS createdUser,
    //     afl.updated_user AS updatedUser,
    //     afl.version_flag,
    //     afl.status AS status,
    //     afl.remarks AS remarks,
    //      tl.leave_name AS leaveName,
    //     tl.leave_code AS leave_code,
    //     tl.id AS leaveTypeId,
    //     e.id AS employeeId,
    //     CONCAT(e.first_name," ",e.last_name) AS employeeName,
    //     CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName,
    //     e.reporting_manager AS reportingManager,
    //     e.designation_id AS desginationid,
    //     e.department_id AS departmentId,
    //     e.branch_id AS branchId,
    //     e.division_id AS divisionId,
    //     dp.name AS departmentName,
    //     dv.division_name AS divisionName,
    //     br.branch_name AS branchName,
    //     dg.name AS designationName,
    //     afl.status
    //     FROM ${this.dbNames.lms}.apply_for_leaves afl
    //     LEFT JOIN ${this.dbNames.lms}.leave_type tl ON tl.id = afl.type_of_leave  
    //     LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
    //     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
    //     LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
    //     LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
    //     LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
    //     LEFT JOIN ${this.dbNames.ems}.employee rm ON rm.id = e.reporting_manager
    //      WHERE 1=1
    //      GROUP BY e.reporting_manager, reportingManagerName
    //     `
    //     if (req.departmentId) {
    //         query = query + ` and e.department_id = ${req.departmentId}`
    //     }
    //     if (req.reportingManager) {
    //         query = query + ` and e.reporting_manager = ${req.reportingManager}`
    //     }
    //     if (req.desginationid) {
    //         query = query + ` and e.designation_id="${req.desginationid}"`
    //     }
    //     if (req.branchId) {
    //         query = query + ` and e.branch_id = ${req.branchId}`
    //     }
    //     if (req.employeeId) {
    //         query = query + ` and e.id = ${req.employeeId}`
    //     }
    //     if (req.divisionId) {
    //         query = query + ` and e.division_id = ${req.divisionId}`
    //     }
    //     return await this.applyForLeaveRepository.query(query);
    // }

    // async getReportingManagerData(req: ApproveLeaveStatusReq): Promise<any[]> {
    //     let query = `
    //     SELECT  
    //     afl.apply_for_leaves_id AS applyForLeavesId,
    //     afl.employee_id AS employeeId,
    //     afl.employee_code AS employeeCode,
    //     afl.employee_name AS employeeName,
    //     afl.type_of_leave AS typeOfLeave,
    //     afl.from_date AS fromDate,
    //     afl.to_date AS toDate,
    //     afl.no_of_days AS noOfDays,
    //     afl.leave_reason AS leaveReason,
    //     afl.leave_address AS leaveAddress,
    //     afl.created_user AS createdUser,
    //     afl.updated_user AS updatedUser,
    //     afl.version_flag,
    //     afl.status AS status,
    //     afl.remarks AS remarks,
    //      tl.leave_name AS leaveName,
    //     tl.leave_code AS leave_code,
    //     tl.id AS leaveTypeId,
    //     e.id AS employeeId,
    //     CONCAT(e.first_name," ",e.last_name) AS employeeName,
    //     CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName,
    //     e.reporting_manager AS reportingManager,
    //     e.designation_id AS desginationid,
    //     e.department_id AS departmentId,
    //     e.branch_id AS branchId,
    //     e.division_id AS divisionId,
    //     dp.name AS departmentName,
    //     dv.division_name AS divisionName,
    //     br.branch_name AS branchName,
    //     dg.name AS designationName,
    //     afl.status
    //     FROM ${this.dbNames.lms}.apply_for_leaves afl
    //     LEFT JOIN ${this.dbNames.lms}.leave_type tl ON tl.id = afl.type_of_leave  
    //     LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
    //     LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
    //     LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
    //     LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
    //     LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
    //      LEFT JOIN ${this.dbNames.ems}.employee rm ON rm.id = e.reporting_manager
    //         GROUP BY e.reporting_manager, reportingManagerName

    //     `
    //     if (req.departmentId) {
    //         query = query + ` and e.department_id = ${req.departmentId}`
    //     }
    //     if (req.reportingManager) {
    //         query = query + ` and e.reporting_manager = ${req.reportingManager}`
    //     }
    //     if (req.desginationid) {
    //         query = query + ` and e.designation_id="${req.desginationid}"`
    //     }
    //     if (req.branchId) {
    //         query = query + ` and e.branch_id = ${req.branchId}`
    //     }
    //     if (req.employeeId) {
    //         query = query + ` and e.id = ${req.employeeId}`
    //     }
    //     if (req.divisionId) {
    //         query = query + ` and e.division_id = ${req.divisionId}`
    //     }
    //     return await this.applyForLeaveRepository.query(query);
    // }

    async getReportingManagerData(req: ApproveLeaveStatusReq): Promise<any[]> {
        let query = `
        SELECT  
        afl.apply_for_leaves_id AS applyForLeavesId,
        afl.employee_id AS employeeId,
        afl.employee_code AS employeeCode,
        afl.employee_name AS employeeName,
        afl.type_of_leave AS typeOfLeave,
        afl.from_date AS fromDate,
        afl.to_date AS toDate,
        afl.no_of_days AS noOfDays,
        afl.leave_reason AS leaveReason,
        afl.leave_address AS leaveAddress,
        afl.created_user AS createdUser,
        afl.updated_user AS updatedUser,
        afl.version_flag,
        afl.status AS status,
        afl.remarks AS remarks,
         tl.leave_name AS leaveName,
        tl.leave_code AS leave_code,
        tl.id AS leaveTypeId,
        e.id AS employeeId,
        CONCAT(e.first_name," ",e.last_name) AS employeeName,
        CONCAT(rm.first_name, ' ', rm.last_name) AS reportingManagerName,
        e.reporting_manager AS reportingManager,
        e.designation_id AS desginationid,
        e.department_id AS departmentId,
        e.branch_id AS branchId,
        e.division_id AS divisionId,
        dp.name AS departmentName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName,
        dg.name AS designationName,
        afl.status
        FROM ${this.dbNames.lms}.apply_for_leaves afl
        LEFT JOIN ${this.dbNames.lms}.leave_type tl ON tl.id = afl.type_of_leave  
        LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = afl.employee_id
        LEFT JOIN ${this.dbNames.ems}.departments dp ON dp.id= e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id= e.division_id
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id= e.branch_id
        LEFT JOIN ${this.dbNames.ems}.designations dg ON dg.id= e.designation_id
         LEFT JOIN ${this.dbNames.ems}.employee rm ON rm.id = e.reporting_manager
                  GROUP BY e.reporting_manager, reportingManagerName

        `;
    
        if (req.departmentId) query += ` AND e.department_id = ${req.departmentId}`;
        if (req.reportingManager) query += ` AND e.reporting_manager = ${req.reportingManager}`;
        if (req.desginationid) query += ` AND e.designation_id="${req.desginationid}"`;
        if (req.branchId) query += ` AND e.branch_id = ${req.branchId}`;
        if (req.employeeId) query += ` AND e.id = ${req.employeeId}`;
        if (req.divisionId) query += ` AND e.division_id = ${req.divisionId}`;
    
        const rawData = await this.applyForLeaveRepository.query(query);
    
        // **Step 2: Process the Data**
        const groupedData = rawData.reduce((acc, row) => {
            let manager = acc.find(m => m.reportingManagerId === row.reportingManagerId);
            if (!manager) {
                manager = {
                    reportingManagerName: row.reportingManagerName,
                    employees: []
                };
                acc.push(manager);
            }
    
            manager.employees.push({
                id: row.applyForLeavesId,
                employeeId: row.employeeId,
                date: row.fromDate - row.e,
                status: row.status
            });
    
            return acc;
        }, []);
    
        return groupedData;
    }

    async getMobileNoByEmpCode(req: any): Promise<any> {
        let query =  `SELECT mobile_no AS phoneNumber FROM ${this.dbNames.ems}.employee WHERE id = ${req.employeeId} `
        return await this.applyForLeaveRepository.query(query)
    }
    


}