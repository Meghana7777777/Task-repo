import { ActiveEmployeesForAttendanceDto, ActiveEmployeesForAttendanceResponseModel, ApplyLeaveBrachDto, AttendanceDto, BankPaySharedDto, BranchReq, CommonResponseModel, DashboardReq, DropdownModel, DropdownResponseModel, EmpDataReq, EmployeeBulkRequest, EmployeeCodeReq, EmployeeDetailsDto, EmployeeDocDto, EmployeeDocModel, EmployeeMobileReq, EmployeeRMRequest, EmployeesActivateDeactivateDto, EmployeeShiftReq, EmployeeShiftUpdateReq, EmployeeStatus, EmployeeViewModel, EmployeeViewResponseModel, EmployeIdReq, lateMinReq } from '@hrexpert/shared-models';
import { BranchesService, DepartmentService, DesignationsService, DivisionService, EmployeeFilterReq, EmployeeLogsService, PayrollRecordsSharedService, WhatsUpService } from '@hrexpert/shared-services';
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import duration from "dayjs/plugin/duration";
import { DataSource, In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { BranchReqDto } from '../branches/branch-req.dto';
import { Branches } from '../branches/branches.entity';
import { DepartmentsEntity } from '../departments/entites/departments-entity';
import { DesignationsEntity } from '../designations/entites/designations.entity';
import { Division } from '../division/division.entity';
import { IdProofRepository } from '../id-proof/dto/id-proof-repo';
import { MemoEntity } from '../memo/memo.entity';
import { MemoRepository } from '../memo/memo.repo';
import { RelationsRepository } from '../relations/dto/relations.repo';
import { CreateEmployeeAdapter } from './adapters/create-employee.adapter';
import { EmpResignationDto } from './dto/emp-resignation-proofs-dto';
import { PrefixConfigurationDTO } from './dto/prefix-configuration.dto';
import { BankDetailsEntity } from './entities/bank-details.entity';
import { EmployeeFormConfiguration } from './entities/employee-configuration.entity';
import { Employee } from './entities/employee-details.entity';
import { EmployeeEduDetails } from './entities/employee-education.entity';
import { EmployeeExperienceDetails } from './entities/employee-experience.entity';
import { EmployeeFamilyDetails } from './entities/employee-family.entity';
import { EmployeeIdProofs } from './entities/employee-idproof';
import { EmployeeResignationProofs } from './entities/employee-resignation-proofs-entity';
import { PfEsiEffDatesEntity } from './entities/pf-esi-eff-dates.entity';
import { PrefixConfiguration } from './entities/prefix-configuration.entity';
import { SwipeProcessLogEntity } from './entities/swipe-process-log.entity';
import { BankDetailsRepository } from './repositorys/bank-details-repo';
import { EmployeeFormConfigurationRepository } from './repositorys/employee-configuration.repo';
import { EmployeeDetailRepository } from './repositorys/employee-details-repo';
import { EmployeeResignRepository } from './repositorys/employee-resign-repo';
import { PfEsiEffDatesRepository } from './repositorys/pf-esi-eff-dates-repo';
import { PrefixConfigurationRepository } from './repositorys/prefix-configuration.repo';

dayjs.extend(duration);
@Injectable()
export class EmployeeOnboardingService {

    private readonly dbNames: any
    constructor(
        private dataSource: DataSource,
        private whatsService: WhatsUpService,
        private employeeDetailRepo: EmployeeDetailRepository,
        private employeesAdapter: CreateEmployeeAdapter,
        private payrollRecordsSharedService: PayrollRecordsSharedService,
        private bankDetailsRepo: BankDetailsRepository,
        private pfEsiEffDatesRepo: PfEsiEffDatesRepository,

        @InjectRepository(EmployeeFamilyDetails)
        private empFamilyRepo: Repository<EmployeeFamilyDetails>,

        @InjectRepository(EmployeeEduDetails)
        private empEducationRepo: Repository<EmployeeEduDetails>,

        @InjectRepository(EmployeeExperienceDetails)
        private empExperienceRepo: Repository<EmployeeExperienceDetails>,

        @InjectRepository(EmployeeIdProofs)
        private empIdProofRepo: Repository<EmployeeIdProofs>,

        private prefixConfigurationRepo: PrefixConfigurationRepository,

        private employeeFormConfigurationRepo: EmployeeFormConfigurationRepository,
        private employeeLogService: EmployeeLogsService,
        private departmentService: DepartmentService,
        private branchService: BranchesService,
        private divisonService: DivisionService,
        private designationService: DesignationsService,

        private relationRepo: RelationsRepository,
        private idproofRepo: IdProofRepository,
        private empResignRepo: EmployeeResignRepository,
        private memoRepo: MemoRepository,
        private readonly configService: ConfigService,
        @InjectRepository(SwipeProcessLogEntity)
        private swipeProcessLogRepo: Repository<SwipeProcessLogEntity>,
    ) {
        this.dbNames = this.configService.get('dbNames');
    }

    async updateLastLeave(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeDetailRepo.update(
                { employeeCode: req[0] },
                { lastLeaveDay: req[1] }
            );
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Last Leave', result);
            } else {
                return new CommonResponseModel(false, 0, 'No matching employee found to update', []);
            }
        } catch (err) {
            console.error("Error updating last leave:", err);
            return new CommonResponseModel(false, 0, 'Failed to update last leave', []);
        }
    }

    async updateLastAttnStatus(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeDetailRepo.update(
                { employeeCode: req[0] },
                { lastAttnDay: req[1] }
            );
            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'last attn updated Successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'No matching employee found to update', []);
            }
        } catch (err) {
            console.error("Error updating last attn:", err);
            return new CommonResponseModel(false, 0, 'Failed to update last attn', []);
        }
    }



    async createEmployee(employeeData: EmployeeDetailsDto): Promise<CommonResponseModel> {
        try {
            const employeeEntity = this.employeesAdapter.convertDtoToEntity(employeeData);
            const saveResult = await this.employeeDetailRepo.save(employeeEntity);
            if (saveResult) {
                const existingBankDetails = await this.bankDetailsRepo.findOne({
                    where: { empId: saveResult.id, employeeCode: employeeData.employeeCode }
                });
                if (existingBankDetails) {
                    await this.bankDetailsRepo.update(existingBankDetails.id, {
                        versionFlag: (existingBankDetails.versionFlag || 0) + 1,
                        isActive: false
                    });
                }
                const pfEsiEntity = new PfEsiEffDatesEntity()
                pfEsiEntity.empId = employeeData.id
                pfEsiEntity.employeeCode = employeeData.employeeCode
                pfEsiEntity.pfNo = employeeData.pfNo
                pfEsiEntity.esicNo = employeeData.esicNo
                pfEsiEntity.isPfEligible = employeeData.isPfEligible
                pfEsiEntity.isEsicEligible = employeeData.isEsicEligible
                pfEsiEntity.pfEffFromDate = dayjs(employeeData.pfEffFromDate).format('YYYY-MM-DD') ? dayjs(employeeData.pfEffFromDate).format('YYYY-MM-DD') : '-'
                pfEsiEntity.esicEffFromDate = dayjs(employeeData.esicEffFromDate).format('YYYY-MM-DD') ? dayjs(employeeData.esicEffFromDate).format('YYYY-MM-DD') : '-'
                await this.pfEsiEffDatesRepo.save(pfEsiEntity)

                const reqData = new BankDetailsEntity();
                reqData.empId = saveResult.id;
                reqData.bankAcNo = employeeData.bankAcNo;
                reqData.bankIfscCode = employeeData.bankIfscCode;
                reqData.bankName = employeeData.bankName;
                reqData.employeeCode = employeeData.employeeCode;
                reqData.bankEffDate = employeeData.bankEffDate;
                reqData.cashEffDate = employeeData.cashEffDate;
                reqData.isActive = true;
                await this.bankDetailsRepo.save(reqData);

                /* Memo Saving */
                const oldEmployeeData = await this.employeeDetailRepo.find({
                    relations: ['departmentId', 'designationId', 'branchId', 'divisionId'],
                    where: { id: saveResult.id }
                });
                const fieldMappings = {
                    departmentId: "Department",
                    designationId: "Designation",
                    branchId: "Branch",
                    divisionId: "Division",
                    bankName: "Bank Name",
                    bankBranch: "Bank Branch",
                    bankAcNo: "Bank Account No",
                    bankIfscCode: "Bank IFSC Code"
                };
                const employee = oldEmployeeData[0];
                const fieldValues = {
                    departmentId: employee?.departmentId?.name,
                    designationId: employee?.designationId?.name,
                    branchId: employee?.branchId?.branchName,
                    divisionId: employee?.divisionId?.divisionName,
                    bankName: employee?.bankName,
                    bankBranch: employee?.bankBranch,
                    bankAcNo: employee?.bankAcNo,
                    bankIfscCode: employee?.bankIfscCode
                };
                for (const field in fieldValues) {
                    const fieldValue = fieldValues[field];
                    if (fieldValue) {
                        const memoEntities = new MemoEntity();
                        memoEntities.date = new Date().toISOString().split("T")[0];
                        memoEntities.type = `${fieldMappings[field]}`;
                        memoEntities.feedBackOn = `${employee.firstName} ${employee.lastName}`;
                        memoEntities.impactOnBussiness = "Employee Creation";
                        memoEntities.description = `${fieldMappings[field]}: ${fieldValue}`;
                        memoEntities.employeeId = saveResult.id;
                        memoEntities.isActive = employee.isActive;
                        memoEntities.createdUser = employee.createdUser;
                        memoEntities.updatedUser = employee.updatedUser;
                        await this.memoRepo.save(memoEntities);
                    }
                }
            }
            const savePayrollRecords = await this.payrollRecordsSharedService.generateEmpPayrollRecordsByEmpId({
                employeeId: saveResult.id,
                grossAmount: employeeData.salary
            });
            if (savePayrollRecords) {
                return new CommonResponseModel(true, 1, 'Employee created Successfully', saveResult);
            }
        } catch (error) {
            return new CommonResponseModel(false, 0, 'Error in employee creation', error);
        }
    }

    async updateSalaryForEmployee(req: any): Promise<CommonResponseModel> {
        try {
            const employeeIdData = req.id.id
            const componentRecordsData = req.componentKeys.reduce((acc, curr) => {
                const [key, value] = Object.entries(curr)[0];
                acc[key] = value;
                return acc;
            }, {});
            const update = await this.employeeDetailRepo.update({ id: employeeIdData }, { salary: componentRecordsData.GROSS, isEsicEligible: req.isEsicEligible, attendanceAllowance: req.incentive })
            if (update.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated SuccessFully');
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async compareEmployeeLogs(oldData: EmployeeDetailsDto, newData: EmployeeDetailsDto): Promise<Record<string, { oldValue: any; newValue: any }>> {
        const changes: Record<string, { oldValue: any; newValue: any }> = {};

        if (!oldData || !newData) {
            console.log("Both old and new data must be defined.");
        }

        for (const key in oldData) {
            if (oldData && typeof oldData === "object" && oldData.hasOwnProperty(key) && newData && typeof newData === "object" && newData.hasOwnProperty(key)) {
                const oldValue = oldData[key];
                const newValue = newData[key];

                if (dayjs(oldValue).isValid() && dayjs(newValue).isValid()) {
                    if (!dayjs(oldValue).isSame(dayjs(newValue), "day")) {
                        changes[key] = { oldValue, newValue };
                    }
                } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                        changes[key] = { oldValue, newValue };
                    }
                } else if (oldValue !== newValue) {
                    changes[key] = { oldValue, newValue };
                }
            } else if (oldData.hasOwnProperty(key) && (!newData || !newData.hasOwnProperty(key))) {
                changes[key] = { oldValue: oldData[key], newValue: null };
            } else if ((!oldData || !oldData.hasOwnProperty(key)) && newData.hasOwnProperty(key)) {
                changes[key] = { oldValue: null, newValue: newData[key] };
            }
        }
        return changes;
    }

    async filterChangedFields(oldData: any, newData: any, branch: any) {
        const changedValues: Record<string, any> = {};
        const keysOfNewData = Object.keys(newData);
        for (const key of keysOfNewData) {
            const oldValue = oldData[key];
            let newValue = newData[key];
            if (oldValue === newValue) {
                continue
            }
            if (dayjs(oldValue).isValid() && dayjs(newValue).isValid()) {
                if (!dayjs(oldValue).isSame(dayjs(newValue), "day")) {
                    changedValues[key] = { oldValue, newValue };
                }
            } else if (key === 'departmentId') {
                const department = await this.dataSource.getRepository(DepartmentsEntity).findOne({
                    select: ['name'],
                    where: { id: newValue },
                });

                if (department && newValue !== oldData[key]?.id) {
                    changedValues[key] = {
                        oldValue: oldData[key]?.name || null,
                        newValue: department.name || null,
                    };
                }
            } else if (key === 'designationId') {
                const designation = await this.dataSource.getRepository(DesignationsEntity).findOne({
                    select: ['name'],
                    where: { id: newValue },
                });

                if (designation && newValue !== oldData[key]?.id) {
                    changedValues[key] = {
                        oldValue: oldData[key]?.name || null,
                        newValue: designation.name || null,
                    };
                }
            } else if (key === 'branchId') {
                const branch = await this.dataSource.getRepository(Branches).findOne({
                    select: ['branchName'],
                    where: { id: newValue },
                });

                if (branch && newValue !== oldData[key]?.id) {
                    changedValues[key] = {
                        oldValue: oldData[key]?.branchName || null,
                        newValue: branch.branchName || null,
                    };
                }
            } else if (key === 'divisionId') {
                const division = await this.dataSource.getRepository(Division).findOne({
                    select: ['divisionName'],
                    where: { id: newValue },
                });

                if (division && newValue !== oldData[key]?.id) {
                    changedValues[key] = {
                        oldValue: oldData[key]?.divisionName || null,
                        newValue: division.divisionName || null,
                    };
                }
            } else if (Array.isArray(oldValue) || Array.isArray(newValue)) {
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    changedValues[key] = { oldValue, newValue };
                }
            } else {
                changedValues[key] = { oldValue: oldValue ?? null, newValue: newValue ?? null };
            }
        }

        const fieldDisplayNames: Record<string, string> = {
            firstName: 'First Name',
            lastName: 'Last Name',
            maritalStatus: 'Marital Status',
            salutation: 'Salutation',
            employeeTypeId: 'Employee Type',
            employeeCode: 'Employee Code',
            dateOfBirth: 'Date of Birth',
            gender: 'Gender',
            departmentId: 'Department',
            designationId: 'Designation',
            branchId: 'Branch',
            divisionId: 'Division',
            dateOfJoining: 'Date of Joining',
            prohibitionPeriod: 'Prohibition Period',
            mobileNo: 'Mobile Number',
            emailId: 'Email',
            dateOfReliving: 'Date of Relieving',
            reasonOfReliving: 'Reason of Relieving',
            emergencyContactNo: 'Emergency Contact No',
            bloodGroup: 'Blood Group',
            shiftGroup: 'Shift Group',
            travellingAllowance: 'Travelling Allowance',
            timeRestrictions: 'Time Restrictions',
            attendanceAllowance: 'Attendance Allowance',
            accommodation: 'Accommodation',
            currentAddress: 'Current Address',
            currentPincode: 'Current Pincode',
            currentVillage: 'Current Village',
            currentDistrict: 'Current District',
            currentState: 'Current State',
            currentCountry: 'Current Country',
            permanentAddress: 'Permanent Address',
            permanentPincode: 'Permanent Pincode',
            permanentVillage: 'Permanent Village',
            permanentDistrict: 'Permanent District',
            permanentState: 'Permanent State',
            permanentCountry: 'Permanent Country',
            pfNo: 'PF Number',
            esicNo: 'ESIC Number',
            bankName: 'Bank Name',
            bankAcNo: 'Bank Account Number',
            bankIfscCode: 'Bank IFSC Code',
            paymode: 'Pay Mode',
        };

        const specificChanges = Object.entries(changedValues).filter(([_, { oldValue, newValue }]) =>
            oldValue !== null && oldValue !== undefined && newValue !== null && oldValue !== newValue
        );

        const oldValuesJson: Record<string, any> = {};
        const newValuesJson: Record<string, any> = {};

        specificChanges.forEach(([key, { oldValue, newValue }]) => {
            const displayName = fieldDisplayNames[key] || key;
            oldValuesJson[displayName] = oldValue;
            newValuesJson[displayName] = newValue;
        });

        const combinedNewValues = Object.entries(newValuesJson)
            .map(([field, value]) => `${field} changed to ${value}`)
            .join(' || ');
        return {
            combinedNewValues,
            oldValuesJson,
            newValuesJson,
        };
    }

    async updateEmployee(employeeData: EmployeeDetailsDto): Promise<CommonResponseModel> {
        try {
            const branch = await this.branchService.getActiveBranches()
            const oldEmployeeData = await this.employeeDetailRepo.findOne({ relations: ['departmentId', 'designationId', 'branchId', 'divisionId'], where: { id: employeeData.id } });
            let oldDataJson: {};
            oldDataJson = { oldEmployeeCode: oldEmployeeData.employeeCode, }
            const { combinedNewValues, oldValuesJson, newValuesJson } = await this.filterChangedFields(oldEmployeeData, employeeData, branch);
            employeeData.oldEmployeeCode = oldDataJson
            const employeeEntity = this.employeesAdapter.convertDtoToEntity(employeeData);

            /* Memo Saving */
            for (const key in oldValuesJson) {
                if (oldValuesJson[key] !== newValuesJson[key]) {
                    let memoEntities = new MemoEntity();
                    memoEntities.date = new Date().toISOString().split('T')[0];
                    memoEntities.type = `${key} Change`;
                    memoEntities.feedBackOn = `${employeeData.firstName} ${employeeData.lastName}`;
                    memoEntities.impactOnBussiness = "Employee Updation";
                    memoEntities.employeeId = employeeData.id;
                    memoEntities.isActive = employeeData.isActive;
                    memoEntities.createdUser = employeeData.createdUser;
                    memoEntities.updatedUser = employeeData.updatedUser;
                    memoEntities.description = `${key} changed from ${oldValuesJson[key]} to ${newValuesJson[key]}`;
                    await this.memoRepo.save(memoEntities);
                }
            }
            const saveResult = await this.employeeDetailRepo.save(employeeEntity);

            const employeeLogsDTO = {
                employeeId: employeeEntity.id,
                actionType: 'Update',
                role: employeeEntity.role,
                previousValues: JSON.stringify(oldValuesJson),
                updatedValues: JSON.stringify(newValuesJson),
                remarks: combinedNewValues,
                updatedUser: employeeData.updatedUser,
            };
            await this.employeeLogService.createEmployeeLogs(employeeLogsDTO)
            if (saveResult) {
                const x = await this.bankDetailsRepo.find({ where: { empId: employeeData.id, isActive: true, bankAcNo: employeeData.bankAcNo, bankIfscCode: employeeData.bankIfscCode, bankName: employeeData.bankName } })
                if (x.length === 0) {
                    console.log("---------------------")
                    await this.bankDetailsRepo.update(
                        { empId: employeeData.id, isActive: true },
                        {
                            isActive: false
                        })
                    const reqData = new BankDetailsEntity();
                    reqData.empId = saveResult.id;
                    reqData.bankAcNo = employeeData.bankAcNo;
                    reqData.bankIfscCode = employeeData.bankIfscCode;
                    reqData.bankName = employeeData.bankName;
                    reqData.employeeCode = employeeData.employeeCode;
                    reqData.bankEffDate = employeeData.bankEffDate;
                    reqData.cashEffDate = employeeData.cashEffDate;
                    reqData.isActive = true;
                    await this.bankDetailsRepo.save(reqData);
                } else {
                    console.log("*****************")
                }
                const existingData = await this.pfEsiEffDatesRepo.findOne({
                    where: {
                        empId: employeeData.id,
                        pfNo: employeeData.pfNo,
                        isPfEligible: employeeData.isPfEligible,
                        pfEffFromDate: dayjs(employeeData.pfEffFromDate).format('YYYY-MM-DD') ? dayjs(employeeData.pfEffFromDate).format('YYYY-MM-DD') : '-',
                        esicEffFromDate: dayjs(employeeData.esicEffFromDate).format('YYYY-MM-DD') ? dayjs(employeeData.esicEffFromDate).format('YYYY-MM-DD') : '-',
                        esicNo: employeeData.esicNo,
                        isEsicEligible: employeeData.isEsicEligible,
                    }
                })
                if (existingData) {
                    console.log("Same Data No Actions Required");
                } else {
                    await this.pfEsiEffDatesRepo.update(
                        { empId: employeeData.id, employeeCode: employeeData.employeeCode },
                        { isActive: false }
                    )
                    await this.pfEsiEffDatesRepo.save({
                        empId: employeeData.id,
                        employeeCode: employeeData.employeeCode,
                        pfNo: employeeData.pfNo,
                        isPfEligible: employeeData.isPfEligible,
                        pfEffFromDate: dayjs(employeeData.pfEffFromDate).format("YYYY-MM-DD"),
                        esicNo: employeeData.esicNo,
                        isEsicEligible: employeeData.isEsicEligible,
                        esicEffFromDate: dayjs(employeeData.esicEffFromDate).format("YYYY-MM-DD"),
                        isActive: true
                    })
                    console.log("New Record and Is Active Actions Done");
                }
            }
            if (saveResult) {
                return new CommonResponseModel(true, 1, 'Employee Updated Successfully', saveResult);
            } else {
                return new CommonResponseModel(false, 0, 'Error in employee updation');
            }

        } catch (error) {
            console.log(error)
            return new CommonResponseModel(false, 0, 'Error in employee updation', error);
        }
    }

    async getAllEmployeesTable(): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getAllEmployeesTable();
            const allData = await this.employeeDetailRepo.find({ relations: ["employeeFamilyDetails", "employeeEduDetails"] })

            // for (const ele of data) {
            //     const entity = new Employee();
            //     entity.id = ele.id;
            //     const empFamilyData = await this.empFamilyRepo.find({ relations: ['employee'], where: { employee: entity } })
            //     for (const item of empFamilyData) {
            //         ele.employeeFamilyDetails.push(new EmployeeFamilyDetailsDto(item.id, item.familyMemName, item.relation, item.contactNo, item.aadhaarNo, null))
            //     }

            //     const empEducationData = await this.empEducationRepo.find({ relations: ['employee'], where: { employee: entity } })
            //     for (const item of empEducationData) {
            //         ele.employeeEduDetails.push(new EmployeeEduDetailsDto(item.id,item.empQualification, item.specialization,item.yearOfPass,item.percentage))
            //     }

            //     const empExperienceData = await this.empExperienceRepo.find({ relations: ['employee'], where: { employee: entity } })
            //     for (const item of empExperienceData) {
            //         ele.employeeExperienceDetails.push(new EmployeeExperienceDetailsDto(item.id,item.organisation,item.fromDate,item.toDate,item.yearOfExp))
            //     }

            //     const empIdProofData = await this.empIdProofRepo.find({ relations: ['employee'], where: { employee: entity } })
            //     for (const item of empIdProofData) {
            //         ele.employeeIdProofs.push(new EmployeeIdProofsDto(item.id,null,item.idType,item.idNumber))
            //     }

            // }
            return new CommonResponseModel(true, 1, 'Data Retrived', allData)
        } catch (err) {
            console.log(err);
        }
    }

    async getAllEmployees(req: EmployeeFilterReq, isExcel: boolean): Promise<EmployeeViewResponseModel> {
        const { data: dataSource } = await this.employeeDetailRepo.getAllEmployees(req, isExcel);
        const { data, total: count, totalActive, totalInactive, employeeData, employeesTypeCount, workersTypeCount } = dataSource
        const employeeDataArr = data.map((v) => {
            const employeeDataObj = new EmployeeViewModel();
            employeeDataObj.id = v.employeeId;
            employeeDataObj.fullName = v.fullName;
            employeeDataObj.employeeCode = v.employeeCode;
            employeeDataObj.employeeId = v.employeeId;
            employeeDataObj.salutation = v.salutation;
            employeeDataObj.empImage = v.empImage;
            employeeDataObj.aadhaarNo = v.aadhaarNo;
            employeeDataObj.firstName = v.firstName;
            employeeDataObj.lastName = v.lastName;
            employeeDataObj.dateOfBirth = v.dateOfBirth;
            employeeDataObj.gender = v.gender;
            employeeDataObj.departmentId = v.departmentId;
            employeeDataObj.designationId = v.designationId;
            employeeDataObj.branchId = v.branchId;
            employeeDataObj.division = v.division;
            employeeDataObj.dateOfJoining = v.dateOfJoining;
            employeeDataObj.mobileNo = v.mobileNo;
            employeeDataObj.emailId = v.emailId;
            employeeDataObj.currentAddress = v.currentAddress;
            employeeDataObj.currentState = v.currentState;
            employeeDataObj.currentPincode = v.currentPincode;
            employeeDataObj.permanentAddress = v.permanentAddress;
            employeeDataObj.permanentState = v.permanentState;
            employeeDataObj.permanentPincode = v.permanentPincode;
            employeeDataObj.salary = v.salary;
            employeeDataObj.pfNo = v.pfNo;
            employeeDataObj.esicNo = v.esicNo;
            employeeDataObj.bankName = v.bankName;
            employeeDataObj.bankAcNo = v.bankAcNo;
            employeeDataObj.bankBranch = v.bankBranch;
            employeeDataObj.bankEffDate = v.bankEffDate;
            employeeDataObj.bankIfscCode = v.bankIfscCode;
            employeeDataObj.nominee = v.nominee;
            employeeDataObj.reportingManager = v.reportingManager;
            employeeDataObj.reportingManagerName = v.reportingManagerName;
            employeeDataObj.dateOfReliving = v.dateOfReliving;
            employeeDataObj.reasonOfReliving = v.reasonOfReliving;
            employeeDataObj.filePath = v.filePath;
            employeeDataObj.fileName = v.fileName;
            employeeDataObj.originalName = v.originalname;
            employeeDataObj.branchName = v.branchName;
            employeeDataObj.departmentName = v.departmentName;
            employeeDataObj.designationName = v.designationName;
            employeeDataObj.divisionName = v.divisionName;
            employeeDataObj.isActive = v.isActive;
            employeeDataObj.createdAt = v.createdAt;
            employeeDataObj.referanceEmployeeName = v.referanceEmployeeName;
            employeeDataObj.empTypeName = v.empTypeName;
            employeeDataObj.payMode = v.payMode;
            employeeDataObj.bloodGroup = v.bloodGroup;
            employeeDataObj.uan = v.uan;
            employeeDataObj.maritualStatus = v.maritualStatus;
            employeeDataObj.shift = v.shift;
            employeeDataObj.isPfEligible = v.isPfEligible;
            employeeDataObj.isEsicEligible = v.isEsicEligible;
            employeeDataObj.esicEffFromDate = v.esicEffFromDate;
            employeeDataObj.pfEffFromDate = v.pfEffFromDate;
            employeeDataObj.employeeStatus = v.employeeStatus;
            employeeDataObj.travellingAllowance = v.travellingAllowance;
            employeeDataObj.timeRestrictions = v.timeRestrictions;
            employeeDataObj.attnAllowance = v.attnAllowance;
            employeeDataObj.accomdation = v.accomdation;
            employeeDataObj.employeeType = v.employeeType;
            employeeDataObj.employeeTypeIdData = v.employeeTypeIdData;

            return employeeDataObj;
        });

        if (employeeDataArr.length > 0) {
            return new EmployeeViewResponseModel(true, 1, 'Data Retrieved Successfully', employeeDataArr, count, totalActive, totalInactive, employeeData, employeesTypeCount, workersTypeCount);
        }

        return new EmployeeViewResponseModel(false, 0, 'No data found', [], 0);
    }

    async excelDownload(values): Promise<Buffer> {
        const res = await this.getAllEmployees(values, true);
        const formattedData = res.data.map((rec) => {
            let yearsOfExperience = "-";
            if (rec.dateOfJoining) {
                const startDate = dayjs(rec.dateOfJoining);
                const today = dayjs();
                const diff = dayjs.duration(today.diff(startDate));
                yearsOfExperience = `${diff.years()}y ${diff.months()}m ${diff.days()}d`;
            }

            let isActiveData = Boolean(rec.isActive) ? "Yes" : "No";
            let payCycle = rec.empTypeName === "EMPLOYEE" ? "Monthly" : "Day Wise";
            return {
                'ID': rec.employeeCode || '-',
                'Employee Name': rec.fullName || '-',
                'Employee Type': rec.empTypeName || '-',
                'Branch Name': rec.branchName || '-',
                'Department Name': rec.departmentName || '-',
                'Designation Name': rec.designationName || '-',
                'Division Name': rec.divisionName || '-',
                'Reference Employee': rec.referanceEmployeeName || '-',
                'Reporting Manager': rec.reportingManagerName || '-',
                'Aadhar Number': rec.aadhaarNo || '-',
                'Date Of Birth': rec.dateOfBirth || '-',
                'Gender': rec.gender || '-',
                'Maritual Status': rec.maritualStatus || '-',
                'Date Of Joining': rec.dateOfJoining || '-',
                'Years Of Experience': yearsOfExperience || '-',
                'Employee Status': rec.employeeStatus || '-',
                'Travelling Allowance': rec.travellingAllowance || '-',
                'Time Restrictions': rec.timeRestrictions || '-',
                'Attendance Allowance': rec.attnAllowance || '-',
                'Accomdation': rec.accomdation || '-',
                'Mobile No': rec.mobileNo || '-',
                'Email Id': rec.emailId || '-',
                'Current Address': rec.currentAddress || '-',
                'Current State': rec.currentState || '-',
                'Current Pincode': rec.currentPincode || '-',
                'Permanent Address': rec.permanentAddress || '-',
                'Permanent State': rec.permanentState || '-',
                'Permanent Pincode': rec.permanentPincode || '-',
                'Salary': rec.salary || '-',
                'Pay Cycle': payCycle || '-',
                'Payment Method': rec.payMode || '-',
                'Bank Name': rec.bankName || '-',
                'Bank Ac No': rec.bankAcNo || '-',
                'Bank Ifsc Code': rec.bankIfscCode || '-',
                'Bank Branch': rec.bankBranch || '-',
                'Bank Eff Date': rec.bankEffDate || '-',
                'Shift': rec.shift || '-',
                'Is PF Eligible': rec.isPfEligible || '-',
                'PF No': rec.pfNo || '-',
                'PF Eff From Date': rec.pfEffFromDate || '-',
                'Is ESIC Eligible': rec.isEsicEligible || '-',
                'Esic No': rec.esicNo || '-',
                'Esic Eff From Date': rec.esicEffFromDate || '-',
                'UAN': rec.uan || '-',
                'Nominee': rec.nominee || '-',
                'Blodd Group': rec.bloodGroup || '-',
                'Date Of Reliving': rec.dateOfReliving || '-',
                'Reason Of Reliving': rec.reasonOfReliving || '-',
                'Active/In Active': isActiveData || '-',
                'Employee Creation Date': rec.createdAt || '-',
            }
        })
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const adjustColumnWidths = (data: any[]) => {
            if (!data.length) return [];
            return Object.keys(data[0]).map((key) => {
                const maxLength = Math.max(
                    key.length,
                    ...data.map((row) => row[key] ? row[key].toString().length : 0)
                );
                return { wch: maxLength + 5 };
            });
        };
        ws["!cols"] = adjustColumnWidths(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer', });
        return buffer;
    }

    async getReportManagaerWithEmployeess(): Promise<CommonResponseModel> {
        const result = await this.employeeDetailRepo.getReportingManagerWithActiveAndEmployeeRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', result);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async getAllReportingManagerAndCode(): Promise<CommonResponseModel> {
        const result = await this.employeeDetailRepo.getAllReportingManagerAndCodeRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', result);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }
    async getAllRMData(): Promise<CommonResponseModel> {
        const result = await this.employeeDetailRepo.getAllRMAndAssignedEmployeesRepo();
        if (result.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', result);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    // async excelDownloadData(values: {department?: string;designation?: string;branchId?: string;employee?: string;employeeCode?: string;}): Promise<Buffer> {
    //     console.log(values, "OOO");
    //     const res = await this.getAllEmployees(values, true);
    //     if (!res.data || res.data.length === 0) {
    //         throw new Error('No data available for the given filters.');
    //     }
    //     const ws = XLSX.utils.json_to_sheet(res.data);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    //     return XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    // }

    // async getActiveEmployeeList(req?: any): Promise<ActiveEmployeesForAttendanceResponseModel> {
    //     let query = this.employeeDetailRepo.createQueryBuilder('employee')
    //         .select([
    //             'employee.id AS id',
    //             'employee.employee_code AS employeeCode',
    //             'employee.first_name AS firstName',
    //             'employee.department_id AS departmentId',
    //             'employee.designation_id AS designationId',
    //             'employee.branch_id AS branchId',
    //         ])
    //         .where('employee.isActive = :isActive', { isActive: true });

    //     if (req?.employeeTypeId) {
    //         query.andWhere('employee.employeeTypeId = :employeeTypeId', { employeeTypeId: req.employeeTypeId });
    //     }

    //     const activeEmployeeList = await query.getRawMany();

    //     console.log(activeEmployeeList, "-----------activeEmployeeList-----------");

    //     const data = activeEmployeeList.map((v) => ({
    //         employeeId: Number(v.id),
    //         employeeCode: v.employeeCode,
    //         employeeName: v.firstName,
    //         departmentId: Number(v.departmentId) || null,
    //         designationId: Number(v.designationId) || null,
    //         branchId: Number(v.branchId),
    //         employeeType: ""
    //     }));

    //     return new ActiveEmployeesForAttendanceResponseModel(true, 1, "Data Retrieved Successfully", data);
    // }


    async getActiveEmployeeList(req?: any): Promise<ActiveEmployeesForAttendanceResponseModel> {
        let query = this.employeeDetailRepo.createQueryBuilder('employee')
            .leftJoin('branches', 'branch', 'branch.id = employee.branch_id')
            .select([
                'employee.id AS id',
                'employee.employee_code AS employeeCode',
                'employee.first_name AS firstName',
                'employee.department_id AS departmentId',
                'employee.designation_id AS designationId',
                'employee.branch_id AS branchId',
                'branch.branch_name AS branchName'
            ])
            .where('employee.isActive = :isActive', { isActive: true });

        if (req?.employeeTypeId) {
            query.andWhere('employee.employeeTypeId = :employeeTypeId', { employeeTypeId: req.employeeTypeId });
        }

        const activeEmployeeList = await query.getRawMany();

        const data = activeEmployeeList.map((v) => ({
            employeeId: Number(v.id),
            employeeCode: v.employeeCode,
            employeeName: v.firstName,
            departmentId: Number(v.departmentId) || null,
            designationId: Number(v.designationId) || null,
            branchId: Number(v.branchId),
            branchName: v.branchName || null,
            employeeType: ""
        }));

        return new ActiveEmployeesForAttendanceResponseModel(true, 1, "Data Retrieved Successfully", data);
    }


    async getAllActiveEmpForAttendance(req?: BranchReq): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getAllActiveEmployees(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retried Successfully', data)
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found', [])
        }
    }

    async getAllActiveEmpForAttendances(): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getAllActiveEmployees()
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retried Successfully', data)
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found', [])
        }
    }


    async getInActiveEmployeeList(req?: DashboardReq): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getInActiveEmployeeList(req)
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retried Successfully', data)
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found', [])
        }
    }

    async getAllEmpAginstDepartment(): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getAllEmpAginstDepartment()
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrived sucessfully', data)
        } else {
            return new CommonResponseModel(false, 0, 'No Data Found', [])
        }
    }

    async activateAndDeactiveEmployees(req: EmployeesActivateDeactivateDto): Promise<CommonResponseModel> {
        try {
            const exists = await this.employeeDetailRepo.findOne({ where: { id: req.employeeId } });
            if (!exists) {
                throw new CommonResponseModel(false, 77787, 'No Empolyees Found');
            }
            const update = await this.employeeDetailRepo.update(
                { id: req.employeeId },
                { isActive: req.isActive }
            );
            if (exists.isActive && !req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Deactivated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Deactivated');
                }
            } else if (!exists.isActive && req.isActive) {
                if (update.affected) {
                    return new CommonResponseModel(true, 1, 'Activated SuccessFully');
                } else {
                    throw new CommonResponseModel(false, 0, 'Already Activated');
                }
            } else {
                return new CommonResponseModel(false, 0, 'No changes were Made');
            }
        } catch (err) {
            return err;
        }
    }

    async getAllEmployeeData(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getAllEmployeesData();

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async getAllEmployeesData(req: any): Promise<CommonResponseModel> {
        try {
            const rawData = await this.employeeDetailRepo.getAllEmployeeData(req);

            if (rawData) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
            } else {
                return new CommonResponseModel(false, 0, 'Failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllReportManagerData(req: any): Promise<CommonResponseModel> {
        try {
            const rawData = await this.employeeDetailRepo.getAllReportManagerData(req);
            if (rawData) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
            } else {
                return new CommonResponseModel(false, 0, 'Failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllEmployeeNameAndCodeAgainstEmpId(): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getAllFirstLastNameEmpCode()
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }
    async getAllEmployeeNameAndCodeAgainstEmpIds(req: ApplyLeaveBrachDto): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getAllFirstLastNameEmpCodes(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }


    async updateEmployeeReportingManager(req: EmployeeRMRequest): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeDetailRepo.updateReportingManagerRepo(req);

            if (result.affected && result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated', result);
            } else {
                return new CommonResponseModel(false, 0, 'Failed to Update');
            }

        } catch (err) {
            console.error("Error updating reporting manager:", err);
            return new CommonResponseModel(false, 0, 'Error while updating reporting manager', err.message);
        }
    }

    async getEmployeeWithReportingManager(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getEmployeeWithReportingManagerRepo();
        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }


    async getActiveEmployeeDropdownData(): Promise<DropdownResponseModel> {
        const employees = await this.employeeDetailRepo.find({ select: ["id", "firstName", "lastName"], where: { isActive: true } });

        if (!employees.length) {
            return new DropdownResponseModel(false, 0, 'No data found', []);
        }

        const dropdownData: DropdownModel[] = employees.map(({ id, firstName, lastName }) => ({
            value: id,
            label: `${firstName} ${lastName}`,
        }));

        return new DropdownResponseModel(true, 1, 'Data Retrieved Successfully', dropdownData);

    }
    async getAllEmployeesForShiftMap(req: EmployeeShiftReq): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getAllEmployeesForShiftMap(req);

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }
    async getBranchesInEmpDetails(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getBranchesInEmpDetails();

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async getDepartmentsInEmpDetails(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getDepartmentsInEmpDetails();

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }
    async getDivisionsInEmpDetails(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getDivisionsInEmpDetails();

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async updateEmpLogsByShiftCode(req: EmployeeShiftUpdateReq): Promise<CommonResponseModel> {

        try {
            const empId = req.employeeIds;
            const shiftGroup = req.shiftGroup;

            await this.employeeDetailRepo.update(
                { id: In(empId) },
                { shift: shiftGroup }
            );

            return new CommonResponseModel(true, 11101, 'Updated Successfully');
        } catch (error) {
            return new CommonResponseModel(false, 11102, 'Update failed', error.message);
        }
    }

    async getEmpById(req: EmployeIdReq): Promise<CommonResponseModel> {
        try {
            const employeeData = await this.employeeDetailRepo.getEmployeeDetailsById(req.employeeId);
            if (employeeData) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', employeeData);
            } else {
                return new CommonResponseModel(false, 0, 'No Employee Data Found', null);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return new CommonResponseModel(false, -1, 'An error occurred while fetching employee data', null);
        }
    }


    async getEmpDetailsReport(req: EmpDataReq): Promise<CommonResponseModel> {
        try {
            const employeeData = await this.employeeDetailRepo.getEmployeeDetailsByRepo(req);
            if (employeeData) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', employeeData);
            } else {
                return new CommonResponseModel(false, 0, 'No Employee Data Found', null);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return new CommonResponseModel(false, -1, 'An error occurred while fetching employee data', null);
        }
    }

    async getBankPaymentReport(): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getBankPaymentReport();
        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async getBankPaymentChildReport(req: BankPaySharedDto): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getBankPaymentChildReport(req)
        if (data.length > 0) {

            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async saveEmployeePrefixConfigurations(employeePrefixConfigurations: PrefixConfigurationDTO): Promise<CommonResponseModel> {
        const prefixConfigurationEntity = new PrefixConfiguration()
        prefixConfigurationEntity.employeeTypeId = employeePrefixConfigurations.employeeTypeId;
        prefixConfigurationEntity.selectedFields = employeePrefixConfigurations.selectedFields.join(',');
        prefixConfigurationEntity.fieldPositions = employeePrefixConfigurations.fieldPositions;
        prefixConfigurationEntity.customFieldText = employeePrefixConfigurations.customFieldText
        const isConfigExists = await this.prefixConfigurationRepo.findOneBy({ employeeTypeId: employeePrefixConfigurations.employeeTypeId })
        if (isConfigExists) {
            await this.prefixConfigurationRepo.update({ employeeTypeId: employeePrefixConfigurations.employeeTypeId }, { ...prefixConfigurationEntity })
            return new CommonResponseModel(true, 1, 'Prefix Configuration updated sucessfully')

        } else {
            await this.prefixConfigurationRepo.save(prefixConfigurationEntity)
            return new CommonResponseModel(true, 1, 'Prefix Configuration saved sucessfully')
        }
    }

    async getPrefixConfigForEmpType(employeeTypeId: number): Promise<CommonResponseModel> {
        const lastEntity = await this.employeeDetailRepo.find({
            order: { id: 'DESC' }, // Replace 'id' with your primary key column name
            take: 1, // Fetch only the last record
            select: ['id']
        });
        const res = await this.prefixConfigurationRepo.find({ where: { employeeTypeId: employeeTypeId } })

        if (!res.length) return new CommonResponseModel(false, 11, "Employee configuration not done yet")
        res[0]["autogeneratedId"] = lastEntity[0].id + 1

        return new CommonResponseModel(true, 1, 'Prefix Configuration', res)
    }


    async employeeWhastappApi(req: any): Promise<any> {
        try {
            const entity = new Employee()
            entity.salutation = req.salutation
            entity.firstName = req.firstName
            entity.lastName = req.lastName
            entity.employeeCode = req.employeeCode
            entity.dateOfBirth = req.dateOfBirth
            const phoneNumbers = [8374969391];

            for (const phoneNumber of phoneNumbers) {
                const messageText = `Employee Name :  ${entity.salutation} ${entity.firstName} ${entity.lastName}\\nEmployee Code  :  ${entity.employeeCode}\\nDate of Birth  :  ${dayjs(entity.dateOfBirth).format("DD-MM-YYYY")}`;
                await this.whatsService.newEmployeeCreatedWhatsappTemplate(
                    phoneNumber,
                    messageText,
                    'new_employee_details'
                );

            }

            return new CommonResponseModel(true, 1, 'MessageSended')
        } catch (error) {
            console.error('Error sending bot alert:', error);
        }
    }
    async getHeadCount(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const [totalEmpCount, totalActiveEmpCount, totalInActiveEmpCount, totalNewJoins, totalReJoins] = await Promise.all([
                this.employeeDetailRepo.totalEmpCount(req),
                this.employeeDetailRepo.totalActiveEmpCount(req),
                this.employeeDetailRepo.totalInActiveEmpCount(req),
                this.employeeDetailRepo.totalNewJoins(req),
                this.employeeDetailRepo.totalReJoins(req)
            ]);

            const headCountData = [{
                totalEmp: totalEmpCount[0].totalEmp,
                totalMaleCount: totalEmpCount[0].maleCount,
                totalFemaleCount: totalEmpCount[0].femaleCount,
                totalActiveEmp: totalActiveEmpCount[0].totalEmp,
                totalActiveMaleCount: totalActiveEmpCount[0].maleCount,
                totalActiveFemaleCount: totalActiveEmpCount[0].femaleCount,
                totalInActiveEmp: totalInActiveEmpCount[0].totalEmp,
                totalInActiveMaleCount: totalInActiveEmpCount[0].maleCount,
                totalInActiveFemaleCount: totalInActiveEmpCount[0].femaleCount,
                totalNewEmp: totalNewJoins[0].totalEmp,
                totalNewMale: totalNewJoins[0].maleCount,
                totalNewFemale: totalNewJoins[0].femaleCount,
                totalRejoinEmp: totalReJoins[0].totalEmp,
                totalRejoinMale: totalReJoins[0].maleCount,
                totalRejoinFemale: totalReJoins[0].femaleCount,
            }]

            return new CommonResponseModel(true, 1, 'Data Retrieved', headCountData)
        } catch (err) {
            throw err;
        }
    }

    async getBranchAgaintEmployess(req: BranchReqDto): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getBranchAgainstEmployees(req);
        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async attendanceWhatsappAlertCountEmployee(): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.attendanceWhatsappAlertCountEmployee()
            if (data) {
                return new CommonResponseModel(true, 1, 'Data', data)
            } else {
                return new CommonResponseModel(false, 0, 'Failed')
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getEmpCodeByDetails(req: EmployeeCodeReq): Promise<CommonResponseModel> {

        try {
            const data = await this.employeeDetailRepo.getCmpCodeByEmpDetails(req)
            if (data) {

                return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
            }

        } catch (err) {
            return err
        }
    }

    async getEmpDetailsByBranch(req?: BranchReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getAllEmployeesByBranch(req)
            if (data) {
                return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 1, 'Date not Found', data)
            }

        } catch (err) {
            return err
        }
    }

    async getConfigurations(req: any): Promise<CommonResponseModel> {
        const data = await this.employeeFormConfigurationRepo.find({
            where: { employeeType: req.employeeType },
            order: { displayOrder: 'ASC' }, // Ensures fields are returned in the correct display order
        });
        return new CommonResponseModel(true, 1, 'Fetched Successfully', data)
    }

    async saveOrUpdateConfigurations(configDetails: EmployeeFormConfiguration[]): Promise<CommonResponseModel> {
        // Ensure there are valid configuration details provided
        if (!Array.isArray(configDetails) || configDetails.length === 0) {
            throw new Error('Configuration details are required');
        }

        // Iterate and normalize data if necessary (e.g., setting defaults)
        const normalizedConfigurations = configDetails.map((config) => {
            return {
                ...config,
                isOptional: config.isOptional ?? false,
                isVisible: config.isVisible ?? true,
                isEditable: config.isEditable ?? true,
            };
        });

        // Save all configurations (handles both create and update)
        const saved = await this.employeeFormConfigurationRepo.save(normalizedConfigurations);
        return new CommonResponseModel(true, 1, '', saved)
    }

    async employeeImageUpload(filePath: string, filename: string, id: number, originalname: string): Promise<CommonResponseModel> {
        try {
            //   const findExistedFile = await this.buyerRepo.findOne({ where: { id: id } })
            //   if (findExistedFile?.fileName) {
            //     const path = join(__dirname, '../../../../', 'image_files', findExistedFile?.fileName)
            //     if (fs.existsSync(path)) {
            //       fs.unlinkSync(path)
            //     }
            //   }
            const filePathUpdate = await this.employeeDetailRepo.update(
                { id: id },
                { filePath: filePath, fileName: filename, originalName: originalname },
            );
            if (filePathUpdate.affected > 0) {
                return new CommonResponseModel(true, 11, 'Uploaded Successfully', filePath);
            }
            else {
                return new CommonResponseModel(false, 11, 'Uploaded failed', filePath);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async employeeDocumentUpload(files: Express.Multer.File[], idProofs: any[], data: any): Promise<CommonResponseModel> {
        try {
            const empId = Number(data.empId);
            if (!empId) {
                throw new Error("Employee ID is missing or invalid.");
            }

            const fileRecords = files.map(file => ({
                employee: { id: empId },
                filePath: file.path,
                fileName: file.filename,
                originalFileName: file.originalname,
                fileType: file.mimetype,
            }));

            for (let i = 0; i < idProofs.length; i++) {
                const expId = idProofs[i].id ? Number(idProofs[i].id) : null;

                const existingRecord = await this.empIdProofRepo.findOne({ where: { id: expId, employee: { id: empId } }, });

                if (existingRecord) {
                    await this.empIdProofRepo.update({ id: expId, employee: { id: empId } }, fileRecords[i]);
                } else {
                    await this.empIdProofRepo.save({ ...fileRecords[i] });
                }
            }
            return new CommonResponseModel(true, 200, 'Uploaded and saved Successfully', fileRecords);
        } catch (error) {
            console.error("Error handling employee document upload:", error);
            return new CommonResponseModel(false, 500, 'Internal Server Error', null);
        }
    }


    async getAllEmployeeApprovalData(): Promise<CommonResponseModel> {

        try {
            const data = await this.employeeDetailRepo.getAllEmployeeApprovalData()
            if (data) {
                return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 1, 'Date not Found', data)
            }

        } catch (err) {
            return err
        }
    }

    async getUpdateEmployeeRejectData(req: EmployeeDetailsDto): Promise<CommonResponseModel> {

        try {
            // Update employeeCode
            const updateResult = await this.employeeDetailRepo.update(
                { id: req.id },
                {
                    employeeCode: req.employeeCode,
                }
            );

            if (updateResult.affected > 0) {
                // Update employeeStatus to Rejected
                const statusUpdateResult = await this.employeeDetailRepo.update(
                    { id: req.id },
                    {
                        employeeStatus: EmployeeStatus.Rejected,
                    }
                );

                if (statusUpdateResult.affected > 0) {
                    return new CommonResponseModel(true, 1, 'Updated Successfully', {
                        ...updateResult,
                        statusUpdate: statusUpdateResult,
                    });
                } else {
                    return new CommonResponseModel(false, 0, 'Failed to update employee status', []);
                }
            } else {
                return new CommonResponseModel(false, 0, 'Failed to update employee code', []);
            }
        } catch (error) {
            console.error('Error updating employee data:', error);
            return new CommonResponseModel(false, 0, 'Error occurred during update', error);
        }
    }


    async getUpdateEmployeeApprovalData(req: EmployeeDetailsDto): Promise<CommonResponseModel> {

        try {
            // Update employeeCode
            const updateResult = await this.employeeDetailRepo.update(
                { id: req.id },
                {
                    employeeCode: req.employeeCode,
                }
            );

            if (updateResult.affected > 0) {
                // Update employeeStatus to WORKING
                const statusUpdateResult = await this.employeeDetailRepo.update(
                    { id: req.id },
                    {
                        employeeStatus: EmployeeStatus.OnRollEmployee,
                    }
                );

                if (statusUpdateResult.affected > 0) {
                    return new CommonResponseModel(true, 1, 'Updated Successfully', {
                        ...updateResult,
                        statusUpdate: statusUpdateResult,
                    });
                } else {
                    return new CommonResponseModel(false, 0, 'Failed to update employee status', []);
                }
            } else {
                return new CommonResponseModel(false, 0, 'Failed to update employee code', []);
            }
        } catch (error) {
            console.error('Error updating employee data:', error);
            return new CommonResponseModel(false, 0, 'Error occurred during update', error);
        }
    }



    async getAllEmpBelowAgeWorkingData(): Promise<CommonResponseModel> {

        try {
            const data = await this.employeeDetailRepo.getAllEmpBelowAgeWorkingData()
            if (data) {
                return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
            } else {
                return new CommonResponseModel(false, 1, 'Date not Found', data)
            }

        } catch (err) {
            return err
        }
    }
    async getEmpTenureByGender(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getEmpTenureByGender(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data Retrieved', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data', [])
            }
        } catch (err) {
            throw (err)
        }
    }



    // async getAllEmpBelowAgeWorkingData(): Promise<CommonResponseModel> {

    //     try {
    //         const data = await this.employeeDetailRepo.getAllEmpBelowAgeWorkingData()
    //         if (data) {
    //             return new CommonResponseModel(true, 1, 'Date Retrieved Successfully', data)
    //         } else {
    //             return new CommonResponseModel(false, 1, 'Date not Found', data)
    //         }

    //     } catch (err) {
    //         return err
    //     }
    // }
    // async getEmpTenureByGender(req: DashboardReq): Promise<CommonResponseModel> {
    //     try {
    //         const data = await this.employeeDetailRepo.getEmpTenureByGender(req)
    //         if (data.length > 0) {
    //             return new CommonResponseModel(true, 1, 'Data Retrieved', data)
    //         } else {
    //             return new CommonResponseModel(false, 0, 'No Data', [])
    //         }
    //     } catch (err) {
    //         throw (err)
    //     }
    // }

    async getEmpGenderAge(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getEmpGenderAge(req)
            if (data.length > 0) {
                return new CommonResponseModel(true, 1, 'Data Retrieved', data)
            } else {
                return new CommonResponseModel(false, 0, 'No Data', [])
            }
        } catch (err) {
            throw (err)
        }
    }


    async getEmployeeDocuments(req: EmployeeDocDto): Promise<CommonResponseModel> {
        try {
            const data: EmployeeDocModel[] = [];
            const employeesIds = await this.employeeDetailRepo.getAllDocEmployeeId(req)
            for (const empId of employeesIds) {
                const docFile = await this.empIdProofRepo.find({ where: { employeeId: empId.employeeId } })
                if (docFile) {
                    data.push(new EmployeeDocModel(empId.employeeId, empId.employeeCode, empId.fullName, docFile, empId.employeeType, empId.isActive))
                }
            }
            if (employeesIds) {
                return new CommonResponseModel(true, 1, 'Data', data)
            } else {
                return new CommonResponseModel(false, 0, 'Failed')
            }
        } catch (err) {
            console.log(err);
        }
    }


    async getAllWeekEmployees(req: EmployeeFilterReq): Promise<EmployeeViewResponseModel> {
        // Fetch paginated employee data from the repository
        const { data, count } = await this.employeeDetailRepo.getAllWeekEmployees(req);
        // Transform raw data into the desired format
        const employeeDataArr: EmployeeViewModel[] = data.map((v) => {
            const employeeDataObj = new EmployeeViewModel();
            employeeDataObj.id = v.employeeId;
            employeeDataObj.fullName = v.fullName;
            employeeDataObj.employeeCode = v.employeeCode;
            employeeDataObj.employeeId = v.employeeId;
            employeeDataObj.salutation = v.salutation;
            employeeDataObj.empImage = v.empImage;
            employeeDataObj.aadhaarNo = v.aadhaarNo;
            employeeDataObj.firstName = v.firstName;
            employeeDataObj.lastName = v.lastName;
            employeeDataObj.dateOfBirth = v.dateOfBirth;
            employeeDataObj.gender = v.gender;
            employeeDataObj.departmentId = v.departmentId;
            employeeDataObj.designationId = v.designationId;
            employeeDataObj.branchId = v.branchId;
            employeeDataObj.division = v.division;
            employeeDataObj.dateOfJoining = v.dateOfJoining;
            employeeDataObj.mobileNo = v.mobileNo;
            employeeDataObj.emailId = v.emailId;
            employeeDataObj.currentAddress = v.currentAddress;
            employeeDataObj.currentState = v.currentState;
            employeeDataObj.currentPincode = v.currentPincode;
            employeeDataObj.permanentAddress = v.permanentAddress;
            employeeDataObj.permanentState = v.permanentState;
            employeeDataObj.permanentPincode = v.permanentPincode;
            employeeDataObj.salary = v.salary;
            employeeDataObj.pfNo = v.pfNo;
            employeeDataObj.esicNo = v.esicNo;
            employeeDataObj.bankName = v.bankName;
            employeeDataObj.bankAcNo = v.bankAcNo;
            employeeDataObj.bankIfscCode = v.bankIfscCode;
            employeeDataObj.nominee = v.nominee;
            employeeDataObj.reportingManagerName = v.reportingManagerName;
            employeeDataObj.reportingManager = v.reportingManager;
            employeeDataObj.dateOfReliving = v.dateOfReliving;
            employeeDataObj.reasonOfReliving = v.reasonOfReliving;
            employeeDataObj.filePath = v.filePath;
            employeeDataObj.fileName = v.fileName;
            employeeDataObj.originalName = v.originalname;
            employeeDataObj.branchName = v.branchName;
            employeeDataObj.departmentName = v.departmentName;
            employeeDataObj.designationName = v.designationName;
            employeeDataObj.divisionName = v.divisionName;
            employeeDataObj.isActive = v.isActive;

            return employeeDataObj;
        });

        // Get total count for pagination
        // Return response
        if (employeeDataArr.length > 0) {
            return new EmployeeViewResponseModel(true, 1, 'Data Retrieved Successfully', employeeDataArr, count);
        }

        return new EmployeeViewResponseModel(false, 0, 'No data found', [], 0);
    }

    async getDOBofEmp(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getDOBofEmp(req);
            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved', data)
                : new CommonResponseModel(false, 0, 'No data', []);
        } catch (err) {
            throw err;
        }
    }

    async sendBirthdayMessages(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.sendBirthdayMessages(req);
            for (const empData of data) {
                const textMessage = `${empData.name}🎉🎂  from all of us at Organization Sakku! 🎂 Wishing you success, joy, and new opportunities as you celebrate ${empData.age} years today. Have a fantastic day! 🎈`
                await this.whatsService.aabsentLeaveStatusWhatsappApi(empData.mobileNo, textMessage, 'birthday_template')
            }
            return data.length > 0
                ? new CommonResponseModel(true, 1, '🎂Birthday Wishes sent', data)
                : new CommonResponseModel(false, 0, 'No data', []);
        } catch (err) {
            throw err;
        }
    }



    async getAllEmployeesTableFroms(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getAllEmployeesTableFormsRepo(req);
            if (data) {
                return new CommonResponseModel(true, 1, 'Data Retrived', data)
            } else {
                return new CommonResponseModel(false, 0, 'Failed')
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllEmployeesPersonalImformationManagement(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getAllEmployeesPersonalImformationManagementRepo(req);
            const rmData = await this.employeeDetailRepo.getReportingManagerName(req)

            if (data) {
                return new CommonResponseModel(true, 1, 'Data Retrived', data, rmData)
            } else {
                return new CommonResponseModel(false, 0, 'Failed')
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getAllEmpForRec(req: any): Promise<CommonResponseModel> {
        try {
            const result = await this.employeeDetailRepo.getAllEmpForRec(req);
            if (result) {
                return new CommonResponseModel(true, 6281481725, 'Data Retrieved', result);
            } else {
                return new CommonResponseModel(false, 8309649082, 'No Data Found');
            }
        } catch (err) {
            console.error('Error in getEmpRecComponent:', err.message);
        }
    }

    async getAllEmpData(req: any): Promise<CommonResponseModel> {
        const rawData = await this.employeeDetailRepo.getAllEmpData(req);

        if (rawData.length > 0) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', rawData);
        }
        return new CommonResponseModel(false, 0, 'No data found', []);
    }

    async getDivisionByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const getData = await this.employeeDetailRepo.getDivisionByBranchId(req.branchId)

            return getData.length > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved', getData)
                : new CommonResponseModel(false, 0, 'No Data Found')
        } catch (err) {
            throw (err)
        }
    }

    async getDepartmentByBranchId(req: DashboardReq): Promise<CommonResponseModel> {
        try {
            const getData = await this.employeeDetailRepo.getDepartmentByBranchId(req.branchId)

            return getData.length > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved', getData)
                : new CommonResponseModel(false, 0, 'No Data Found')
        } catch (err) {
            throw (err)
        }
    }


    async referenceBasedEmployeeData(req: EmpDataReq): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.referenceBasedEmployeeData(req)

        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }



    async updateDeactiveEmployee(employeeData: EmployeeDetailsDto): Promise<CommonResponseModel> {
        try {

            const formattedDateOfReliving = employeeData.dateOfReliving
                ? employeeData.dateOfReliving instanceof Date
                    ? employeeData.dateOfReliving.toISOString()
                    : employeeData.dateOfReliving
                : null;

            const result = await this.employeeDetailRepo.update(
                { id: employeeData.id },
                {
                    employeeRemarks: employeeData.employeeRemarks,
                    dateOfReliving: formattedDateOfReliving,
                }
            );


            if (result.affected > 0) {
                return new CommonResponseModel(true, 1, 'Updated Successfully', result);
            } else {
                return new CommonResponseModel(false, 0, 'Update failed', []);
            }
        } catch (error) {
            console.error(error);
            return new CommonResponseModel(false, 0, 'An error occurred', []);
        }
    }


    async checkAadharPanDuplicates(req: any): Promise<CommonResponseModel> {
        const data = await this.empIdProofRepo.find({ where: { idNumber: req.idNumber } })
        if (data) {
            const response = await this.getEmpById({ employeeId: data[0].employeeId });
            return new CommonResponseModel(true, 1, 'Id Number already exist', response.data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }


    async getEmpDataForLeaves(req?: EmpDataReq): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getEmpDataForLeaves(req)
            console.log(data, '-=----------')

            return data.length > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved', data)
                : new CommonResponseModel(false, 0, 'No data', [])
        } catch (err) {
            throw (err)
        }
    }

    async bulkEmpActiveInactive(req: EmployeeBulkRequest): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.bulkEmpActiveInactive(req)
            if (data) {
                return new CommonResponseModel(true, 1, `Selected ${req.isActive === true ? 'Activated' : 'Deactivated'} Successfully`, data);
            } else {
                return new CommonResponseModel(false, 0, `Selected ${req.isActive === true ? 'Activated' : 'Deactivated'} failed`);
            }
        } catch (err) {
            throw (err)
        }
    }

    async checkPfEsiDuplicates(req: any): Promise<CommonResponseModel> {
        let data
        if (req.pfNo) {
            data = await this.employeeDetailRepo.find({ where: { pfNo: req.pfNo } })
        } else if (req.esicNo) {
            data = await this.employeeDetailRepo.find({ where: { esicNo: req.esicNo } })
        }
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, `${req.pfNo ? 'PF ' : 'ESIC '}number already exist`, data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }

    async updateLeaveAllotted(req: any): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.update({ id: req.id }, { leavesAllocated: true })
            return data.affected > 0
                ? new CommonResponseModel(true, 1, 'Data Retrieved', data)
                : new CommonResponseModel(false, 0, 'No data', [])
        } catch (error) {

        }
    }

    async getRequestedEmpData(req?: any): Promise<CommonResponseModel> {
        try {
            const x = await this.employeeDetailRepo.getOnlyRequestEmployeeId(req)
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', x)
        } catch (err) {
            console.error('Error saving payroll attendance data:', err);
            throw err;
        }
    }

    async handleEmpCodeDuplicate(req: any): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.find({ where: { employeeCode: req.employeeCode } })
        if (data.length > 0) {
            return new CommonResponseModel(true, 1, 'Employee Code already exist', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }


    async getEmpByCode(req: EmployeeCodeReq): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getEmpByCode(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }

    async getEmpByContact(req: EmployeeMobileReq): Promise<CommonResponseModel> {
        console.log(req, 'req')
        const data = await this.employeeDetailRepo.getEmpByContact(req)
        console.log(data, 'data')
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }

    async getEmpDataForLateMinCal(req?: lateMinReq): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.getEmpDataForLateMinCal(req)
        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }



    async empResignationProofs(req: EmpResignationDto): Promise<CommonResponseModel> {
        try {
            const oldData = await this.empResignRepo.findOne({ where: { employeeId: req.employeeId } });
            let descriptionChanges: string[] = [];
            if (!oldData) {
                descriptionChanges.push(`Employee Relieved on ${dayjs(req.dateOfReliving).format('YYYY-MM-DD')}`)
            }
            else {
                if (oldData.dateOfReliving !== dayjs(req.dateOfReliving).format('YYYY-MM-DD')) {
                    descriptionChanges.push(`Date of Relieving changed from ${oldData.dateOfReliving} to ${dayjs(req.dateOfReliving).format('YYYY-MM-DD')}`);
                }
            }
            const entity = new EmployeeResignationProofs();
            entity.employeeId = req.employeeId;
            entity.employeeCode = req.employeeCode;
            entity.firstName = req.firstName;
            entity.dateOfReliving = dayjs(req.dateOfReliving).format('YYYY-MM-DD');
            entity.employeeRemarks = req.employeeRemarks;
            entity.fileName = req.fileName || "";
            entity.filePath = req.filePath || "";
            entity.originalFileName = req.originalFileName || "";
            /* Memo Saving */
            const memoEntities = new MemoEntity();
            memoEntities.date = new Date().toISOString().split('T')[0];
            memoEntities.type = "Exit";
            memoEntities.feedBackOn = req.firstName;
            memoEntities.description = descriptionChanges.length > 0 ? descriptionChanges.join('\n') : "-";
            memoEntities.impactOnBussiness = "Turn Over";
            memoEntities.employeeId = req.employeeId;
            memoEntities.isActive = req.isActive;
            memoEntities.createdUser = req.createdUser;
            memoEntities.updatedUser = req.updatedUser;
            memoEntities.versionFlag = req.versionFlag;

            await this.memoRepo.save(memoEntities);
            const savedResignation = await this.empResignRepo.save(entity);
            await this.employeeDetailRepo.update({ id: req.employeeId }, { dateOfReliving: dayjs(req.dateOfReliving).format('YYYY-MM-DD'), reasonOfReliving: req.employeeRemarks, isActive: false });
            if (savedResignation) {
                return new CommonResponseModel(true, 1, "Resignation record created successfully", savedResignation);
            } else {
                return new CommonResponseModel(false, 0, "Failed to create resignation record", []);
            }
        } catch (error) {
            console.error("Error in empResignationProofs:", error);
            throw new Error("An unexpected error occurred while processing the resignation proof.");
        }
    }


    async updatePath(fileData: any, resignationId: number): Promise<CommonResponseModel> {
        try {
            let flag = true;
            const data = []

            for (const file of fileData) {
                const update = await this.empResignRepo.update({ id: resignationId }, { fileName: file.filename, filePath: file.path })
                data.push(update)
            }
            if (!data) {
                flag = false;
            }
            if (flag) {
                return new CommonResponseModel(true, 11, 'uploaded Successfully', fileData);
            }
            else {
                return new CommonResponseModel(false, 11, 'uploaded failed', fileData);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    async getEmpResignationProofs(): Promise<CommonResponseModel> {
        try {
            const result = await this.empResignRepo.getEmpResignationProofs()
            if (result) {
                return new CommonResponseModel(true, 6281481725, "Data Retrieved", result)
            }
            else {
                return new CommonResponseModel(false, 8309649082, "No Data Found")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async employeeExperienceDocumentUpload(files: Express.Multer.File[], expProofs: any[], data: any): Promise<CommonResponseModel> {
        try {
            const empId = Number(data.empId);
            if (!empId) {
                throw new Error("Employee ID is missing or invalid.");
            }

            const fileRecords = files.map(file => ({
                employee: { id: empId },
                filePath: file.path,
                fileName: file.filename,
                originalFileName: file.originalname,
                fileType: file.mimetype,
            }));

            for (let i = 0; i < expProofs.length; i++) {
                const expId = expProofs[i].id ? Number(expProofs[i].id) : null;

                const existingRecord = await this.empExperienceRepo.findOne({ where: { id: expId, employee: { id: empId } }, });

                if (existingRecord) {
                    await this.empExperienceRepo.update({ id: expId, employee: { id: empId } }, fileRecords[i]);
                } else {
                    await this.empExperienceRepo.save({ ...fileRecords[i] });
                }
            }

            return new CommonResponseModel(true, 12, 'Uploaded and saved Successfully', fileRecords);
        } catch (error) {
            console.error("Error handling employee document upload:", error);
            return new CommonResponseModel(false, 500, 'Internal Server Error', null);
        }
    }

    async getEmpDataForPfAndEsi(req?: AttendanceDto): Promise<CommonResponseModel> {
        const data = await this.pfEsiEffDatesRepo.getEmpDataForPfAndEsi(req)

        if (data) {
            return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }

    async getEmployyeDetailsForPhoneNumber(req: { phoneNumber: string }) {
        console.log(req)
        const query = `
        SELECT e.id AS id, e.first_name AS firstName, e.last_name AS lastName, 
        e.reporting_manager AS reportingManager, e.employee_code AS employeeCode, e.branch_id AS branchId,  rm.mobile_no AS rmPhoneNumber
        FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.employee rm ON rm.id = e.reporting_manager
        WHERE e.mobile_no = ${req.phoneNumber}`
        const res = await this.employeeDetailRepo.query(query)
        //const res = await this.employeeDetailRepo.findOne({ where: { mobileNo: req.phoneNumber }, select: ['id', 'firstName', 'lastName', 'reportingManager', 'employeeCode', 'branchId'] })
        if (!res) {
            return new CommonResponseModel(false, 1111, "Employee not found with this phone number")
        }
        return new CommonResponseModel(true, 1111, "Employee found", res)
    }


    async getEmpHistoryDetials(req: EmpDataReq): Promise<CommonResponseModel> {
        try {
            const employeeData = await this.employeeDetailRepo.getEmpHistoryRepo(req);
            if (employeeData) {
                return new CommonResponseModel(true, 1, 'Data Retrieved Successfully', employeeData);
            } else {
                return new CommonResponseModel(false, 0, 'No Employee Data Found', null);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return new CommonResponseModel(false, -1, 'An error occurred while fetching employee data', null);
        }
    }

    async getBranchWiseEmpStatusReport(req: any): Promise<CommonResponseModel> {
        let query = `SELECT b.branch_name AS branchName,e.branch_id,
                    COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS employeeActive,
                    COUNT(CASE WHEN e.is_active = 0 AND e.employee_type_id = 1 
               AND YEAR(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.year} 
               AND MONTH(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.month} THEN 1 END) AS employeeInactive,

                    COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerActive,
                   
                    COUNT(CASE WHEN e.is_active = 0 AND e.employee_type_id = 2 
               AND YEAR(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.year} 
               AND MONTH(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.month} THEN 1 END) AS workerInactive,

                    COUNT(CASE WHEN e.pay_mode != 'Bank' AND e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS empCashPayment,
                    COUNT(CASE WHEN e.pay_mode = 'Bank' AND e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS empBankPayment,
                    COUNT(CASE WHEN e.pay_mode != 'Bank' AND e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerCashPayment,
                    COUNT(CASE WHEN e.pay_mode = 'Bank' AND e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerBankPayment
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                WHERE e.id > 0 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`

        let attQuery = `SELECT b.branch_name AS branchName,e.branch_id,
                    COUNT(CASE WHEN a.attn_status NOT IN ('A', 'W', 'H') AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeePresentMTD,
                    COUNT(CASE WHEN a.attn_status = 'A' AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeeAbsentMTD,
                    COUNT(CASE WHEN a.leave_status != 'A' AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeeLeaveMTD,
                    COUNT(CASE WHEN a.attn_status NOT IN ('A', 'W', 'H') AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerPresentMTD,
                    COUNT(CASE WHEN a.attn_status = 'A' AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerAbsentMTD,
                    COUNT(CASE WHEN a.leave_status != 'A' AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerLeaveMTD
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                LEFT JOIN ${this.dbNames.lms}.attendance a 
                    ON e.id = a.emp_id 
                WHERE e.id > 0 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`
        if (req.year && req.month) {
            // query += ` AND YEAR(e.created_at) = ${req.year} AND MONTH(e.created_at) = ${req.month}`;
            attQuery += ` AND YEAR(a.created_at) = ${req.year} AND MONTH(a.created_at) = ${req.month}`;
        } else {
            // query += ` AND DATE(e.created_at) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()`;
            attQuery += ` AND DATE(a.created_at) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()`;
        }
        let leaveCodeQuery = `SELECT lg.branch_id,lgc.generated_code as leavePolicyCode FROM ${this.dbNames.lms}.leave_group_code_mapping lg
        LEFT JOIN ${this.dbNames.lms}.leave_generated_code lgc ON lg.generated_code_id = lgc.id
        WHERE lg.id > 0 AND lg.employee_type_id = 1 ${req.branchId ? `AND lg.branch_id = ${req.branchId}` : ''}`

        let payrollCodeQuery = `SELECT pc.branch_id,pc.payroll_code as salaryPolicyCode FROM ${this.dbNames.pms}.payroll_code_branch_mapping pc
        WHERE pc.id > 0 AND pc.employee_type_id = 1 ${req.branchId ? `AND pc.branch_id = ${req.branchId}` : ''}`

        query += ` GROUP BY e.branch_id`
        attQuery += ` GROUP BY e.branch_id`
        leaveCodeQuery += ` GROUP BY lg.branch_id`
        payrollCodeQuery += ` GROUP BY pc.branch_id`

        const data = await this.employeeDetailRepo.query(query)
        const attData = await this.employeeDetailRepo.query(attQuery)
        const leaveCodeData = await this.employeeDetailRepo.query(leaveCodeQuery)
        const payrollCodeData = await this.employeeDetailRepo.query(payrollCodeQuery)

        const attDataMap = new Map<number, AttendanceData>(
            attData.map(att => [att.branch_id, att as AttendanceData])
        );
        type AttendanceData = {
            employeePresentMTD: number;
            employeeAbsentMTD: number;
            employeeLeaveMTD: number;
            workerPresentMTD: number;
            workerAbsentMTD: number;
            workerLeaveMTD: number;
        };

        const leaveCodeDataMap = new Map<number, string>(
            leaveCodeData.map(leave => [leave.branch_id, leave.leavePolicyCode])
        );

        const payrollCodeDataMap = new Map<number, string>(
            payrollCodeData.map(pay => [pay.branch_id, pay.salaryPolicyCode])
        );

        const mergedData = data.map(item => {
            const attendance: AttendanceData = attDataMap.get(item.branch_id) ?? {
                employeePresentMTD: 0,
                employeeAbsentMTD: 0,
                employeeLeaveMTD: 0,
                workerPresentMTD: 0,
                workerAbsentMTD: 0,
                workerLeaveMTD: 0
            };

            return {
                ...item,
                ...attendance,
                leavePolicyCode: leaveCodeDataMap.get(item.branch_id) ?? null, // Map leavePolicyCode
                salaryPolicyCode: payrollCodeDataMap.get(item.branch_id) ?? null // Map leavePolicyCode
            };
        });
        if (mergedData.length) return new CommonResponseModel(true, 1, 'Data retrived Successfully', mergedData)
        return new CommonResponseModel(false, 0, 'No data found')
    }

    async saveSwipeProcessLogs(req: any): Promise<CommonResponseModel> {
        const entity = new SwipeProcessLogEntity();
        entity.swipeDate = req.swipeDate;
        entity.time = req.time
        entity.readerDownloadTime = req.readerDownloadTime;
        entity.passRecords = req.passRecords;
        entity.failRecords = req.failRecords;
        entity.pendingRecords = req.pendingRecords;
        const save = await this.swipeProcessLogRepo.save(entity);
        if (save) {
            return new CommonResponseModel(true, 1, 'Data saved Successfully', save);
        } else {
            return new CommonResponseModel(false, 0, 'Data save failed', []);
        }
    }

    async updateReportingManager(req: any): Promise<CommonResponseModel> {
        const update = await this.employeeDetailRepo.update({ employeeCode: req.employeeCode }, { reportingManager: req.req })
        if (update.affected > 0) {
            return new CommonResponseModel(true, 1, 'updated Successfully');
        } else {
            return new CommonResponseModel(false, 0, 'updateve failed', []);
        }
    }

    async getBranchWiseWorkerStatusReport(req: any): Promise<CommonResponseModel> {
        let query = `SELECT b.branch_name AS branchName,e.branch_id,
                    COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS employeeActive,
                    COUNT(CASE WHEN e.is_active = 0 AND e.employee_type_id = 1 
               AND YEAR(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.year} 
               AND MONTH(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.month} THEN 1 END) AS employeeInactive,

                    COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerActive,
                   
                    COUNT(CASE WHEN e.is_active = 0 AND e.employee_type_id = 2 
               AND YEAR(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.year} 
               AND MONTH(STR_TO_DATE(e.date_of_reliving, '%Y-%m-%d')) = ${req.month} THEN 1 END) AS workerInactive,

                    COUNT(CASE WHEN e.pay_mode != 'Bank' AND e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS empCashPayment,
                    COUNT(CASE WHEN e.pay_mode = 'Bank' AND e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS empBankPayment,
                    COUNT(CASE WHEN e.pay_mode != 'Bank' AND e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerCashPayment,
                    COUNT(CASE WHEN e.pay_mode = 'Bank' AND e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerBankPayment
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                WHERE e.id > 0 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`

        let attQuery = `SELECT b.branch_name AS branchName,e.branch_id,
                    COUNT(CASE WHEN a.attn_status NOT IN ('A', 'W', 'H') AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeePresentMTD,
                    COUNT(CASE WHEN a.attn_status = 'A' AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeeAbsentMTD,
                    COUNT(CASE WHEN a.leave_status != 'A' AND e.employee_type_id = 1 AND e.is_active = 1 THEN 1 END) AS employeeLeaveMTD,
                    COUNT(CASE WHEN a.attn_status NOT IN ('A', 'W', 'H') AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerPresentMTD,
                    COUNT(CASE WHEN a.attn_status = 'A' AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerAbsentMTD,
                    COUNT(CASE WHEN a.leave_status != 'A' AND e.employee_type_id = 2 AND e.is_active = 1 THEN 1 END) AS workerLeaveMTD
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                LEFT JOIN ${this.dbNames.lms}.attendance a 
                    ON e.id = a.emp_id 
                WHERE e.id > 0 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`
        if (req.year && req.month) {
            // query += ` AND YEAR(e.created_at) = ${req.year} AND MONTH(e.created_at) = ${req.month}`;
            attQuery += ` AND YEAR(a.created_at) = ${req.year} AND MONTH(a.created_at) = ${req.month}`;
        } else {
            // query += ` AND DATE(e.created_at) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()`;
            attQuery += ` AND DATE(a.created_at) BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND CURDATE()`;
        }
        let leaveCodeQuery = `SELECT lg.branch_id,lgc.generated_code as leavePolicyCode FROM ${this.dbNames.lms}.leave_group_code_mapping lg
        LEFT JOIN ${this.dbNames.lms}.leave_generated_code lgc ON lg.generated_code_id = lgc.id
        WHERE lg.id > 0 AND lg.employee_type_id = 2 ${req.branchId ? `AND lg.branch_id = ${req.branchId}` : ''}`

        let payrollCodeQuery = `SELECT pc.branch_id,pc.payroll_code as salaryPolicyCode FROM ${this.dbNames.pms}.payroll_code_branch_mapping pc
        WHERE pc.id > 0 AND pc.employee_type_id = 2 ${req.branchId ? `AND pc.branch_id = ${req.branchId}` : ''}`

        query += ` GROUP BY e.branch_id`
        attQuery += ` GROUP BY e.branch_id`
        leaveCodeQuery += ` GROUP BY lg.branch_id`
        payrollCodeQuery += ` GROUP BY pc.branch_id`

        const data = await this.employeeDetailRepo.query(query)
        const attData = await this.employeeDetailRepo.query(attQuery)
        const leaveCodeData = await this.employeeDetailRepo.query(leaveCodeQuery)
        const payrollCodeData = await this.employeeDetailRepo.query(payrollCodeQuery)

        const attDataMap = new Map<number, AttendanceData>(
            attData.map(att => [att.branch_id, att as AttendanceData])
        );
        type AttendanceData = {
            employeePresentMTD: number;
            employeeAbsentMTD: number;
            employeeLeaveMTD: number;
            workerPresentMTD: number;
            workerAbsentMTD: number;
            workerLeaveMTD: number;
        };

        const leaveCodeDataMap = new Map<number, string>(
            leaveCodeData.map(leave => [leave.branch_id, leave.leavePolicyCode])
        );

        const payrollCodeDataMap = new Map<number, string>(
            payrollCodeData.map(pay => [pay.branch_id, pay.salaryPolicyCode])
        );

        const mergedData = data.map(item => {
            const attendance: AttendanceData = attDataMap.get(item.branch_id) ?? {
                employeePresentMTD: 0,
                employeeAbsentMTD: 0,
                employeeLeaveMTD: 0,
                workerPresentMTD: 0,
                workerAbsentMTD: 0,
                workerLeaveMTD: 0
            };

            return {
                ...item,
                ...attendance,
                leavePolicyCode: leaveCodeDataMap.get(item.branch_id) ?? null, // Map leavePolicyCode
                salaryPolicyCode: payrollCodeDataMap.get(item.branch_id) ?? null // Map leavePolicyCode
            };
        });
        if (mergedData.length) return new CommonResponseModel(true, 1, 'Data retrived Successfully', mergedData)
        return new CommonResponseModel(false, 0, 'No data found')
    }

    async getBranchEmployeeWiseMisReport(req: any): Promise<CommonResponseModel> {
        let query = `SELECT b.branch_name AS branchName,e.branch_id,b.state,
                 COUNT(CASE WHEN e.is_active = 1 THEN 1 END) AS employeeActive,
                 COUNT(CASE WHEN e.is_active = 1 AND e.gender = 'M' THEN 1 END) AS maleEmpCount,
                 COUNT(CASE WHEN e.is_active = 1 AND e.gender = 'F' THEN 1 END) AS femaleEmpCount,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) < 18 THEN 1 END) AS age_below_18,
                 COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 18 AND 24 THEN 1 END) AS age_18_24,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 25 AND 34 THEN 1 END) AS age_25_34,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 35 AND 44 THEN 1 END) AS age_35_44,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) >= 45 THEN 1 END) AS age_45_above,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 1 THEN 1 END) AS tenure_0_1,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 3 THEN 1 END) AS tenure_1_3,
                COUNT(CASE WHEN e.is_active = 1  AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 3 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 5 THEN 1  END) AS tenure_3_5,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 5 THEN 1 END) AS tenure_above_5
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                WHERE e.id > 0 AND e.employee_type_id = 1 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`

        let leaveCodeQuery = `SELECT lg.branch_id,lgc.generated_code as leavePolicyCode FROM ${this.dbNames.lms}.leave_group_code_mapping lg
        LEFT JOIN ${this.dbNames.lms}.leave_generated_code lgc ON lg.generated_code_id = lgc.id
        WHERE lg.id > 0 AND lg.employee_type_id = 1 ${req.branchId ? `AND lg.branch_id = ${req.branchId}` : ''}`

        let payrollCodeQuery = `SELECT pc.branch_id,pc.payroll_code as salaryPolicyCode FROM ${this.dbNames.pms}.payroll_code_branch_mapping pc
        WHERE pc.id > 0 AND pc.employee_type_id = 1 ${req.branchId ? `AND pc.branch_id = ${req.branchId}` : ''}`

        query += ` GROUP BY e.branch_id HAVING employeeActive > 0`
        leaveCodeQuery += ` GROUP BY lg.branch_id`
        payrollCodeQuery += ` GROUP BY pc.branch_id`

        const data = await this.employeeDetailRepo.query(query)
        const leaveCodeData = await this.employeeDetailRepo.query(leaveCodeQuery)
        const payrollCodeData = await this.employeeDetailRepo.query(payrollCodeQuery)

        type AttendanceData = {
            employeePresentMTD: number;
            employeeAbsentMTD: number;
            employeeLeaveMTD: number;
            workerPresentMTD: number;
            workerAbsentMTD: number;
            workerLeaveMTD: number;
        };

        const leaveCodeDataMap = new Map<number, string>(
            leaveCodeData.map(leave => [leave.branch_id, leave.leavePolicyCode])
        );

        const payrollCodeDataMap = new Map<number, string>(
            payrollCodeData.map(pay => [pay.branch_id, pay.salaryPolicyCode])
        );

        const mergedData = data.map(item => {
            return {
                ...item,
                leavePolicyCode: leaveCodeDataMap.get(item.branch_id) ?? null, // Map leavePolicyCode
                salaryPolicyCode: payrollCodeDataMap.get(item.branch_id) ?? null // Map leavePolicyCode
            };
        });
        console.log(mergedData, ';----------merged data')
        if (mergedData.length) return new CommonResponseModel(true, 1, 'Data retrived Successfully', mergedData)
        return new CommonResponseModel(false, 0, 'No data found')
    }

    async getBranchWorkerWiseMisReport(req: any): Promise<CommonResponseModel> {
        let query = `SELECT b.branch_name AS branchName,e.branch_id,b.state,
                 COUNT(CASE WHEN e.is_active = 1 THEN 1 END) AS employeeActive,
                 COUNT(CASE WHEN e.is_active = 1 AND e.gender = 'M' THEN 1 END) AS maleEmpCount,
                 COUNT(CASE WHEN e.is_active = 1 AND e.gender = 'F' THEN 1 END) AS femaleEmpCount,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) < 18 THEN 1 END) AS age_below_18,
                 COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 18 AND 24 THEN 1 END) AS age_18_24,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 25 AND 34 THEN 1 END) AS age_25_34,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) BETWEEN 35 AND 44 THEN 1 END) AS age_35_44,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_birth, CURDATE()) >= 45 THEN 1 END) AS age_45_above,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 1 THEN 1 END) AS tenure_0_1,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 3 THEN 1 END) AS tenure_1_3,
                COUNT(CASE WHEN e.is_active = 1  AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 3 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) < 5 THEN 1  END) AS tenure_3_5,
                COUNT(CASE WHEN e.is_active = 1 AND TIMESTAMPDIFF(YEAR, e.date_of_joining, CURDATE()) >= 5 THEN 1 END) AS tenure_above_5
                FROM ${this.dbNames.ems}.employee e
                LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
                WHERE e.id > 0 AND e.employee_type_id = 2 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}`


        let leaveCodeQuery = `SELECT lg.branch_id,lgc.generated_code as leavePolicyCode FROM ${this.dbNames.lms}.leave_group_code_mapping lg
        LEFT JOIN ${this.dbNames.lms}.leave_generated_code lgc ON lg.generated_code_id = lgc.id
        WHERE lg.id > 0 AND lg.employee_type_id = 2 ${req.branchId ? `AND lg.branch_id = ${req.branchId}` : ''}`

        let payrollCodeQuery = `SELECT pc.branch_id,pc.payroll_code as salaryPolicyCode FROM ${this.dbNames.pms}.payroll_code_branch_mapping pc
        WHERE pc.id > 0 AND pc.employee_type_id = 2 ${req.branchId ? `AND pc.branch_id = ${req.branchId}` : ''}`

        query += ` GROUP BY e.branch_id HAVING employeeActive > 0`
        leaveCodeQuery += ` GROUP BY lg.branch_id`
        payrollCodeQuery += ` GROUP BY pc.branch_id`

        const data = await this.employeeDetailRepo.query(query)
        const leaveCodeData = await this.employeeDetailRepo.query(leaveCodeQuery)
        const payrollCodeData = await this.employeeDetailRepo.query(payrollCodeQuery)

        const leaveCodeDataMap = new Map<number, string>(
            leaveCodeData.map(leave => [leave.branch_id, leave.leavePolicyCode])
        );

        const payrollCodeDataMap = new Map<number, string>(
            payrollCodeData.map(pay => [pay.branch_id, pay.salaryPolicyCode])
        );

        const mergedData = data.map(item => {
            return {
                ...item,
                leavePolicyCode: leaveCodeDataMap.get(item.branch_id) ?? null, // Map leavePolicyCode
                salaryPolicyCode: payrollCodeDataMap.get(item.branch_id) ?? null // Map leavePolicyCode
            };
        });
        console.log(mergedData, ';----------merged data')
        if (mergedData.length) return new CommonResponseModel(true, 1, 'Data retrived Successfully', mergedData)
        return new CommonResponseModel(false, 0, 'No data found')
    }

    async getBranchWisePayrollCount(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        // Generate month-wise conditions based on available data
        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');
            let endOfMonth = new Date(selectedYear, month, 0).toISOString().slice(0, 10);

            monthConditions.push(`
                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND e.employee_type_id = 1
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS emp${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND e.employee_type_id = 2
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS worker${monthStr}${selectedYear}

            `);
        }

        let monthQueryPart = monthConditions.length > 0 ? monthConditions.join(",\n") : '';

        // Employee Query
        let query = `
            SELECT 
                b.branch_name AS branchName,
                e.branch_id,
                b.state,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS employeeActive,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerActive,
                ${monthQueryPart}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            WHERE e.id > 0 
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
            AND YEAR(e.date_of_joining) <= ${selectedYear}
            GROUP BY e.branch_id HAVING employeeActive > 0 OR workerActive > 0
        `;

        // Payroll Query
        let payrollMonthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');

            payrollMonthConditions.push(`
                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr} 
                        AND e.employee_type_id = 1 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_employee_${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr}
                        AND e.employee_type_id = 2 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_worker_${monthStr}${selectedYear}
            `);
        }

        let payrollQuery = `
            SELECT 
                p.branch_id,
                ${payrollMonthConditions.join(",\n")}
            FROM ${this.dbNames.pms}.payroll_processed_logs p
            LEFT JOIN ${this.dbNames.ems}.employee e 
                ON p.branch_id = e.branch_id 
            WHERE LEFT(p.payroll_month, 4) = ${selectedYear}
            ${req.branchId ? `AND p.branch_id = ${req.branchId}` : ''}
            GROUP BY p.branch_id
        `;
        console.log(payrollQuery, '------pay roll query')
        try {
            const employeeData = await this.employeeDetailRepo.query(query);
            const payrollData = await this.employeeDetailRepo.query(payrollQuery);

            // Extract existing months dynamically
            let availableMonths = new Set();
            employeeData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(emp|worker)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]); // Add MMYYYY to Set
                    }
                });
            });

            payrollData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(payroll_employee|payroll_worker)_(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]); // Add MMYYYY to Set
                    }
                });
            });

            console.log("Available Months:", availableMonths);

            // Transform payroll data into a structured format
            const payrollMap = payrollData.reduce((acc, row) => {
                let branchId = row.branch_id;
                availableMonths.forEach((month) => {
                    acc[`${branchId}_${month}`] = {
                        employee: row[`payroll_employee_${month}`] || 0,
                        worker: row[`payroll_worker_${month}`] || 0
                    };
                });
                return acc;
            }, {});

            console.log("Payroll Map:", payrollMap);

            const result = employeeData.map((row) => {
                let formattedRow = { ...row };

                availableMonths.forEach((month) => {
                    let payrollKey = `${row.branch_id}_${month}`;

                    formattedRow[`emp${month}`] = row[`emp${month}`] || 0;
                    formattedRow[`worker${month}`] = row[`worker${month}`] || 0;

                    formattedRow[`payroll_employee_${month}`] = payrollMap[payrollKey]?.employee || 0;
                    formattedRow[`payroll_worker_${month}`] = payrollMap[payrollKey]?.worker || 0;
                });

                return formattedRow;
            });
            console.log(result, '-----------------------------')
            if (result.length) {
                return new CommonResponseModel(true, 1, "Data Retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 0, "No data found");
        } catch (error) {
            console.error("Error fetching branch-wise payroll count:", error);
            return new CommonResponseModel(false, 0, "Error while fetching data");
        }
    }

    async getBranchWiseAttritionCount(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');

            monthConditions.push(`
                COUNT(
                    CASE 
                        WHEN YEAR(e.date_of_reliving) = ${selectedYear} AND MONTH(e.date_of_reliving) = ${month} 
                        AND e.employee_type_id = 1 
                        THEN 1 
                    END
                ) AS resign_emp${monthStr}${selectedYear},
    
                COUNT(
                    CASE 
                        WHEN YEAR(e.date_of_reliving) = ${selectedYear} AND MONTH(e.date_of_reliving) = ${month} 
                        AND e.employee_type_id = 2 
                        THEN 1 
                    END
                ) AS resign_worker${monthStr}${selectedYear}
            `);
        }

        let monthQueryPart = monthConditions.length > 0 ? monthConditions.join(",\n") : '';

        // **Main Query: Fetch attrition data**
        let query = `
            SELECT 
                b.branch_name AS branchName,
                e.branch_id,
                b.state,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS employeeActive,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerActive,
                ${monthQueryPart}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            WHERE e.id > 0 
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
            GROUP BY e.branch_id HAVING employeeActive > 0 OR workerActive > 0`;
        try {
            const attritionData = await this.employeeDetailRepo.query(query);

            console.log("Attrition Data:", attritionData);

            // Extract available months dynamically
            let availableMonths = new Set();
            attritionData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(resign_emp|resign_worker)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]); // Extract MMYYYY
                    }
                });
            });

            console.log("Available Months:", availableMonths);

            const result = attritionData.map((row) => {
                let formattedRow = { ...row };

                availableMonths.forEach((month) => {
                    formattedRow[`resign_emp${month}`] = row[`resign_emp${month}`] || 0;
                    formattedRow[`resign_worker${month}`] = row[`resign_worker${month}`] || 0;
                });

                return formattedRow;
            });

            console.log(result, '------resulttt')
            if (result.length) {
                return new CommonResponseModel(true, 1, "Attrition data retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 0, "No attrition data found");
        } catch (error) {
            console.error("Error fetching branch-wise attrition count:", error);
            return new CommonResponseModel(false, 0, "Error while fetching data");
        }
    }

    async getMonthlyAttendanceMisReport(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');

            monthConditions.push(`
                COUNT(
                    CASE 
                        WHEN DATE_FORMAT(a.date, '%Y') = '${selectedYear}' 
                        AND DATE_FORMAT(a.date, '%m') = '${monthStr}' 
                        AND a.attn_status NOT IN ('W')
                        AND e.employee_type_id = 1 
                        THEN 1 
                    END
                ) AS plannedEmp${monthStr}${selectedYear},
    
                COUNT(
                    CASE 
                        WHEN DATE_FORMAT(a.date, '%Y') = '${selectedYear}' 
                        AND DATE_FORMAT(a.date, '%m') = '${monthStr}' 
                        AND a.attn_status IN ('P', 'WP', 'HP') 
                        AND e.employee_type_id = 1
                        THEN 1 
                    END
                ) AS actualEmp${monthStr}${selectedYear},
    
                COUNT(
                    CASE 
                        WHEN DATE_FORMAT(a.date, '%Y') = '${selectedYear}' 
                        AND DATE_FORMAT(a.date, '%m') = '${monthStr}' 
                        AND a.attn_status NOT IN ('W') 
                        AND e.employee_type_id = 2
                        THEN 1 
                    END
                ) AS plannedWorker${monthStr}${selectedYear},
    
                COUNT(
                    CASE 
                        WHEN DATE_FORMAT(a.date, '%Y') = '${selectedYear}' 
                        AND DATE_FORMAT(a.date, '%m') = '${monthStr}' 
                        AND a.attn_status IN ('P', 'WP', 'HP') 
                        AND e.employee_type_id = 2
                        THEN 1 
                    END
                ) AS actualWorker${monthStr}${selectedYear}
            `);
        }

        let monthQueryPart = monthConditions.join(",\n");

        let query = `
            WITH ActiveEmployees AS (
                SELECT DISTINCT e.id, e.branch_id, e.employee_type_id
                FROM ${this.dbNames.ems}.employee e
                WHERE e.is_active = 1
            )
            SELECT 
                b.branch_name AS branchName,
                a.branch_id,
                b.state,
                (SELECT COUNT(DISTINCT e.id) FROM ActiveEmployees e WHERE e.branch_id = a.branch_id AND e.employee_type_id = 1) AS employeeActive,
                (SELECT COUNT(DISTINCT e.id) FROM ActiveEmployees e WHERE e.branch_id = a.branch_id AND e.employee_type_id = 2) AS workerActive,
                ${monthQueryPart}
            FROM ${this.dbNames.lms}.attendance a
            LEFT JOIN ${this.dbNames.ems}.branches b ON a.branch_id = b.id
            LEFT JOIN ${this.dbNames.ems}.employee e ON a.emp_id = e.id
            WHERE a.id > 0 AND a.branch_id IS NOT NULL
            ${req.branchId ? `AND a.branch_id = ?` : ''}
            GROUP BY a.branch_id HAVING employeeActive > 0 OR workerActive > 0`;

        try {
            const queryParams = req.branchId ? [req.branchId] : [];
            const attendanceData = await this.employeeDetailRepo.query(query, queryParams);

            let availableMonths = new Set();
            attendanceData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(plannedEmp|actualEmp|plannedWorker|actualWorker)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]);
                    }
                });
            });

            const result = attendanceData.map((row) => {
                let formattedRow = { ...row };
                availableMonths.forEach((month) => {
                    formattedRow[`plannedEmp${month}`] = row[`plannedEmp${month}`] || 0;
                    formattedRow[`actualEmp${month}`] = row[`actualEmp${month}`] || 0;
                    formattedRow[`plannedWorker${month}`] = row[`plannedWorker${month}`] || 0;
                    formattedRow[`actualWorker${month}`] = row[`actualWorker${month}`] || 0;
                });
                return formattedRow;
            });

            if (result.length) {
                return new CommonResponseModel(true, 1, "Attendance MIS data retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 0, "No attendance MIS data found");
        } catch (error) {
            console.error("Error fetching attendance MIS report:", error);
            return new CommonResponseModel(false, 0, "Error while fetching attendance MIS data");
        }
    }

    async getDeptWiseStrengthForHr1(): Promise<CommonResponseModel> {
        let query = `SELECT COUNT(e.id) AS employeeCount,
            COUNT(CASE WHEN e.employee_type_id = 1 THEN 1 END) AS empCount,
            COUNT(CASE WHEN e.employee_type_id = 2 THEN 1 END) AS workerCount,
        b.unit_name as unitName , d.name as deptName FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
        LEFT JOIN ${this.dbNames.ems}.departments d ON e.department_id = d.id
        WHERE e.is_active = 1 AND b.unit_name IS NOT NULL AND b.unit_name <> '' GROUP BY b.unit_name`
        const data = await this.employeeDetailRepo.query(query)
        console.log(data)
        if (data.length) {
            return new CommonResponseModel(true, 1, "data retrieved Successfully", data);
        }
        return new CommonResponseModel(false, 0, "No data found");
    }

    async getDeptWiseEmpStrengthForHr(): Promise<CommonResponseModel> {
        // Get all unique department names dynamically
        const deptQuery = `
            SELECT DISTINCT d.name AS deptName
            FROM ${this.dbNames.ems}.departments d
            INNER JOIN ${this.dbNames.ems}.employee e ON d.id = e.department_id
            WHERE e.is_active = 1 AND e.employee_type_id = 1
        `;
        const departments = await this.employeeDetailRepo.query(deptQuery);
        if (!departments.length) {
            return new CommonResponseModel(false, 0, "No departments found");
        }
        // Prepare dynamic pivot columns for departments
        const pivotColumns = departments
            .map((dept: any) => `COUNT(CASE WHEN d.name = '${dept.deptName}' THEN e.id END) AS \`${dept.deptName}\``)
            .join(", ");
        // Main query to pivot data
        let query = `
            SELECT 
                b.unit_name AS unitName,
                ${pivotColumns}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            LEFT JOIN ${this.dbNames.ems}.departments d ON e.department_id = d.id
            WHERE e.is_active = 1 AND e.employee_type_id = 1
            GROUP BY b.unit_name
        `;

        const data = await this.employeeDetailRepo.query(query);
        console.log(data);

        if (data.length) {
            return new CommonResponseModel(true, 1, "Data retrieved successfully", data);
        }
        return new CommonResponseModel(false, 0, "No data found");
    }

    async getDeptWiseWorkerStrengthForHr(): Promise<CommonResponseModel> {
        // Get all unique department names dynamically
        const deptQuery = `
            SELECT DISTINCT d.name AS deptName
            FROM ${this.dbNames.ems}.departments d
            INNER JOIN ${this.dbNames.ems}.employee e ON d.id = e.department_id
            WHERE e.is_active = 1 AND e.employee_type_id = 2
        `;

        const departments = await this.employeeDetailRepo.query(deptQuery);

        if (!departments.length) {
            return new CommonResponseModel(false, 0, "No departments found");
        }

        // Prepare dynamic pivot columns for departments
        const pivotColumns = departments
            .map((dept: any) => `COUNT(CASE WHEN d.name = '${dept.deptName}' THEN e.id END) AS \`${dept.deptName}\``)
            .join(", ");

        // Main query to pivot data
        let query = `
            SELECT 
                b.unit_name AS unitName,
                ${pivotColumns}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            LEFT JOIN ${this.dbNames.ems}.departments d ON e.department_id = d.id
            WHERE e.is_active = 1 AND e.employee_type_id = 2
            GROUP BY b.unit_name
        `;

        const data = await this.employeeDetailRepo.query(query);
        console.log(data);

        if (data.length) {
            return new CommonResponseModel(true, 1, "Data retrieved successfully", data);
        }
        return new CommonResponseModel(false, 0, "No data found");
    }

    async getEnrollmentReport(req: any): Promise<CommonResponseModel> {
        const query = `SELECT 
        b.branch_name as branchName,
        COUNT(e.id) AS employeeCount,
        COUNT(CASE WHEN e.pf_no IS NOT NULL AND e.pf_no != '' THEN 1 END) AS pfEnrolledCount,
        COUNT(CASE WHEN e.pf_no IS NULL OR e.pf_no = '' THEN 1 END) AS pfToBeEnrolledCount ,
        COUNT(CASE WHEN e.esic_no IS NOT NULL AND e.esic_no != '' THEN 1 END) AS esciEnrolledCount,
        COUNT(CASE WHEN e.esic_no IS NULL OR e.esic_no = '' THEN 1 END) AS esciToBeEnrolledCount 
        FROM ${this.dbNames.ems}.employee e
        LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
        WHERE e.is_active = 1 ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
        GROUP BY b.id`
        const data = await this.employeeDetailRepo.query(query);
        if (data.length) {
            return new CommonResponseModel(true, 1, "Data retrieved successfully", data);
        }
        return new CommonResponseModel(false, 0, "No data found");
    }

    async getMonthSalariesSummaryReport(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');
            let endOfMonth = new Date(selectedYear, month, 0).toISOString().slice(0, 10);

            monthConditions.push(`
                -- Actual Gross Salary
                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month})
                        AND MONTH(e.date_of_reliving) > ${month}  
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS actualGross${monthStr}${selectedYear},
    
                -- Employer PF (12%) 
                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        AND MONTH(e.date_of_reliving) > ${month}  
                        THEN (e.salary * 0.4 * 0.12)
                        ELSE 0 
                    END
                ) AS employerPF${monthStr}${selectedYear},
    
                -- Employer ESI (3.25%) 
                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month})
                        AND MONTH(e.date_of_reliving) > ${month}  
                        THEN (e.salary * 0.4 * 0.0325)
                        ELSE 0 
                    END
                ) AS employerESI${monthStr}${selectedYear}
            `);
        }

        let monthQueryPart = monthConditions.join(",\n");

        let query = `
            SELECT 
                b.branch_name AS branchName,
                e.branch_id,
                b.state,
                COUNT(e.id) AS totalEmployees,
                ${monthQueryPart}
            FROM ${this.dbNames.ems}.employee e
            INNER JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            
            WHERE e.is_active = 1 
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
            GROUP BY e.branch_id
        `;

        let payrollMonthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');
            let endOfMonth = new Date(selectedYear, month, 0).toISOString().slice(0, 10);

            payrollMonthConditions.push(`
                -- Paid Gross Salary
                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr}  
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS paidGross${monthStr}${selectedYear}
            `);
        }

        let payrollQuery = `
            SELECT 
                p.branch_id,
                ${payrollMonthConditions.join(",\n")}
            FROM ${this.dbNames.pms}.payroll_processed_logs p
            WHERE LEFT(p.payroll_month, 4) = ${selectedYear}
            ${req.branchId ? `AND p.branch_id = ${req.branchId}` : ''}
            GROUP BY p.branch_id
        `;

        try {
            const employeeData = await this.employeeDetailRepo.query(query);
            const payrollData = await this.employeeDetailRepo.query(payrollQuery);

            let availableMonths = new Set();
            employeeData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(actualGross|employerPF|employerESI)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]);
                    }
                });
            });

            payrollData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(paidGross)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]);
                    }
                });
            });

            const payrollMap = payrollData.reduce((acc, row) => {
                let branchId = row.branch_id;
                availableMonths.forEach((month) => {
                    acc[`${branchId}_${month}`] = {
                        paidGross: row[`paidGross${month}`] || 0
                    };
                });
                return acc;
            }, {});

            const result = employeeData.map((row) => {
                let formattedRow = { ...row };
                availableMonths.forEach((month) => {
                    let payrollKey = `${row.branch_id}_${month}`;

                    // Get data from payrollMap
                    let actualGross = row[`actualGross${month}`] || 0;
                    let paidGross = payrollMap[payrollKey]?.paidGross || 0;
                    let employerPF = row[`employerPF${month}`] || 0;
                    let employerESI = row[`employerESI${month}`] || 0;
                    let totalEmployees = row.totalEmployees || 1; // Avoid division by zero

                    // 🟢 Corrected Cost to Company Calculation
                    let costToCompany = parseFloat(actualGross) + parseFloat(employerPF) + parseFloat(employerESI);

                    // 🟢 Preventing NaN in Average CTC and Gross Salary Per Head
                    let avgCTCPerHead = totalEmployees > 0 ? (costToCompany / totalEmployees).toFixed(2) : "0.00";
                    let avgGrossPerHead = totalEmployees > 0 ? (actualGross / totalEmployees).toFixed(2) : "0.00";

                    // ✅ Correct values added to formattedRow
                    formattedRow[`paidGross${month}`] = parseFloat(paidGross).toFixed(2);
                    formattedRow[`costToCompany${month}`] = costToCompany.toFixed(2);
                    formattedRow[`avgCTCPerHead${month}`] = avgCTCPerHead;
                    formattedRow[`avgGrossPerHead${month}`] = avgGrossPerHead;
                });

                return formattedRow;
            });

            console.log(result, '------resulttt')
            if (result.length) {
                return new CommonResponseModel(true, 1, "Branch-wise payroll report retrieved successfully", result);
            }
            return new CommonResponseModel(false, 0, "No data found");
        } catch (error) {
            console.error("Error fetching payroll data:", error);
            return new CommonResponseModel(false, 0, "Error while fetching data");
        }
    }

    async getAttritionAnalysisReport(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');
            let startOfMonth = `${selectedYear}-${monthStr}-01`;
            let endOfMonth = new Date(selectedYear, month, 0).toISOString().slice(0, 10);

            monthConditions.push(`
                -- New Joiners Count
                COUNT(
                    CASE 
                        WHEN e.date_of_joining BETWEEN '${startOfMonth}' AND '${endOfMonth}' 
                        AND e.is_active = 1 
                        THEN e.id 
                        ELSE NULL 
                    END
                ) AS newJoinees${monthStr}${selectedYear},
                
                -- Left Employees Count
                COUNT(
                    CASE 
                        WHEN e.date_of_reliving BETWEEN '${startOfMonth}' AND '${endOfMonth}' 
                        THEN e.id 
                        ELSE NULL 
                    END
                ) AS leftEmployees${monthStr}${selectedYear},
    
                -- Attrition Percentage
                IF(
                    COUNT(
                        CASE 
                            WHEN e.date_of_reliving BETWEEN '${startOfMonth}' AND '${endOfMonth}' 
                            THEN e.id 
                            ELSE NULL 
                        END
                    ) = 0, 
                    0,
                    ROUND(
                        (
                            COUNT(
                                CASE 
                                    WHEN e.date_of_reliving BETWEEN '${startOfMonth}' AND '${endOfMonth}' 
                                    THEN e.id 
                                    ELSE NULL 
                                END
                            ) / COUNT(e.id)
                        ) * 100, 2
                    )
                ) AS attrition${monthStr}${selectedYear}
            `);
        }

        let monthQueryPart = monthConditions.join(",\n");

        // ✅ Query for Employee Data
        let query = `
            SELECT 
                b.branch_name AS branchName,
                e.branch_id,
                COUNT(e.id) AS totalEmployees,
                ${monthQueryPart}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            WHERE e.is_active = 1 
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
            GROUP BY e.branch_id
        `;

        // ✅ Payroll Count Conditions
        let payrollMonthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');

            payrollMonthConditions.push(`
                -- Payroll Count for Month ${monthStr}
                COUNT(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = '${monthStr}' 
                        THEN p.id 
                        ELSE NULL 
                    END
                ) AS headCount${monthStr}${selectedYear}
            `);
        }

        // ✅ Query for Payroll Data
        let payrollQuery = `
            SELECT 
                p.branch_id,
                ${payrollMonthConditions.join(",\n")}
            FROM ${this.dbNames.pms}.payroll_processed_logs p
            WHERE LEFT(p.payroll_month, 4) = '${selectedYear}'
            ${req.branchId ? `AND p.branch_id = ${req.branchId}` : ''}
            GROUP BY p.branch_id
        `;

        // ✅ Fetch Data from DB
        const employeeData = await this.employeeDetailRepo.query(query);
        const payrollData = await this.employeeDetailRepo.query(payrollQuery);

        // ✅ Merge Data into Single Array
        const mergedData = employeeData.map((emp) => {
            const matchingPayroll = payrollData.find((pay) => pay.branch_id === emp.branch_id);
            if (matchingPayroll) {
                return {
                    ...emp, // Add employee data
                    ...matchingPayroll, // Add matching payroll data
                };
            } else {
                return emp; // No matching payroll, return employee data as-is
            }
        });

        // ✅ Return Merged Data
        if (mergedData.length) {
            return new CommonResponseModel(true, 1, "Data retrieved successfully", mergedData);
        } else {
            return new CommonResponseModel(false, 0, "No data found");
        }
    }

    async getEmployeeNamesList(): Promise<CommonResponseModel> {
        let query = `SELECT MIN(e.id) AS id, CONCAT(e.first_name, ' ', e.last_name) AS fullName
                    FROM employee e
                    WHERE e.is_active = 1
                    GROUP BY fullName
                    ORDER BY id ASC;`
        const data = await this.employeeDetailRepo.query(query)
        return data
    }

    async getBranchNamesList(): Promise<CommonResponseModel> {
        let query = `SELECT e.branch_id, b.branch_name 
                    FROM employee e 
                    LEFT JOIN branches b ON e.branch_id = b.id 
                    GROUP BY e.branch_id, b.branch_name;`
        const data = await this.employeeDetailRepo.query(query)
        return data
    }

    // async getBranchAndRmByEmployee(employeeName: string): Promise<CommonResponseModel> {
    //     const query = `
    //         SELECT DISTINCT 
    //             e.id, 
    //             CONCAT(e.first_name, ' ', e.last_name) AS fullName, 
    //             b.branch_name, 
    //             e.reporting_manager AS reportingManager
    //         FROM employee e
    //         LEFT JOIN branches b ON e.branch_id = b.id
    //         WHERE e.is_active = 1 
    //         AND CONCAT(e.first_name, ' ', e.last_name) = ?;
    //     `;
    //     const data = await this.employeeDetailRepo.query(query, [employeeName]);
    //     return data;
    // }


    async getBranchAndRmByEmployee(employeeName: string): Promise<CommonResponseModel> {
        const query = `
            SELECT DISTINCT 
                e.id, 
                CONCAT(e.first_name, ' ', e.last_name) AS fullName, 
                b.branch_name, 
                CONCAT(rpm.first_name, ' ', rpm.last_name)  AS reportingManager,
                rpm.reporting_manager as reportingManagerID
            FROM employee e
            LEFT JOIN branches b ON e.branch_id = b.id
            LEFT JOIN employee rpm ON rpm.id = e.reporting_manager
            WHERE e.is_active = 1 
            AND CONCAT(e.first_name, ' ', e.last_name) = ?;
        `;

        const data = await this.employeeDetailRepo.query(query, [employeeName]);

        return data
    }

    async getExpansesMisReport(req: any): Promise<CommonResponseModel> {
        // Fetch unique expense types dynamically
        const expenseTypeQuery = `
            SELECT DISTINCT e.expenses_type
            FROM ${this.dbNames.ems}.expenses e
        `;
        const expenseTypes = await this.employeeDetailRepo.query(expenseTypeQuery);

        if (!expenseTypes.length) {
            return new CommonResponseModel(false, 0, "No expense types found.");
        }

        // Create dynamic pivot columns for expense types
        const pivotColumns = expenseTypes
            .map((expense: any) => `
                SUM(CASE WHEN e.expenses_type = '${expense.expenses_type}' THEN e.amount ELSE 0 END) AS '${expense.expenses_type}'
            `)
            .join(", ");

        // Main query to get branch-wise sum of expenses with dynamic pivot
        const query = `
            SELECT 
                e.branch AS branchName,
                ${pivotColumns}
            FROM ${this.dbNames.ems}.expenses e
            WHERE e.expenses_id > 0
            GROUP BY e.branch
        `;
        const data = await this.employeeDetailRepo.query(query);
        if (data.length) {
            return new CommonResponseModel(true, 1, "Data retrieved successfully", data);
        } else {
            return new CommonResponseModel(false, 0, "No data found.");
        }
    }


    async getBankAndCashMisReport(req: any): Promise<CommonResponseModel> {
        const selectedYear = req.year || new Date().getFullYear();
        const currentDate = new Date();
        const currentMonth = selectedYear === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

        // Generate month-wise conditions based on available data
        let monthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');
            let endOfMonth = new Date(selectedYear, month, 0).toISOString().slice(0, 10);

            monthConditions.push(`
                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND COALESCE(e.bank_ac_no, '') != ''
                        AND e.employee_type_id = 1
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS empBank${monthStr}${selectedYear},

                 SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND COALESCE(e.bank_ac_no, '') = ''
                        AND e.employee_type_id = 1
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS empCash${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND COALESCE(e.bank_ac_no, '') != ''
                        AND e.employee_type_id = 2
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS workerBank${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN e.date_of_joining <= '${endOfMonth}' 
                        AND COALESCE(e.bank_ac_no, '') = ''
                        AND e.employee_type_id = 2
                        AND (e.date_of_reliving IS NULL OR MONTH(e.date_of_reliving) != ${month}) 
                        THEN e.salary 
                        ELSE 0 
                    END
                ) AS workerCash${monthStr}${selectedYear}

            `);
        }

        let monthQueryPart = monthConditions.length > 0 ? monthConditions.join(",\n") : '';

        // Employee Query
        let query = `
            SELECT 
                b.branch_name AS branchName,
                e.branch_id,
                b.state,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 1 THEN 1 END) AS employeeActive,
                COUNT(CASE WHEN e.is_active = 1 AND e.employee_type_id = 2 THEN 1 END) AS workerActive,
                ${monthQueryPart}
            FROM ${this.dbNames.ems}.employee e
            LEFT JOIN ${this.dbNames.ems}.branches b ON e.branch_id = b.id
            WHERE e.id > 0 
            ${req.branchId ? `AND e.branch_id = ${req.branchId}` : ''}
            AND YEAR(e.date_of_joining) <= ${selectedYear}
            GROUP BY e.branch_id HAVING employeeActive > 0 OR workerActive > 0
        `;

        // Payroll Query
        let payrollMonthConditions = [];
        for (let month = 1; month <= currentMonth; month++) {
            let monthStr = month.toString().padStart(2, '0');

            payrollMonthConditions.push(`
                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr} 
                        AND COALESCE(e.bank_ac_no, '') != ''
                        AND e.employee_type_id = 1 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_employee_bank${monthStr}${selectedYear},

                 SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr} 
                        AND COALESCE(e.bank_ac_no, '') = ''
                        AND e.employee_type_id = 1 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_employee_cash${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr}
                        AND COALESCE(e.bank_ac_no, '') != ''
                        AND e.employee_type_id = 2 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_worker_bank${monthStr}${selectedYear},

                SUM(
                    CASE 
                        WHEN RIGHT(p.payroll_month, 2) = ${monthStr}
                        AND COALESCE(e.bank_ac_no, '') = ''
                        AND e.employee_type_id = 2 
                        THEN p.net_pay 
                        ELSE 0 
                    END
                ) AS payroll_worker_cash${monthStr}${selectedYear}
            `);
        }

        let payrollQuery = `
            SELECT 
                p.branch_id,
                ${payrollMonthConditions.join(",\n")}
            FROM ${this.dbNames.pms}.payroll_processed_logs p
            LEFT JOIN ${this.dbNames.ems}.employee e 
                ON p.branch_id = e.branch_id 
            WHERE LEFT(p.payroll_month, 4) = ${selectedYear}
            ${req.branchId ? `AND p.branch_id = ${req.branchId}` : ''}
            GROUP BY p.branch_id
        `;
        try {
            const employeeData = await this.employeeDetailRepo.query(query);
            const payrollData = await this.employeeDetailRepo.query(payrollQuery);

            // Extract existing months dynamically
            let availableMonths = new Set();
            employeeData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(empCash|empBank|workerBank|workercash)(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]); // Add MMYYYY to Set
                    }
                });
            });

            payrollData.forEach((row) => {
                Object.keys(row).forEach((key) => {
                    const match = key.match(/(payroll_employee_bank|payroll_employee_cash|payroll_worker_bank|payroll_worker_cash)_(\d{6})/);
                    if (match) {
                        availableMonths.add(match[2]); // Add MMYYYY to Set
                    }
                });
            });

            console.log("Available Months:", availableMonths);

            // Transform payroll data into a structured format
            const payrollMap = payrollData.reduce((acc, row) => {
                let branchId = row.branch_id;
                availableMonths.forEach((month) => {
                    acc[`${branchId}_${month}`] = {
                        employeeBank: row[`payroll_employee_bank${month}`] || 0,
                        workerBank: row[`payroll_worker_bank${month}`] || 0,
                        employeeCash: row[`payroll_employee_cash${month}`] || 0,
                        workerCash: row[`payroll_worker_cash${month}`] || 0,
                    };
                });
                return acc;
            }, {});

            console.log("Payroll Map:", payrollMap);

            const result = employeeData.map((row) => {
                let formattedRow = { ...row };

                availableMonths.forEach((month) => {
                    let payrollKey = `${row.branch_id}_${month}`;

                    formattedRow[`empBank${month}`] = row[`empBank${month}`] || 0;
                    formattedRow[`workerBank${month}`] = row[`workerBank${month}`] || 0;
                    formattedRow[`empCash${month}`] = row[`empCash${month}`] || 0;
                    formattedRow[`workerCash${month}`] = row[`workerCash${month}`] || 0;

                    formattedRow[`payroll_employee_bank${month}`] = payrollMap[payrollKey]?.employeeBank || 0;
                    formattedRow[`payroll_worker_bank${month}`] = payrollMap[payrollKey]?.workerBank || 0;
                    formattedRow[`payroll_employee_cash${month}`] = payrollMap[payrollKey]?.employeeCash || 0;
                    formattedRow[`payroll_worker_cash${month}`] = payrollMap[payrollKey]?.workerCash || 0;
                });

                return formattedRow;
            });
            if (result.length) {
                return new CommonResponseModel(true, 1, "Data Retrieved Successfully", result);
            }
            return new CommonResponseModel(false, 0, "No data found");
        } catch (error) {
            console.error("Error fetching branch-wise payroll count:", error);
            return new CommonResponseModel(false, 0, "Error while fetching data");
        }
    }

    async getOnlyEmployeeType(): Promise<CommonResponseModel> {
        try {
            const data = await this.employeeDetailRepo.getOnlyEmployeeType()
            if (data) {
                return new CommonResponseModel(true, 1, 'Data', data)
            } else {
                return new CommonResponseModel(false, 0, 'Failed')
            }
        } catch (err) {
            console.log(err);
        }
    }

    async checkEmpIdDuplicates(req: any): Promise<CommonResponseModel> {
        const data = await this.employeeDetailRepo.find({ where: { id: req.idNumber } })
        if (data) {
            const response = await this.getEmpById({ employeeId: data[0].id });
            return new CommonResponseModel(true, 1, 'Id Number already exist', response.data);
        } else {
            return new CommonResponseModel(false, 0, 'No data found');
        }
    }


}    
