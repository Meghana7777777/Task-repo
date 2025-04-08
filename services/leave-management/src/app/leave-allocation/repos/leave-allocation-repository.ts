
import { EmpDataReq, LeaveAllocationReqDto } from "@hrexpert/shared-models";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericTransactionManager } from "services/leave-management/src/database/type-orm-transactions";
import { DataSource, Repository } from "typeorm";
import { ApplyForLeavesDto } from "../../apply-for-leaves/dto/apply-for-leaves.dto";
import { ApplyLeavesDto } from "../../apply-for-leaves/dto/apply-leave.dto";
import { LeaveAllocations } from "../entities/leave-allocation-entity";
import dayjs from "dayjs";



@Injectable()
export class LeaveAllocationsRepository extends Repository<LeaveAllocations> {
    private readonly dbNames: any

    constructor(@InjectRepository(LeaveAllocations)
    private leaveAllocationRepo: Repository<LeaveAllocations>,
        private dataSource: DataSource,
        private readonly configService: ConfigService
    ) {
        super(leaveAllocationRepo.target, leaveAllocationRepo.manager, leaveAllocationRepo.queryRunner);
        this.dbNames = this.configService.get('dbNames');
    }


    async getAllActiveEmpDropDown(req: EmpDataReq): Promise<any> {
        let query = `
        SELECT e.id, e.employee_code AS empCode, CONCAT(e.first_name, ' ', e.last_name) AS fullName, e.department_id as deptId, e.designation_id as designId,e.branch_id as branchId, e.employee_type_id as employeeTypeId
        FROM ${this.dbNames.ems}.employee e
        WHERE e.is_active = 1 ${req.departmentId ? `AND e.department_id = ${req.departmentId}` : ''} ${req.designationId ? `AND e.designation_id = ${req.designationId}` : ''} ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''} ${req.divisionId ? `AND e.division_id = ${req.divisionId}` : ''}
        ORDER BY e.first_name ASC`
        return await this.leaveAllocationRepo.query(query)
    }

    async getAllActiveEmp(req: EmpDataReq): Promise<any> {
        let query = `
        SELECT e.id, e.employee_code AS empCode, CONCAT(e.first_name, ' ', e.last_name) AS fullName,e.gender,d.id AS deptId,d.name AS department,
        des.id AS designId, des.name AS designation
        FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.department_id
        LEFT JOIN ${this.dbNames.ems}.designations des ON des.id = e.designation_id
        WHERE e.is_active = 1 ${req.departmentId ? `AND d.id = ${req.departmentId}` : ''} ${req.designationId ? ` AND des.id = ${req.designationId}` : ''} ${req.employeeId ? `AND e.id = ${req.employeeId}` : ''}
        ORDER BY e.first_name ASC`
        return await this.leaveAllocationRepo.query(query)
    }

    async getAllActiveLeaveTypes(): Promise<any> {
        let query = `
        SELECT id,is_active,leave_name AS typeOfLeave, leave_code AS leaveCode
        FROM  ${this.dbNames.lms}.leave_type
        WHERE is_active = 1`
        return await this.leaveAllocationRepo.query(query)
    }

    async getEmpAllocation(req?: EmpDataReq): Promise<any> {
        let query = `
        SELECT la.id,e.id AS empId,CONCAT(e.first_name,'',e.last_name) AS fullName,e.employee_code AS employeeCode, d.id AS deptId, d.name AS department, des.id AS designId, des.name AS designation,di.division_name AS divisionName,di.id,br.id,br.branch_name AS branchName
        FROM  ${this.dbNames.lms}.leave_allocations la
        LEFT JOIN  ${this.dbNames.ems}.employee e ON e.id = la.employee_id
        LEFT JOIN  ${this.dbNames.ems}.departments d ON d.id = e.department_id
        LEFT JOIN  ${this.dbNames.ems}.designations des ON des.id = e.designation_id
        LEFT JOIN  ${this.dbNames.ems}.division di ON di.id = e.division_id
        LEFT JOIN  ${this.dbNames.ems}.branches br ON br.id = e.branch_id
        WHERE 1=1`
        if (req.branchId) {
            query += ` AND e.branch_Id = ${req.branchId}`
        }
        if (req.divisionId) {
            query += ` AND di.id = ${req.divisionId}`
        }
        if (req.employeeId) {
            query += ` AND e.id = ${req.employeeId}`
        }
        if (req.departmentId) {
            query += ` AND d.id = ${req.departmentId}`
        }
        if (req.designationId) {
            query += ` AND des.id = ${req.designationId}`
        }
        query += ` GROUP BY e.id ORDER BY e.first_name ASC`
        return await this.leaveAllocationRepo.query(query)
    }

