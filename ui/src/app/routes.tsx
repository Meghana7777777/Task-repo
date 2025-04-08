import { createHashRouter, Navigate } from "react-router-dom";
import Login from "./layouts/login/login";
import MainLayout from "./layouts/main-layout/main-layout";
import SelfServicePortalMainLayout from "./layouts/self-service-portal-layout/self-service-portal-layout";
import EmployeeDashboard from "./modules/employee-dashboard/employee-dashboard";
import Forms from "./modules/employee-froms/statutory-handovers/forms";
import TourIntimationForm from "./modules/employee-froms/statutory-handovers/tour-intimation/tour-intimation-form";
import TourIntimationView from "./modules/employee-froms/statutory-handovers/tour-intimation/tour-intimation-view";
import EmployeeBelowAgeData from "./modules/employee-management/employee-onboard/components/employee-approval-data/employee-below-age-data";
import EmployeeSettings from "./modules/employee-management/employee-onboard/components/employee-settings.tsx/employee-settings";
import BulkOtApproval from "./modules/employee-management/employee-onboard/components/ot-approval/bulk-ot-approval";
import OtApprovalReport from "./modules/employee-management/employee-onboard/components/ot-approval/ot-approval-report-";
import EmployeeFormConfig from "./modules/employee-management/employee-onboard/pages/employee-configuration/employee-configuration";
import EmployeeIdProofView from "./modules/employee-management/employee-onboard/pages/employee-directory-view/employee-id-proof-view";
import EmployeeForm from "./modules/employee-management/employee-onboard/pages/employee-form/employee-form";
import EmployeeLogs from "./modules/employee-management/employee-onboard/pages/employee-logs/employee-logs";
import EmployeeRMUpdate from "./modules/employee-management/employee-onboard/pages/employee-rm-update.tsx/employee-rm-update";
import EmployeeView from "./modules/employee-management/employee-onboard/pages/employee-view/employee-view";
import ApplyForOdCoForm from "./modules/leave-management/apply-co-od-upload-form/apply-co-od-upload-form";
import ApplyForOdCoView from "./modules/leave-management/apply-co-od-upload-grid/apply-co-od-upload-view";
import ApplyForLeavesExcelUpload from "./modules/leave-management/apply-for-leaves/apply-for-leave-form/apply-for-leaves-form";
import { ApplyForLeavesManualForm } from "./modules/leave-management/apply-for-leaves/apply-for-leave-form/apply-for-leaves-mannual-form";
import ApplyForLeavesGrid from "./modules/leave-management/apply-for-leaves/apply-for-leaves-grid/apply-for-leaves-grid";
import LeavesApprovalGrid from "./modules/leave-management/apply-for-leaves/apply-for-leaves-grid/leave-approvals-grid";
import AttendanceAdjustmentForBulk from "./modules/leave-management/attendance-adjustment/attendance-adjustment-bulk-applay";
import AttendanceTabs from "./modules/leave-management/attendance-adjustment/attendance-adjustment-main";
import BulkAttendanceApproval from "./modules/leave-management/attendance-adjustment/bulk-manuall-attendance-approval";
import LeaveAdjustmentForm from "./modules/leave-management/leave-adjustmnet/leave-adjustment-form";
import LeaveAdjustmentGrid from "./modules/leave-management/leave-adjustmnet/leave-adjustment-grid";
import AllocationTabs from "./modules/leave-management/leave-allocation-form/allocation-tabs";
import LeaveAllocationView from "./modules/leave-management/leave-allocation-grid/leave-allocation-view";
import LeavePolicyView from "./modules/leave-management/leave-policy/leave-policy-view";
import AbsentReport from "./modules/leave-management/reports/absent-report";
import AttendanceReport from "./modules/leave-management/reports/attedance-report";
import AttendanceCompilanceAuditLogs from "./modules/leave-management/reports/attendance-audit-logs-report";
import MisleniousAttendanceReport from "./modules/leave-management/reports/attn-mislenious-report";
import BankPaymentReport from "./modules/leave-management/reports/bankpayment-report";
import EmpAttendenceScoreCard from "./modules/leave-management/reports/employee-attendance-scorecard";
import EmpAllWorkingHrsReport from "./modules/leave-management/reports/employee-console-working";
import ExtraWorkHours from "./modules/leave-management/reports/extra-work-hours";
import LeaveBalanceHistory from "./modules/leave-management/reports/leave-balance-history";
import LeaveBalanceReport from "./modules/leave-management/reports/leave-balanced-report";
import LeaveHistoryReport from "./modules/leave-management/reports/leave-history-report";
import MonthWiseEmpReport from "./modules/leave-management/reports/month-wise-employee-report";
import WorkingHoursReports from "./modules/leave-management/reports/working-hours-report";
import SelfAttendanceAdjustment from "./modules/leave-management/self-attendance-adjustment/self-attendance-adjustment-form";
import { SelfLeaveApplyForm } from "./modules/leave-management/self-service-leave-apply/self-leave-apply-form";
import SelfServiceViewAttedance from "./modules/leave-management/self-service-view-attedance/self-service-view-attedance";
import ShiftChangeReq from "./modules/leave-management/shift-change-form/shift-change-req-form";
import ShiftChangeView from "./modules/leave-management/shift-change-grid/shift-change-grid";
import EmployeeShiftChangeReq from "./modules/leave-management/shift-change-request/shift-change-request";
import EmployeeShiftMapping from "./modules/leave-management/shift-maing/shift-maping-form";
import TeamCalenderForm from "./modules/leave-management/team-calender-form/team-calender-form";
import TeamCalenderView from "./modules/leave-management/Team-calender-grid/team-calender-grid";
import OverTimeForm from "./modules/masters/pages/apply-ot-form/apply-ot-form";
import OverTimeGrid from "./modules/masters/pages/apply-ot-grid/apply-ot-grid";
import AttendanceDeviceForm from "./modules/masters/pages/attendance-device-form/attendance-device-form";
import AttendanceDeviceGrid from "./modules/masters/pages/attendance-device-grid/attendance-device-grid";
import BranchForm from "./modules/masters/pages/branches-form/branch-form";
import BranchMappingGrid from "./modules/masters/pages/branches-mapping-grid/branches-mapping-grid";
import BranchView from "./modules/masters/pages/branchs-view/branches-view";
import DepartmentsForm from "./modules/masters/pages/departments-from/departments-form";
import DepartmentsGrid from "./modules/masters/pages/departments-grid/departments-grid";
import DesignationsForm from "./modules/masters/pages/designations-form/designations-form";
import DesignationsGrid from "./modules/masters/pages/designations-grid/designations-grid";
import DivisionForm from "./modules/masters/pages/division-form/division-form";
import DivisionGrid from "./modules/masters/pages/division-grid/division-grid";
import EmployeeTypeForm from "./modules/masters/pages/employee-type/employee-type-form";
import EmployeeTypeView from "./modules/masters/pages/employee-type/employee-type-grid";
import HolidayForm from "./modules/masters/pages/holiday-form/holiday-form";
import HolidayView from "./modules/masters/pages/holiday-view/holiday-view";
import IdProofForm from "./modules/masters/pages/id-proof/id-proof-form";
import IdProofView from "./modules/masters/pages/id-proof/id-proof-grid";
import QualificationsForm from "./modules/masters/pages/qualifications-form/qualifications-form";
import QualificationsGrid from "./modules/masters/pages/qualifications-grid/qualifications-grid";
import RealtionsForm from "./modules/masters/pages/relation-form/relation-form";
import RelationsGrid from "./modules/masters/pages/relation-grid/relations-grid";
import ShiftForm from "./modules/masters/pages/shift-form/shift-form";
import ShiftView from "./modules/masters/pages/shift-view/shift-view";
import SkillsForm from "./modules/masters/pages/skills-form/skills-form";
import SkillsGrid from "./modules/masters/pages/skills-grid/skills-grid";
import TypesOfLeavesForm from "./modules/masters/pages/types-off-leaves-form/types-off-leaves-form";
import TypesOfLeavesGrid from "./modules/masters/pages/types-off-leaves-grid/types-off-leaves-grid";
import WeekOffLeavesForm from "./modules/masters/pages/week-off-leaves-form/week-off-leaves-form";
import WeekOffLeavesGrid from "./modules/masters/pages/week-off-leaves-grid/week-off-leaves-grid";
import MainDashboard from "./modules/new-dashboards/main-dashboard";
import EmployeeLoanGrid from "./modules/payroll-management/employee-loan-salary/emp-loan-salary-grid";
import EmployeePayrollComponent from "./modules/payroll-management/employee-payroll-components/employee-payroll-component";
import EmpRecComponentTabs from "./modules/payroll-management/employee-reccuring-comp/emp-rec-comp-main";
import PayrollComponentsForm from "./modules/payroll-management/payroll-components/payroll-comp-form";
import PayrollComponentsGrid from "./modules/payroll-management/payroll-components/payroll-comp-grid";
import EmployeeNonRecurringView from "./modules/payroll-management/payroll-employee-non-recc/employee-non-rec-view";
import EmployeeNonRecurringForm from "./modules/payroll-management/payroll-employee-non-recc/employee-non-recc-form";
import PayrollGeneration from "./modules/payroll-management/payroll-generation/payroll-generation";
import PayrollComponentWIseReport from "./modules/payroll-management/payroll-reports/payroll-component-wise-report";
import PayrollEmployeeReports from "./modules/payroll-management/payroll-reports/payroll-log-reports";
import PayrollProcessedLogReport from "./modules/payroll-management/payroll-reports/payroll-processed-log-report";
import PayrollTypeComponentsMapping from "./modules/payroll-management/payroll-type-components/payroll-type-components-mapping";
import PayrollTypesForm from "./modules/payroll-management/payroll-types-from/payroll-types-form";
import PayrollTypesGrid from "./modules/payroll-management/payroll-types-grid/payroll-types-grid";
import PayslipGeneration from "./modules/payroll-management/payslip/payslip-generation";
import PayslipView from "./modules/payroll-management/payslip/payslip-view";
import PersonalInfromationManagementView from "./modules/self-service-portal/personal-information-management/personal-infromation-management-view";
import LeavePolicyMain from "./modules/leave-management/leave-policy/leave-policy-conifgurations-new-";
import PayrollHeadcountReport from "./modules/payroll-management/payroll-reports/payroll-head-count-report";
import BankReconciliation from "./modules/payroll-management/payroll-reports/bank-reconilation-report";
import LeaveMapping from "./modules/leave-management/leave-policy/leave-mapping";
import ReferanceBasedEmployeeReport from "./modules/leave-management/reports/referance-basedemployee-report";
import LateMinutesReport from "./modules/leave-management/reports/late-minuts-report";
import WeekWiseEmpReport from "./modules/leave-management/reports/weekly-employee-report";
import CarryForwardHodApproval from "./modules/payroll-management/payroll-generation/carry-forward-hod-approval";
import LeaveApplicabilityGrid from "./modules/leave-management/leave-applicability/leave-applicability-grid";
import LeaveMappingView from "./modules/leave-management/leave-policy/leave-mapping-grid";
import OtApprovedView from "./modules/employee-management/employee-onboard/components/ot-approval/ot-approved-view";
import DayWisePayUpload from "./modules/payroll-management/day-wise-pay/day-wise-pay-upload";
import AttendanceStatusView from "./modules/masters/pages/attendance-status-view/attendance-status-view";
import AttendanceStatusForm from "./modules/masters/pages/attendance-status-form/attendance-status-form";
import SinglePunchAttandenceReport from "./modules/leave-management/reports/singngle-punch-attandence-report";
import EmpResignationView from "./modules/employee-management/employee-onboard/pages/employee-view/employee-resignation-view";
import LeaveGroupsGrid from "./modules/masters/pages/leave-group-grid/leave-group-grid";
import LeaveGroupsForm from "./modules/masters/pages/leave-group-form/leave-groups-form";
import EmployeeRMUnAssignedReport from "./modules/employee-management/employee-onboard/pages/employee-rm-report/employee-rm-report";
import LeaveCollisionReport from "./modules/leave-management/reports/leave-collision-report";
import MessExtraDaysUpload from "./modules/payroll-management/mess-extra-days/mess-extra-days";
import PayrollHeadWiseReport from "./modules/payroll-management/payroll-reports/payroll-headwise-report";
import EmployeePfAndEsiReport from "./modules/leave-management/reports/employee-pf-esi-report";
import PayrollCheckList from "./modules/payroll-management/payroll-generation/payroll-checklist";
import AbsentReportForRM  from "./modules/self-service-portal/leaves-rm-employees/leaves-rm-employees";
import ReferenceBasedEmployeeReport from "./modules/leave-management/reports/referance-basedemployee-report";
import BranchWiseEmployeeTrack from "./modules/leave-management/reports/employee-track-report";
import EmployeeJoiningData from "./modules/employee-froms/employee-joinig-data";
import FinalSettlementData from "./modules/employee-froms/statutory-handovers/Final-settelMent-data";
import EmployeeExitDocumentData from "./modules/employee-froms/employee-exit-document-data";
import SampleOfferLetterForm from "./modules/employee-froms/Sample-Offer-Letter-form";
import CashReconciliation from "./modules/payroll-management/payroll-reports/cash-reconilation-report";

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'))
    return isAuthenticated ? element : <Navigate to="/login" replace={true} />;
};
export const router = createHashRouter([
    {
        path: '/',
        element: <ProtectedRoute element={<MainLayout />} />,
        children: [
            {
                path: '/',
                // element: <HomeDashboard />
                element: <MainDashboard />
            },

            {
                path: '/master',
                children: [
                    {
                        path: 'departments-form',
                        element: <DepartmentsForm departmentData={undefined} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'departments-view',
                        element: <DepartmentsGrid scopes={[]} />
                    },
                    {
                        path: 'relations-form',
                        element: <RealtionsForm relationsData={undefined} updateDetails={function (Style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllRelations={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'relations-view',
                        element: <RelationsGrid scopes={[]} />
                    }
                    ,
                    {
                        path: 'types-of-leaves-view',
                        element: <TypesOfLeavesGrid scopes={[]} />
                    }
                    ,
                    {
                        path: 'types-of-leaves-form',
                        element: <TypesOfLeavesForm leavesData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllTypesOfLeaves={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },


                    {
                        path: 'branches-form',
                        element: <BranchForm branchData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllBranches={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'branches-view',
                        element: <BranchView scopes={[]} />
                    },
                    {
                        path: 'shift-view',
                        element: <ShiftView scopes={[]} />
                    },
                    {
                        path: 'shift-form',
                        element: <ShiftForm shiftData={undefined} updateDetails={function (Style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllShifts={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'attendance-status-view',
                        element: <AttendanceStatusView scopes={[]} />
                    },
                    {
                        path: 'attendance-status-form',
                        element: <AttendanceStatusForm attendanceStatusData={undefined} updateDetails={function (Style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllAttendanceStatus={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    // {
                    //     path: 'designations-view',
                    //     element: <DesignationsGrid scopes={[]} />

                    // },
                    {
                        path: 'designations-form',
                        element: <DesignationsForm designationsData={undefined} />
                    },

                    // {
                    //     path: 'holiday-form',
                    //     element: <HolidayForm updateDetails={() => { }} isUpdate={false} closeForm={function (): void {
                    //         throw new Error("Function not implemented.");
                    //     }} getAllHolidays={function (): void {
                    //         throw new Error("Function not implemented.");
                    //     }} holidayData={null} />
                    // },
                    {
                        path: 'holiday-view',
                        element: <HolidayView scopes={[]} />
                    },
                    {
                        path: 'skills-view',
                        element: <SkillsGrid scopes={[]} />

                    },
                    {
                        path: 'skills-form',
                        element: <SkillsForm skillsData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getSkills={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'qualifications-grid',
                        element: <QualificationsGrid scopes={[]} />

                    },
                    {
                        path: 'qualifications-form',
                        element: <QualificationsForm qualificationsData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getQualifications={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {

                        path: 'id-proof-view',
                        element: <IdProofView scopes={[]} />
                    },
                    {
                        path: 'id-proof-form',
                        element: <IdProofForm data={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAll={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'employee-type-view',
                        element: <EmployeeTypeView scopes={[]} />
                    },
                    {
                        path: 'employee-type-form',
                        element: <EmployeeTypeForm data={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAll={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                    // {
                    //     path: 'week-off-leave-grid',
                    //     element: <WeekOffLeavesGrid />
                    // },
                    // {
                    //     path: 'week-off-leave-form',
                    //     element: <WeekOffLeavesForm closeForm={function (): void {
                    //         throw new Error("Function not implemented.");
                    //     }} getAllWeekOffLeaves={function (): void {
                    //         throw new Error("Function not implemented.");
                    //     }} />
                    // },
                    {
                        path: 'designations-grid',
                        element: <DesignationsGrid scopes={[]} />

                    },
                    {
                        path: 'designations-form',
                        element: <DesignationsForm designationsData={undefined} isUpdate={undefined} />
                    },
                    {
                        path: 'skills-grid',
                        element: <SkillsGrid scopes={[]} />

                    },
                    {
                        path: 'skills-form',
                        element: <SkillsForm skillsData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getSkills={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                    {
                        path: 'qualifications-form',
                        element: <QualificationsForm qualificationsData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getQualifications={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                    {
                        path: 'id-proof-form',
                        element: <IdProofForm data={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAll={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                    {
                        path: 'employee-type-form',
                        element: <EmployeeTypeForm data={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAll={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                    {
                        path: 'division-grid',
                        element: <DivisionGrid scopes={[]} />
                    },
                    {
                        path: 'apply-ot-grid',
                        element: <OverTimeGrid />
                    },
                    {
                        path: 'division-form',
                        element: <OverTimeForm OverTimeData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllOt={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'division-form',
                        element: <DivisionForm divisionData={undefined} updateDetails={function (Style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllDivision={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'attendance-device-grid',
                        element: <AttendanceDeviceGrid />
                    },
                    {
                        path: 'attendance-device-form',
                        element: <AttendanceDeviceForm AttendanceDeviceData={undefined} updateDetails={function (Style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAttendanceDevice={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'branches-mapping-grid',
                        element: <BranchMappingGrid scopes={[]} />
                    },

                ]
            },
            {
                path: '/employee-management',
                children: [
                    {
                        path: 'employee-form-configuration',
                        element: <EmployeeFormConfig />
                    },
                    {
                        path: 'employee-form',
                        element: <EmployeeForm closeForm={() => { }} employeeData={undefined} isUpdate={undefined} />
                    },
                    {
                        path: 'employee-view',
                        element: <EmployeeView scopes={[]} />
                    },
                    {
                        path: 'employee-rm-update',
                        element: <EmployeeRMUpdate scopes={[]} />
                    },
                    {
                        path: 'employee-form-settings',
                        element: <EmployeeSettings />
                    },
                    {
                        path: 'employee-logs',
                        element: <EmployeeLogs />
                    },
                    {
                        path: 'employee-ApprovalData',
                        element: <EmployeeBelowAgeData />
                    },
                    {
                        path: 'employee-resignation-view',
                        element: <EmpResignationView data={undefined} />
                    },


                ]

            },
            {
                path: '/Attendance-management',
                children: [
                    {
                        path: 'week-off-leave-grid',
                        element: <WeekOffLeavesGrid scopes={[]} />
                    },

                    {
                        path: 'week-off-leave-form',
                        element: <WeekOffLeavesForm closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllWeekOffLeaves={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'attendance-adjustment',
                        // element: <AttendanceAdjustment applyForLeavesData={undefined} updateDetails={function (hrms: ApplyForLeaveDto): void {
                        //     throw new Error("Function not implemented.");
                        // }} isUpdate={false} closeForm={function (): void {
                        //     throw new Error("Function not implemented.");
                        // }} />
                        element: <AttendanceTabs />

                    },
                    {
                        path: 'attendance-adjustment-bulk',
                        element: <AttendanceAdjustmentForBulk PropsScopes={[]} />
                    },
                    {
                        path: 'attendance-aprroval',
                        element: <BulkAttendanceApproval scopes={[]} />
                    },
                    {
                        path: 'apply-co-od-upload-view',
                        element: <ApplyForOdCoView scopes={[]} />
                    },
                    {
                        path: 'ot-approval',
                        element: <BulkOtApproval scopes={[]} />
                    },
                    {
                        path: 'ot-approved',
                        element: <OtApprovedView scopes={[]} />
                    },
                ]
            },
            {
                path: '/leave-management',
                children: [
                    // {
                    //     path: 'attedance-report',
                    //     element: <AttendanceReport />
                    // },
                    {
                        path: 'leave-allocation',
                        element: <AllocationTabs />
                    },
                    {
                        path: 'leave-allocation-view',
                        element: <LeaveAllocationView scopes={[]} />
                    },
                    {
                        path: 'absent-report',
                        element: <AbsentReport />
                    },
                    {
                        path: 'leave-balance-report',
                        element: <LeaveBalanceReport />
                    },
                    {
                        path: 'apply-for-leaves-excel-upload',
                        element: <ApplyForLeavesExcelUpload />
                    },
                    {
                        path: 'approve-leaves',
                        element: <LeavesApprovalGrid scopes={[]} />
                    },
                    {
                        path: 'apply-for-leaves-mannual-form',
                        element: <ApplyForLeavesManualForm applyForLeavesData={undefined} isUpdate={undefined} />
                    },

                    {
                        path: 'team-calender',
                        element: <TeamCalenderView />
                    },
                    {
                        path: 'team-calender-form',
                        element: <TeamCalenderForm teamCalenderData={undefined} updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllTeamCal={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    // {
                    //     path: 'apply-co-od-upload-view',
                    //     element: <ApplyForOdCoView />
                    // },
                    {
                        path: 'apply-co-od-upload-form',
                        element: <ApplyForOdCoForm data={undefined} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'shift-mapping',
                        element: <EmployeeShiftMapping />
                    },

                    {
                        path: 'shift-change',
                        element: <ShiftChangeReq />
                    },

                    {
                        path: 'shift-change-view',
                        element: <ShiftChangeView />
                    },
                    // {
                    //     path: 'attendance-adjustment',
                    //     // element: <AttendanceAdjustment applyForLeavesData={undefined} updateDetails={function (hrms: ApplyForLeaveDto): void {
                    //     //     throw new Error("Function not implemented.");
                    //     // }} isUpdate={false} closeForm={function (): void {
                    //     //     throw new Error("Function not implemented.");
                    //     // }} />
                    //     element: <AttendanceTabs />

                    // },
                    // {
                    //     path: 'attendance-adjustment-bulk',
                    //     element: <AttendanceAdjustmentForBulk />
                    // },
                    // {
                    //     path: 'attendance-aprroval',
                    //     element: <BulkAttendanceApproval />
                    // },
                    // {
                    //     path: 'attendance-adjustment-approval',
                    //     element: <AttendanceAdjustmentApproval />
                    // },
                    {
                        path: 'leave-adjustment-form',
                        element: <LeaveAdjustmentForm />
                    },
                    {
                        path: 'leave-adjustment-view',
                        element: <LeaveAdjustmentGrid />
                    },
                    {
                        path: 'leave-policy-configuration',
                        element: <LeavePolicyMain />
                    },
                    {
                        path: 'leave-policy',
                        element: <LeavePolicyView scopes={[]} />
                    },
                    {
                        path: 'leave-mapping',
                        element: <LeaveMappingView />
                    },
                    {
                        path: 'leave-mapping-form',
                        element: <LeaveMapping />
                    },
                    {
                        path: 'leave-applicability',
                        element: <LeaveApplicabilityGrid scopes={[]} />
                    },
                    {
                        path: 'leave-Groups',
                        element: <LeaveGroupsGrid scopes={[]} />
                    },
                    {
                        path: 'leave-Groups-form',
                        element: <LeaveGroupsForm updateDetails={function (style: any): void {
                            throw new Error("Function not implemented.");
                        }} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} getAllLeaveGroups={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },

                ]

            },
            {
                path: '/reports',
                children: [
                    {
                        path: 'attedance-report',
                        element: <AttendanceReport />
                    },
                    {
                        path: 'RM-un-assigned-emp-report',
                        element: <EmployeeRMUnAssignedReport scopes={[]} />
                    },
                    {
                        path: 'singlepunch-attendance-report',
                        element: <SinglePunchAttandenceReport />
                    },
                    // {
                    //     path: 'working-hours',
                    //     element: <WorkingHoursReports />
                    // },
                    // {
                    //     path: 'working-hours',
                    //     element: <EmpAllWorkingHrsReport />
                    // },

                    {
                        path: 'late-minutes-report',
                        element: <LateMinutesReport />
                    },
                    {
                        path: 'Week-wise-employee-report',
                        element: <WeekWiseEmpReport />
                    },


                    {

                        path: 'ot-approval-report',
                        element: <OtApprovalReport />
                    },
                    {
                        path: 'leave-history-report',
                        element: <LeaveHistoryReport />
                    },
                    {
                        path: 'absent-report',
                        element: <AbsentReport />
                    },
                    {
                        path: 'leave-balance-report',
                        element: <LeaveBalanceReport />
                    },
                    {
                        path: 'extra-work-hours',
                        element: <ExtraWorkHours />
                    },
                    {
                        path: 'employee-attendance-scorecard',
                        element: <EmpAttendenceScoreCard />
                    },
                    {
                        path: 'attendance-modifications-report',
                        element: <AttendanceCompilanceAuditLogs />
                    },
                    {
                        path: 'month-wise-employee-report',
                        element: <MonthWiseEmpReport />
                    },
                    {
                        path: 'attendance-mislenious-report',
                        element: <MisleniousAttendanceReport />
                    },
                    {
                        path: 'apply-for-leaves-grid',
                        element: <ApplyForLeavesGrid />
                    },
                    {
                        path: 'payroll-log-report',
                        element: <PayrollEmployeeReports />
                    },
                    {
                        path: 'bank-payment-report',
                        element: <BankPaymentReport />
                    },

                    {
                        path: 'reference-employees-report',
                        element: <ReferenceBasedEmployeeReport />
                    },

                    {
                        path: 'leave-collision-report',
                        element: <LeaveCollisionReport />
                    },
                    {
                        path: 'employee-pf-esi-report',
                        element: <EmployeePfAndEsiReport />
                    },

                    {
                        path: 'branch-wise-employee-track',
                        element: <BranchWiseEmployeeTrack />
                    },

                ]
            },
            {
                path: '/self-service-portal',
                children: [

                    {
                        path: 'working-hours',
                        element: <WorkingHoursReports />
                    },
                    {
                        path: 'leave-balance-history',
                        element: <LeaveBalanceHistory />
                    },
                    {
                        path: 'self-leave-apply-form',
                        element: <SelfLeaveApplyForm applyForLeavesData={undefined} leaveAllocations={undefined} />
                    },
                    {
                        path: 'self-service-view-attedance',
                        element: <SelfServiceViewAttedance />
                    },
                    {
                        path: 'shift-change-request',
                        element: <EmployeeShiftChangeReq />
                    },
                    {
                        path: "self-attendance-adjustment",
                        element: <SelfAttendanceAdjustment Data={undefined} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: "personal-infromation-management-view",
                        element: <PersonalInfromationManagementView />
                    },
                    {
                        path: "pay-slip-view",
                        element: <PayslipView />
                    },
                    {
                        path: "absent-report-rm",
                        element: <AbsentReportForRM scopes={[]} />
                    }


                ]
            },
            {
                path: '/employee-directory',
                children: [
                    {
                        path: 'employee-id-proofs',
                        element: <EmployeeIdProofView />
                    }
                ]
            },
            {
                path: '/payroll-management',
                children: [
                    {
                        path: 'payroll-component-wise-report',
                        element: <PayrollComponentWIseReport />
                    },
                    {
                        path: 'payroll-types-form',
                        element: <PayrollTypesForm payrollTypesData={undefined} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'payroll-types-view',
                        element: <PayrollTypesGrid scopes={[]} />
                    },
                    {
                        path: 'payroll-type-components-mapping',
                        element: <PayrollTypeComponentsMapping />
                    },
                    {
                        path: 'payroll-components-form',
                        element: <PayrollComponentsForm closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    },
                    {
                        path: 'payroll-components-grid',
                        element: <PayrollComponentsGrid scopes={[]} />
                    },
                    {
                        path: 'employee-payroll-components',
                        element: <EmployeePayrollComponent />
                    },
                    {
                        path: 'day-wise-pay-upload',
                        element: <DayWisePayUpload />
                    },
                    {
                        path: 'payroll-processed-log-report',
                        element: <PayrollProcessedLogReport branchId={0} payrollMonth={undefined} employeeTypeId={0} divisionId={[]} />
                    },
                    {
                        path: 'hod-approval-screen',
                        element: <CarryForwardHodApproval />
                    },
                    {
                        path: 'employee-non-recurring',
                        element: <EmployeeNonRecurringForm />
                    },
                    {
                        path: 'employee-non-recurring-report',
                        element: <EmployeeNonRecurringView />
                    },
                    {
                        path: 'payroll-headcount-report',
                        element: <PayrollHeadcountReport />
                    },
                    {
                        path: 'payroll-headwise-report',
                        element: <PayrollHeadWiseReport />
                    },
                    {
                        path: 'payroll-emp-recurring-component',
                        element: <EmpRecComponentTabs />
                    },
                    {
                        path: 'generate-payroll',
                        element: <PayrollGeneration />
                    },
                    {
                        path: 'payslip-generation',
                        element: <PayslipGeneration />
                    },
                    {
                        path: 'payroll-emp-loan-salary',
                        element: <EmployeeLoanGrid />
                    },
                    {
                        path: 'bank-reconciliation-report',
                        element: <BankReconciliation />
                    },
                    {
                        path: 'cash-reconciliation-report',
                        element: <CashReconciliation />
                    },
                    {
                        path: 'mess-extradays-upload',
                        element: <MessExtraDaysUpload />
                    },
                    {
                        path: 'payroll-checklist',
                        element: <PayrollCheckList />
                    },
                ]
            },
            {
                path: '/employee-forms',
                children: [
                    {
                        path: 'forms',
                        element: <Forms />
                    },
                    {
                        path: 'tour-intimation',
                        element: <TourIntimationForm />
                    },
                    {
                        path: 'tour-intimation-users',
                        element: <TourIntimationView />
                    },
                    {
                        path: 'Employee-joining-Form',
                        element: <EmployeeJoiningData />
                    },
                    {
                        path: 'Final-Settlement-Data',
                        element: <FinalSettlementData />
                    },
                    {
                        path: 'Employee-Exit-Document',
                        element: <EmployeeExitDocumentData />
                    },
                    {
                        path: 'employee-offer-letter',
                        element: <SampleOfferLetterForm />
                    },
                ]
            },


        ],

    },
    {
        path: '/login',
        element: <Login />
    }

])

export const ssprouter = createHashRouter([
    {
        path: '/',
        element: <ProtectedRoute element={<SelfServicePortalMainLayout />} />,
        children: [
            {
                path: '/',
                element: <EmployeeDashboard />
            },
            {
                path: '/self-service-portal',
                children: [
                    {
                        path: 'working-hours',
                        element: <WorkingHoursReports />
                    },
                    {
                        path: 'leave-balance-history',
                        element: <LeaveBalanceHistory />
                    },
                    {
                        path: 'self-leave-apply-form',
                        element: <SelfLeaveApplyForm applyForLeavesData={undefined} leaveAllocations={undefined} />
                    },
                    {
                        path: 'self-service-view-attedance',
                        element: <SelfServiceViewAttedance />
                    },
                    {
                        path: 'shift-change-request',
                        element: <EmployeeShiftChangeReq />
                    },
                    {
                        path: "self-attendance-adjustment",
                        element: <SelfAttendanceAdjustment Data={undefined} isUpdate={false} closeForm={function (): void {
                            throw new Error("Function not implemented.");
                        }} />
                    }
                ]
            },

        ],

    },
    {
        path: '/login',
        element: <Login />
    }

])