    // async getMultipleEmpLeaveAllocations(empIds: number[]): Promise<any> {
    //     if (empIds.length === 0) return [];

    //     const query = `
    //     SELECT la.id as leaveAllocationId, la.employee_id as empId, lt.id as leaveTypeId, lt.leave_name as leaveType, 
    //            la.leaves_allotted as leavesAllotted, la.leaves_used as leavesUsed, la.available
    //     FROM  ${this.dbNames.lms}.leave_allocations la
    //     LEFT JOIN  ${this.dbNames.lms}.leave_type lt on lt.id = la.leave_type_id
    //     WHERE la.employee_id IN (${empIds.join(',')})`;

    //     return await this.leaveAllocationRepo.query(query);
    // }
    async getMultipleEmpLeaveAllocations(empIds: number[]): Promise<any> {
        if (empIds.length === 0) return [];

        // Safely join employee IDs to avoid SQL injection
        const empIdsList = empIds.map((id) => `${id}`).join(',');

        const query = `
            SELECT la.id as leaveAllocationId, la.employee_id as empId, lt.id as leaveTypeId, lt.leave_name as leaveType, 
                   la.leaves_allotted as leavesAllotted, la.leaves_used as leavesUsed, la.available
            FROM  ${this.dbNames.lms}.leave_allocations la
            LEFT JOIN  ${this.dbNames.lms}.leave_type lt on lt.id = la.leave_type_id
            WHERE la.employee_id IN (${empIdsList})
        `;

        return await this.leaveAllocationRepo.query(query);
    }




    async getAllLeaveBalanceReport(req: LeaveAllocationReqDto): Promise<any> {
        let query = `
        SELECT a.id,a.employee_id AS empolyeeId,a.leaves_allotted AS leaveAllotted,a.leaves_used AS leavesUsed,a.available,a.unit_code AS unitCode, a.leave_type_id AS leaveTypeId,tol.id as leaveTypeId, tol.type_of_leave as leaveType,
        e.employee_code AS empCode, CONCAT(e.first_name, ' ', e.last_name) AS fullName,e.department_id as departmentId, e.designation_id as desginationid,e.division AS divisionId,e.branch AS branchId,
        dep.name AS departmentName,
        des.name AS designationName,
        dv.division_name AS divisionName,
        br.branch_name AS branchName
        FROM  ${this.dbNames.lms}.leave_allocations a
        LEFT JOIN ${this.dbNames.ems}.employee e ON a.employee_id = e.id
        LEFT JOIN ${this.dbNames.masters}.types_of_leaves tol ON  tol.id = a.leave_type_id
        LEFT JOIN ${this.dbNames.ems}.designations des ON des.id = e.designation_id
        LEFT JOIN ${this.dbNames.ems}.departments dep ON dep.id=e.department_id
        LEFT JOIN ${this.dbNames.ems}.division dv ON dv.id = e.division
        LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch
        WHERE a.id >0
        `
        if (req.empolyeeId != undefined) {
            query = query + `and a.employee_id = ${req.empolyeeId}`
        }
        if (req.departmentId != undefined) {
            query = query + ` and e.department_id = ${req.departmentId}`
        }
        if (req.desginationid != undefined) {
            query = query + ` and e.designation_id = ${req.desginationid}`
        }
        if (req.divisionId != undefined) {
            query = query + ` and e.division = ${req.divisionId}`
        }
        query = query + ` GROUP BY a.employee_id`
        return await this.leaveAllocationRepo.query(query)

    }

    async getLeaveAllocationsDataRepo(): Promise<any> {
        let query = `
           SELECT a.id AS id, a.employee_id AS employeeId,a.leave_type_id AS leaveTypeId,a. leaves_allotted AS leavesAlloted,
            a.leaves_used AS leavesUsed, a.available AS available , a.YEAR AS YEAR ,
            e.leave_group AS leaveGroupId,
            e.employee_code AS employeeCode,
            e.first_name AS firstName,
            e.date_of_joining AS dateOfJoining,
            tl.leave_name AS leaveName,
           tl.min_limit AS minLimit,
            tl.max_limit AS maxLimit,
            br.branch_name AS branchName,
            lg.name AS leaveGroupName
            FROM ${this.dbNames.lms}.leave_allocations a
             LEFT JOIN  ${this.dbNames.ems}.employee e on e.id = a.employee_id
              LEFT JOIN  ${this.dbNames.lms}.leave_group lg on lg.id = e.leave_group
              LEFT JOIN  ${this.dbNames.lms}.leave_type tl on tl.id = a.leave_type_id
               LEFT JOIN  ${this.dbNames.ems}.branches br on br.id = e.branch_id
              WHERE a.id >0
        `;
        query = query + ` GROUP BY a.id`
        return await this.leaveAllocationRepo.query(query);
    }

    async getAllLeaveAllocationsLeaveTypes(req: LeaveAllocationReqDto): Promise<any> {
        let query = `
            SELECT 
                a.id AS id, 
                a.employee_id AS employeeId,
                a.leave_type_id AS leaveTypeId,
                a.leaves_allotted AS leavesAlloted,
                a.leaves_used AS leavesUsed, 
                a.available AS available, 
                a.YEAR AS YEAR,
                e.leave_group AS leaveGroupId,
                e.employee_code AS employeeCode,
                e.first_name AS firstName,
                e.date_of_joining AS dateOfJoining,
                tl.leave_name AS leaveName,
                tl.leave_code AS leaveCode,
                tl.min_limit AS minLimit,
                tl.max_limit AS maxLimit,
                br.branch_name AS branchName,
                lg.name AS leaveGroupName
            FROM ${this.dbNames.lms}.leave_allocations a
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.employee_id
            LEFT JOIN ${this.dbNames.lms}.leave_group lg ON lg.id = e.leave_group
            LEFT JOIN ${this.dbNames.lms}.leave_type tl ON tl.id = a.leave_type_id
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            WHERE 1 = 1
        `;

        const params: any[] = [];

        if (req.empolyeeId !== undefined) {
            query += ` AND a.employee_id = ?`;
            params.push(req.empolyeeId);
        }

        // query += ` GROUP BY a.employee_id`;

        return await this.leaveAllocationRepo.query(query, params);
    }




    async updateLeaveAllocations(data: ApplyForLeavesDto): Promise<any> {
        const query = `
        UPDATE ${this.dbNames.lms}.leave_allocations
        SET 
            available = available - ${data.noOfDays}, 
            leaves_used = leaves_used + ${data.noOfDays}
        WHERE 
            employee_id = ${data.employeeId} 
            AND leave_type_id = ${data.typeOfLeave};
     `
        return await this.leaveAllocationRepo.query(query);
    }

    async updateLeaveAllocationsApprovedBULK(data: ApplyLeavesDto): Promise<any> {
        const transactionManager = new GenericTransactionManager(this.dataSource)

        const employeeId = Array.isArray(data.employeeId) ? data.employeeId : [data.employeeId];
        const leaveType = Array.isArray(data.typeOfLeave) ? data.typeOfLeave : [data.typeOfLeave];
        const noOfDays = Array.isArray(data.noOfDays) ? data.noOfDays : [data.noOfDays];

        const queryPromises = [];
        for (let i = 0; i < employeeId.length; i++) {
            const employee = employeeId[i];
            const leave = leaveType[i];
            const noOfDay = noOfDays[i];
            const updateQuery = `
                      UPDATE ${this.dbNames.lms}.leave_allocations
                      SET 
                          available = available - ${noOfDay}, 
                          leaves_used = leaves_used + ${noOfDay}
                      WHERE 
                          employee_id = ${employee} 
                          AND leave_type_id = ${leave};
                  `;
            queryPromises.push(await this.leaveAllocationRepo.query(updateQuery));
        }
        try {
            await transactionManager.startTransaction();
            await Promise.all(queryPromises);
            await transactionManager.completeTransaction();
            console.log("Successfully Approved leave allocations.");
        } catch (error) {
            console.error("Error in updating Approved Leave allocations: ", error);
            throw new Error("Transaction failed. Changes have been rolled back.");
        } finally {
            await transactionManager.releaseTransaction();
        }
    }


    async updateLeaveAllocationsRejected(data: ApplyLeavesDto): Promise<any> {
        const transactionManager = new GenericTransactionManager(this.dataSource)

        const employeeId = Array.isArray(data.employeeId) ? data.employeeId : [data.employeeId];
        const leaveType = Array.isArray(data.typeOfLeave) ? data.typeOfLeave : [data.typeOfLeave];
        const noOfDays = Array.isArray(data.noOfDays) ? data.noOfDays : [data.noOfDays];

        const queryPromises = [];
        for (let i = 0; i < employeeId.length; i++) {
            const employee = employeeId[i];
            const leave = leaveType[i];
            const noOfDay = noOfDays[i];

            const updateQuery = `
                      UPDATE ${this.dbNames.lms}.leave_allocations
                      SET 
                          available = available + ${noOfDay}, 
                          leaves_used = leaves_used - ${noOfDay}
                      WHERE 
                          employee_id = ${employee} 
                          AND leave_type_id = ${leave};
                  `;
            queryPromises.push(await this.leaveAllocationRepo.query(updateQuery));
        }

        try {
            await transactionManager.startTransaction();
            await Promise.all(queryPromises);
            await transactionManager.completeTransaction();
            console.log("Successfully Rejected leave allocations.");

        } catch (error) {
            console.error("Error in updating leave allocations: ", error);
            throw new Error("Transaction failed. Changes have been rolled back.");
        } finally {
            await transactionManager.releaseTransaction();
        }
    }

    async updateLeaveAllocationsCancelled(data: ApplyLeavesDto): Promise<any> {
        const transactionManager = new GenericTransactionManager(this.dataSource)

        const employeeId = Array.isArray(data.employeeId) ? data.employeeId : [data.employeeId];
        const leaveType = Array.isArray(data.typeOfLeave) ? data.typeOfLeave : [data.typeOfLeave];
        const noOfDays = Array.isArray(data.noOfDays) ? data.noOfDays : [data.noOfDays];

        const queryPromises = [];
        for (let i = 0; i < employeeId.length; i++) {
            const employee = employeeId[i];
            const leave = leaveType[i];
            const noOfDay = noOfDays[i];

            const updateQuery = `
                      UPDATE ${this.dbNames.lms}.leave_allocations
                      SET 
                          available = available + ${noOfDay}, 
                          leaves_used = leaves_used - ${noOfDay}
                      WHERE 
                          employee_id = ${employee} 
                          AND leave_type_id = ${leave};
                  `;
            queryPromises.push(await this.leaveAllocationRepo.query(updateQuery));
        }

        try {
            await transactionManager.startTransaction();
            await Promise.all(queryPromises);
            await transactionManager.completeTransaction();
            console.log("Successfully Cancelled leave allocations.");

        } catch (error) {
            console.error("Error in updating leave allocations: ", error);
            throw new Error("Transaction failed. Changes have been rolled back.");
        } finally {
            await transactionManager.releaseTransaction();
        }
    }

    async getLeavesByEmpId(req: EmpDataReq): Promise<any> {
        console.log(req, '---==-=-=-=----')
        let query = `
        SELECT la.id AS allocationId, la.employee_id AS employeeId, tol.id AS leaveTypeId, tol.type_of_leave AS typeOfLeave, tol.leave_code AS leaveCode, la.leaves_allotted AS leavesAllotted, la.leaves_used AS leavesUsed, la.available
        FROM  ${this.dbNames.lms}.leave_allocations la
        LEFT JOIN  ${this.dbNames.masters}.types_of_leaves tol ON tol.id = la.leave_type_id
        WHERE la.employee_id = ${req.employeeId}`
        return await this.leaveAllocationRepo.query(query);
    }

    async getEmpDataForExcel(empCode: any): Promise<any> {
        let query = `
        SELECT employee_code AS empCode, id AS empId
        FROM ${this.dbNames.ems}.employee
        WHERE employee_code= ${empCode}`
        return await this.dataSource.query(query)
    }


    async getEmpDataForExcels(empCode: string): Promise<any> {
        const query = `
            SELECT employee_code AS empCode, id AS empId
            FROM ${this.dbNames.ems}.employee
            WHERE employee_code = ?`;
        return await this.dataSource.query(query, [empCode]);
    }
    async getLeaveTypeForExcel(leaveTypes: any): Promise<any> {
        const leaveTypesString = leaveTypes.map(type => `'${type}'`).join(',');
        let query = `
        SELECT id as leaveTypeId, type_of_leave AS leaveType
        FROM ${this.dbNames.masters}.types_of_leaves
        WHERE type_of_leave IN (${leaveTypesString})`
        return await this.dataSource.query(query)

    }

    async getLeaveTypeForExcels(leaveTypes: any): Promise<any> {
        const leaveTypesString = leaveTypes.map(type => `'${type}'`).join(',');
        let query = `
        SELECT id as leaveTypeId, leave_name  AS leaveType
        FROM ${this.dbNames.lms}.leave_type
        WHERE leave_name  IN (${leaveTypesString})`
        return await this.dataSource.query(query)

    }


    async getLeaveHistoryReport(req: EmpDataReq): Promise<any> {
        const year = Math.floor(req.monthYear / 100);
        const month = req.monthYear % 100;
        let query = `SELECT e.id AS empId,la.leaves_allotted AS leaveAlloted,la.leaves_used AS leaveUsed,la.available AS availableLeaves,e.employee_code AS empCode, CONCAT(e.first_name)AS empName,d.name AS deptName,l.from_date AS fromDate,
       l.to_date AS toDate,l.type_of_leave AS typeOfLeave, l.no_of_days AS noOfDays,CONCAT(l.leave_from_day, "-",l.leave_to_day) AS leaveDay,
       di.division_name AS divName,b.branch_name AS branchName, a.date 
        FROM ${this.dbNames.lms}.leave_allocations la
        LEFT JOIN ${this.dbNames.ems}.employee e ON la.employee_id = e.id
        LEFT JOIN ${this.dbNames.ems}.departments d ON d.id = e.id
        LEFT JOIN ${this.dbNames.lms}.apply_for_leaves l ON l.employee_id = e.id
        LEFT JOIN ${this.dbNames.ems}.division di ON di.id = e.division
        LEFT JOIN ${this.dbNames.ems}.branches b ON b.id = e.branch
        LEFT JOIN ${this.dbNames.lms}.attendance a ON a.id = la.id
        WHERE e.id>0 `;

        if (req.employeeId) {
            query += `AND e.id = ${req.employeeId}`;
        }
        if (req.departmentId) {
            query += `AND e.id = ${req.departmentId}`;
        }
        if (req.monthYear) {
            query += ` AND MONTH(a.date) = ${month}`
        }


        return await this.leaveAllocationRepo.query(query)

    }

    //-------------new leave management ---------------------
    async getAllNewLeaveAllocationsLeaveTypes(req: EmpDataReq): Promise<any> {
        const year = Math.floor(req.monthYear / 100)
        const month = req.monthYear % 100
    
        let accumSumWithCarry = ""
        for (let i = 1; i <= month; i++) {
            accumSumWithCarry += `a.accum_${i} + `
        }
        accumSumWithCarry = accumSumWithCarry.slice(0, -3)
    
        let utilizedSumWithCarry = ""
        for (let i = 1; i <= 12; i++) {
            utilizedSumWithCarry += `a.utilized_${i} + `
        }
        utilizedSumWithCarry = utilizedSumWithCarry.slice(0, -3)
    
        let query = `
            SELECT 
                a.id AS id, 
                a.employee_id AS employeeId,
                a.employee_code AS employeeCode,
                a.leave_type_id AS leaveTypeId,
                a.leave_group_code_id AS leaveGroupCodeId,
                
                -- Corrected CASE expressions with alias outside
                CASE
                    WHEN c.carry_forward = 0 THEN a.accum_${month}
                    ELSE (${accumSumWithCarry})
                END AS leavesAlloted,
    
                CASE
                    WHEN c.carry_forward = 0 THEN a.utilized_${month}
                    ELSE (${utilizedSumWithCarry})
                END AS leavesUsed,
    
                CASE
                    WHEN c.carry_forward = 0 THEN a.accum_${month} - a.utilized_${month}
                    ELSE (${accumSumWithCarry}) - (${utilizedSumWithCarry})
                END AS available,
    
                a.prev_year_closing_bal AS prevYearClosingBal,
                a.year AS year,
                e.employee_code AS employeeCode,
                e.first_name AS firstName,
                e.date_of_joining AS dateOfJoining,
                tl.leave_type_name AS leaveName,
                tl.leave_type_code AS leaveCode,
                br.branch_name AS branchName,
                c.accum_qty AS accumQty, 
                c.carry_forward AS carryForward, 
                c.accum_period AS accumPeriod
            FROM ${this.dbNames.lms}.new_leave_allocations a
            LEFT JOIN ${this.dbNames.ems}.employee e ON e.id = a.employee_id           
            LEFT JOIN ${this.dbNames.lms}.leave_type_master tl ON tl.leave_type_id = a.leave_type_id          
            LEFT JOIN ${this.dbNames.ems}.branches br ON br.id = e.branch_id
            LEFT JOIN ${this.dbNames.lms}.leave_code_define c ON c.leave_group_code_id = a.leave_group_code_id 
                AND c.leave_type_id = tl.leave_type_id
            WHERE a.year = ?
        `;
    
        const params: any[] = [year];
    
        if (req.employeeCode !== undefined) {
            query += ` AND a.employee_code = ?`;
            params.push(req.employeeCode);
        }
    
        return await this.leaveAllocationRepo.query(query, params);
    }

    async updateNewLeaveAllocations(data: any): Promise<any> {

        const query1 = `
        SELECT lcd.leave_group_code_id AS leaveGroupCodeId,
        lcd.leave_type_id AS leaveTypeId,
        lcd.accum_qty AS accumQty,
        lcd.accum_period AS accumPeriod   
        FROM ${this.dbNames.lms}.leave_code_define lcd
        WHERE lcd.leave_group_code_id = ${data.leaveGroupCodeId} AND lcd.leave_type_id = ${data.typeOfLeave}
    `;

        const leaveCodeDefine = await this.leaveAllocationRepo.query(query1)

        let balanceUpdates: string[] = []
        let utilizedUpdates: string[] = []

        if (leaveCodeDefine.accumPeriod === 'Yearly') {

            for (const d of data.dates) {
                for (let m = 1; m <= 12; m++) {
                    balanceUpdates.push(`balance_${m} = balance_${m} - ${Math.abs(d.days)}`)
                }
                utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} + ${Math.abs(d.days)}`)
            }

            const query = `
            UPDATE ${this.dbNames.lms}.new_leave_allocations
            SET 
                ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
            WHERE 
                employee_id = ${data.employeeId} 
                AND leave_type_id = ${data.typeOfLeave}
        `

            return await this.leaveAllocationRepo.query(query)

        } else {

            for (const d of data.dates) {
                balanceUpdates.push(`balance_${data.CurrentMonth} = balance_${data.CurrentMonth} - ${Math.abs(d.days)}`)
                utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} + ${Math.abs(d.days)}`)
            }

            const query = `
            UPDATE ${this.dbNames.lms}.new_leave_allocations
            SET 
                ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
            WHERE 
                employee_id = ${data.employeeId} 
                AND leave_type_id = ${data.typeOfLeave}
        `

            return await this.leaveAllocationRepo.query(query)
        }
    }


    async updateNewLeaveAllocationsRejected(data: any): Promise<any> {
        const transactionManager = new GenericTransactionManager(this.dataSource)

        const employeeIds = Array.isArray(data.employeeIds) ? data.employeeIds : [data.employeeIds]
        const leaveTypeIds = Array.isArray(data.leaveTypeIds) ? data.leaveTypeIds : [data.leaveTypeIds]
        const noOfDaysArr = Array.isArray(data.noOfDays) ? data.noOfDays : [data.noOfDays]
        const leaveGroupCodeIds = Array.isArray(data.leaveGroupCodeId) ? data.leaveGroupCodeId : [data.leaveGroupCodeId]
        const datesArr = Array.isArray(data.dates) ? data.dates : [data.dates]
        const createdAtArr = Array.isArray(data.createdMonth) ? data.createdMonth : [data.createdMonth]

        try {
            await transactionManager.startTransaction()

            for (let i = 0; i < employeeIds.length; i++) {
                const employeeId = employeeIds[i]
                const leaveTypeId = leaveTypeIds[i]
                const noOfDays = noOfDaysArr[i]
                const leaveGroupCodeId = leaveGroupCodeIds[i]
                const dates = datesArr[i]
                const createdMonth = dayjs(createdAtArr[i]).format('M')

                if (!employeeId || !leaveTypeId || !dates || dates.length === 0) {
                    console.warn(`Skipping invalid data for employeeId: ${employeeId}`)
                    continue
                }

                const query1 = `
                SELECT lcd.leave_group_code_id AS leaveGroupCodeId,
                lcd.leave_type_id AS leaveTypeId,
                lcd.accum_qty AS accumQty,
                lcd.accum_period AS accumPeriod   
                FROM ${this.dbNames.lms}.leave_code_define lcd
                WHERE lcd.leave_group_code_id = ${leaveGroupCodeId} AND lcd.leave_type_id = ${leaveTypeId}
            `;

                const leaveCodeDefine = await this.leaveAllocationRepo.query(query1)


                let balanceUpdates: string[] = []
                let utilizedUpdates: string[] = []

                if (leaveCodeDefine.accumPeriod === 'Yearly') {
                    for (const d of dates) {
                        for (let m = 1; m <= 12; m++) {
                            balanceUpdates.push(`balance_${m} = balance_${m} + ${Math.abs(d.days)}`)
                        }
                        utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} - ${Math.abs(d.days)}`)
                    }

                    const query = `
                        UPDATE ${this.dbNames.lms}.new_leave_allocations
                        SET ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
                        WHERE employee_id = ${employeeId} AND leave_type_id = ${leaveTypeId}
                    `

                    await this.leaveAllocationRepo.query(query)

                } else {
                    for (const d of dates) {
                        balanceUpdates.push(`balance_${createdMonth} = balance_${createdMonth} + ${Math.abs(d.days)}`)
                        utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} - ${Math.abs(d.days)}`)
                    }

                    const query = `
                        UPDATE ${this.dbNames.lms}.new_leave_allocations
                        SET ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
                        WHERE employee_id = ${employeeId} AND leave_type_id = ${leaveTypeId}
                    `

                    await this.leaveAllocationRepo.query(query)
                }
            }

            await transactionManager.completeTransaction()
            console.log("Successfully rejected leave allocations.")
        } catch (error) {
            console.error("Error in updating leave allocations: ", error)
            throw new Error("Transaction failed. Changes have been rolled back.")
        } finally {
            await transactionManager.releaseTransaction();
        }
    }


    async updateNewLeaveAllocationsCancled(data: any): Promise<any> {
        const transactionManager = new GenericTransactionManager(this.dataSource)

        const employeeIds = Array.isArray(data.employeeIds) ? data.employeeIds : [data.employeeIds]
        const leaveTypeIds = Array.isArray(data.leaveTypeIds) ? data.leaveTypeIds : [data.leaveTypeIds]
        const noOfDaysArr = Array.isArray(data.noOfDays) ? data.noOfDays : [data.noOfDays]
        const leaveGroupCodeIds = Array.isArray(data.leaveGroupCodeId) ? data.leaveGroupCodeId : [data.leaveGroupCodeId]
        const datesArr = Array.isArray(data.dates) ? data.dates : [data.dates]
        const createdAtArr = Array.isArray(data.createdMonth) ? data.createdMonth : [data.createdMonth]

        try {
            await transactionManager.startTransaction()

            for (let i = 0; i < employeeIds.length; i++) {
                const employeeId = employeeIds[i]
                const leaveTypeId = leaveTypeIds[i]
                const noOfDays = noOfDaysArr[i];
                const leaveGroupCodeId = leaveGroupCodeIds[i]
                const dates = datesArr[i]
                const createdMonth = dayjs(createdAtArr[i]).format('M')

                if (!employeeId || !leaveTypeId || !dates || dates.length === 0) {
                    console.warn(`Skipping invalid data for employeeId: ${employeeId}`)
                    continue
                }

                const query1 = `
                SELECT lcd.leave_group_code_id AS leaveGroupCodeId,
                lcd.leave_type_id AS leaveTypeId,
                lcd.accum_qty AS accumQty,
                lcd.accum_period AS accumPeriod   
                FROM ${this.dbNames.lms}.leave_code_define lcd
                WHERE lcd.leave_group_code_id = ${leaveGroupCodeId} AND lcd.leave_type_id = ${leaveTypeId}
            `;

                const leaveCodeDefine = await this.leaveAllocationRepo.query(query1)

                let balanceUpdates: string[] = []
                let utilizedUpdates: string[] = []
                if (leaveCodeDefine.accumPeriod === 'Yearly') {
                    for (const d of dates) {
                        for (let m = 1; m <= 12; m++) {
                            balanceUpdates.push(`balance_${m} = balance_${m} + ${Math.abs(d.days)}`)
                        }
                        utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} - ${Math.abs(d.days)}`)
                    }

                    const query = `
                        UPDATE ${this.dbNames.lms}.new_leave_allocations
                        SET ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
                        WHERE employee_id = ${employeeId} AND leave_type_id = ${leaveTypeId}
                    `

                    await this.leaveAllocationRepo.query(query)

                } else {
                    for (const d of dates) {
                        balanceUpdates.push(`balance_${createdMonth} = balance_${createdMonth} + ${Math.abs(d.days)}`)
                        utilizedUpdates.push(`utilized_${d.month} = utilized_${d.month} - ${Math.abs(d.days)}`)
                    }

                    const query = `
                        UPDATE ${this.dbNames.lms}.new_leave_allocations
                        SET ${[...balanceUpdates, ...utilizedUpdates].join(', ')}
                        WHERE employee_id = ${employeeId} AND leave_type_id = ${leaveTypeId}
                    `

                    await this.leaveAllocationRepo.query(query)
                }
            }

            await transactionManager.completeTransaction()
            console.log("Successfully rejected leave allocations.")
        } catch (error) {
            console.error("Error in updating leave allocations: ", error)
            throw new Error("Transaction failed. Changes have been rolled back.")
        } finally {
            await transactionManager.releaseTransaction();
        }
    }



}