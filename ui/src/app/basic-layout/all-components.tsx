


import ExpensesForm from "../modules/accounts/expenses/expenses_form";
import ExpensesView from "../modules/accounts/expenses/expenses_view";
import UnderConstruction from "../modules/dashboards/components/under-construction";
import EmployeeDashboard from "../modules/employee-dashboard/employee-dashboard";
import TicketsView from "../modules/employee-dashboard/tickets/tickets-view";
import EmployeeExitDocumentData from "../modules/employee-froms/employee-exit-document-data";
import EmployeeJoiningData from "../modules/employee-froms/employee-joinig-data";
import SampleOfferLetterForm from "../modules/employee-froms/Sample-Offer-Letter-form";
import FinalSettlementData from "../modules/employee-froms/statutory-handovers/Final-settelMent-data";
import Forms from "../modules/employee-froms/statutory-handovers/forms";
import TourClaimDetailsForm from "../modules/employee-froms/statutory-handovers/tour-intimation/tour-claim-details-form";
import TourClaimView from "../modules/employee-froms/statutory-handovers/tour-intimation/tour-claim-view";
import TourIntimationDetails from "../modules/employee-froms/statutory-handovers/tour-intimation/tour-intimation-details";
import TourIntimationForm from "../modules/employee-froms/statutory-handovers/tour-intimation/tour-intimation-form";
import TourIntimationView from "../modules/employee-froms/statutory-handovers/tour-intimation/tour-intimation-view";
import AddAssetMapping from "../modules/employee-management/employee-onboard/components/asset-mapping/asset-mapping-form";
import ViewAssetMapping from "../modules/employee-management/employee-onboard/components/asset-mapping/asset-mapping-view";
import CaderBudget from "../modules/employee-management/employee-onboard/components/employee-budget/caderBudget";
import EmpHistory from "../modules/employee-management/employee-onboard/components/employee-history/emp-history";
import EmployeeDetailsReport from "../modules/employee-management/employee-onboard/components/employee-reports/emp-details-report";
import EmployeeSettings from "../modules/employee-management/employee-onboard/components/employee-settings.tsx/employee-settings";
import BulkOtApproval from "../modules/employee-management/employee-onboard/components/ot-approval/bulk-ot-approval";
import OtApprovedView from "../modules/employee-management/employee-onboard/components/ot-approval/ot-approved-view";
import MemoForm from "../modules/employee-management/employee-onboard/components/performance-management/memo-form";
import MemoView from "../modules/employee-management/employee-onboard/components/performance-management/memo-view";
import PerformanceDashBoard from "../modules/employee-management/employee-onboard/components/performance-management/perform-dashboard";
import PerformanceManagementGrid from "../modules/employee-management/employee-onboard/components/performance-management/perform-grid";
import PerformanceRMWiseReport from "../modules/employee-management/employee-onboard/components/performance-management/rm-wise-report";
import EmployeeFormConfig from "../modules/employee-management/employee-onboard/pages/employee-configuration/employee-configuration";
import EmployeeIdProofView from "../modules/employee-management/employee-onboard/pages/employee-directory-view/employee-id-proof-view";
import EmployeeForm from "../modules/employee-management/employee-onboard/pages/employee-form/employee-form";
import EmployeeLogs from "../modules/employee-management/employee-onboard/pages/employee-logs/employee-logs";
import EmployeeRMUnAssignedReport from "../modules/employee-management/employee-onboard/pages/employee-rm-report/employee-rm-report";
import EmployeeRMUpdate from "../modules/employee-management/employee-onboard/pages/employee-rm-update.tsx/employee-rm-update";
import EmpResignationView from "../modules/employee-management/employee-onboard/pages/employee-view/employee-resignation-view";
import EmployeeView from "../modules/employee-management/employee-onboard/pages/employee-view/employee-view";
import ApplyForOdCoView from "../modules/leave-management/apply-co-od-upload-grid/apply-co-od-upload-view";
import ApplyForLeavesExcelUpload from "../modules/leave-management/apply-for-leaves/apply-for-leave-form/apply-for-leaves-form";
import { ApplyForLeavesManualForm } from "../modules/leave-management/apply-for-leaves/apply-for-leave-form/apply-for-leaves-mannual-form";
import ExceededLeavesGrid from "../modules/leave-management/apply-for-leaves/apply-for-leave-form/exceeded-leaves-grid";
import ApplyForLeavesGrid from "../modules/leave-management/apply-for-leaves/apply-for-leaves-grid/apply-for-leaves-grid";
import LeavesApprovalGrid from "../modules/leave-management/apply-for-leaves/apply-for-leaves-grid/leave-approvals-grid";
import AttendanceTabs from "../modules/leave-management/attendance-adjustment/attendance-adjustment-main";
import AttendanceEmployeeInfo from "../modules/leave-management/attendance-adjustment/attendance-employee-info";
import AttendanceInfo from "../modules/leave-management/attendance-adjustment/attendance-info";
import AttendanceWorkerInfo from "../modules/leave-management/attendance-adjustment/attendance-worker-info";
import BulkAttendanceApproval from "../modules/leave-management/attendance-adjustment/bulk-manuall-attendance-approval";
import LateMinMomentRecords from "../modules/leave-management/late-min-moment-records/late-min-moment-rec";
import LeaveAdjustmentForm from "../modules/leave-management/leave-adjustmnet/leave-adjustment-form";
import AllocationTabs from "../modules/leave-management/leave-allocation-form/allocation-tabs";
import LeaveApplicabilityGrid from "../modules/leave-management/leave-applicability/leave-applicability-grid";
import LeaveApplyApprovalGrid from "../modules/leave-management/leave-balance-new/leave-apply-approval-grid";
import { LeavesApplyManualForm } from "../modules/leave-management/leave-balance-new/leave-apply-form";
import { ApplyForLeavesManualFormWorkers } from "../modules/leave-management/leave-balance-new/leave-apply-worker-form";
import LeaveBalanceEmployeeView from "../modules/leave-management/leave-balance-new/leave-balance-employee-view";
import LeaveBalanceWorkerView from "../modules/leave-management/leave-balance-new/leave-balance-workers-view";
import LeaveMapping from "../modules/leave-management/leave-policy/leave-mapping";
import LeaveMappingView from "../modules/leave-management/leave-policy/leave-mapping-grid";
import LeavePolicyMain from "../modules/leave-management/leave-policy/leave-policy-conifgurations";
import LeavePolicyView from "../modules/leave-management/leave-policy/leave-policy-view";
import ApprovalScreen from "../modules/leave-management/meeting-room/approval-Screen/approval-screen";
import LandingPage from "../modules/leave-management/meeting-room/dashboards/landing-page/landing-page";
import MeetingRoomScheduleView from "../modules/leave-management/meeting-room/meeting room schedule/meeting-room-schedule-view";
import MeetingRoomCardView from "../modules/leave-management/meeting-room/meeting-room-master/meetingRoomCardView";
import MeetingRoomGrid from "../modules/leave-management/meeting-room/meeting-room-master/meetingRoomgridView";
import AttendanceReport from "../modules/leave-management/reports/attedance-report";
import AttendanceCompilanceAuditLogs from "../modules/leave-management/reports/attendance-audit-logs-report";
import MisleniousAttendanceReport from "../modules/leave-management/reports/attn-mislenious-report";
import AttritionAnalysisReport from "../modules/leave-management/reports/attrition-anaalysis-report";
import DeptWiseEmpStrengthReport from "../modules/leave-management/reports/dept-wise-emp-strength";
import DeptWiseWorkerStrengthReport from "../modules/leave-management/reports/dept-wise-worker-strength";
import EmployeeMisReport from "../modules/leave-management/reports/emp-mis-report";
import EmpAssetMappingMisReport from "../modules/leave-management/reports/employee-asset-mapping-report";
import EmpAttendenceScoreCard from "../modules/leave-management/reports/employee-attendance-scorecard";
import EmpAllWorkingHrsReport from "../modules/leave-management/reports/employee-console-working";
import EmployeePfAndEsiReport from "../modules/leave-management/reports/employee-pf-esi-report";
import BranchWiseEmployeeTrack from "../modules/leave-management/reports/employee-track-report";
import EntrollStatusReport from "../modules/leave-management/reports/entroll-status-report";
import ExpensesMisReport from "../modules/leave-management/reports/expenses-mis-report";
import ExtraWorkHours from "../modules/leave-management/reports/extra-work-hours";
import LateMinutescalculationInterface from "../modules/leave-management/reports/late-minutes-cal-interface";
import LateMinutesReport from "../modules/leave-management/reports/late-minuts-report";
import LeaveAllocationsMonthlyReport from "../modules/leave-management/reports/Leave-Allocations-Monthly-Report";
import LeaveBalanceHistory from "../modules/leave-management/reports/leave-balance-history";
import LeaveBalanceReport from "../modules/leave-management/reports/leave-balanced-report";
import LeaveCollisionReport from "../modules/leave-management/reports/leave-collision-report";
import MonthWiseEmpReport from "../modules/leave-management/reports/month-wise-employee-report";
import AttendanceMisReport from "../modules/leave-management/reports/monthly-attendance-mis";
import MonthlyAttritionReport from "../modules/leave-management/reports/monthly-attrition";
import MonthlyPayrollPlanReport from "../modules/leave-management/reports/monthly-payroll-plan";
import MonthlySalariesSummaryReport from "../modules/leave-management/reports/monthly-salaries-report";
import WorkerAttendanceMisReport from "../modules/leave-management/reports/monthly-worker-attendance-mis";
import PayBankCashMisReport from "../modules/leave-management/reports/pay-bank-cash-mis-report";
import ReferenceBasedEmployeeReport from "../modules/leave-management/reports/referance-basedemployee-report";
import SinglePunchAttandenceReport from "../modules/leave-management/reports/singngle-punch-attandence-report";
import WeekWiseEmpReport from "../modules/leave-management/reports/weekly-employee-report";
import WorkerMisReport from "../modules/leave-management/reports/worker-mis-report";
import BranchWiseWorkerTrack from "../modules/leave-management/reports/worker-track-report";
import WorkingHoursReports from "../modules/leave-management/reports/working-hours-report";
import AttendanceApprovalByRm from "../modules/leave-management/self-attendance-adjustment/attendance-adjustment-approval";
import SelfAttendanceAdjustment from "../modules/leave-management/self-attendance-adjustment/self-attendance-adjustment-form";
import LeaveApplyApprovalGridByRm from "../modules/leave-management/self-service-leave-apply/leave-approval-self-grid";
import { SelfLeaveApplyForm } from "../modules/leave-management/self-service-leave-apply/self-leave-apply-form";
import SelfServiceViewAttedance from "../modules/leave-management/self-service-view-attedance/self-service-view-attedance";
import EmployeeShiftChangeReq from "../modules/leave-management/shift-change-request/shift-change-request";
import TrainingApprovalScreen from "../modules/leave-management/training-room/approval-Screen/approval-screen";
import TrainingLandingPage from "../modules/leave-management/training-room/dashboards/landing-page/landing-page";
import TrainingGrid from "../modules/leave-management/training-room/meeting-room-master/training-center-grid-view";
import TrainingScheduleView from "../modules/leave-management/training-room/training center schedule/training-center-schedule-view";
import OverTimeGrid from "../modules/masters/pages/apply-ot-grid/apply-ot-grid";
import AddAsset from "../modules/masters/pages/asset/add-asset";
import ViewAsset from "../modules/masters/pages/asset/view-asset";
import AttendanceDeviceGrid from "../modules/masters/pages/attendance-device-grid/attendance-device-grid";
import AttendanceStatusView from "../modules/masters/pages/attendance-status-view/attendance-status-view";
import BranchMappingGrid from "../modules/masters/pages/branches-mapping-grid/branches-mapping-grid";
import BranchView from "../modules/masters/pages/branchs-view/branches-view";
import CompanyForm from "../modules/masters/pages/company-master-form/company-form";
import CompanyGrid from "../modules/masters/pages/company-master-grid/company-grid";
import DepartmentsGrid from "../modules/masters/pages/departments-grid/departments-grid";
import DesignationsGrid from "../modules/masters/pages/designations-grid/designations-grid";
import DivisionGrid from "../modules/masters/pages/division-grid/division-grid";
import AddDocumentType from "../modules/masters/pages/document-type/add-document-type";
import ViewDocumentType from "../modules/masters/pages/document-type/view-document-type";
import DomainAdd from "../modules/masters/pages/domain/add-domain";
import DomainView from "../modules/masters/pages/domain/view-domain";
import EmployeeTypeView from "../modules/masters/pages/employee-type/employee-type-grid";
import AddExpensesAgainst from "../modules/masters/pages/expenses-against/expenses-against-form";
import ViewExpensesAgainst from "../modules/masters/pages/expenses-against/expenses-against-grid";
import AddExpensesType from "../modules/masters/pages/expenses-type/add-expensesType";
import ViewExpensesType from "../modules/masters/pages/expenses-type/view-expensesType";
import HolidayView from "../modules/masters/pages/holiday-view/holiday-view";
import IdProofView from "../modules/masters/pages/id-proof/id-proof-grid";
import JobRateGrid from "../modules/masters/pages/job-rates/job-rates-grid";
import JobsGrid from "../modules/masters/pages/jobs/jobs-grid";
import KnowledgeRepositoryView from "../modules/masters/pages/KnowledgeRepository/knowledge-repository-view";
import KnowlegdeRepositoryForm from "../modules/masters/pages/KnowledgeRepository/knowlegde-repository-form";
import LeaveGroupMasterGrid from "../modules/masters/pages/leave-group-master-new/leave-group-master-grid";
import LeaveCodeGeneration from "../modules/masters/pages/leave-master/leave-code-generation";
import LeaveGroupCodeGrid from "../modules/masters/pages/leave-master/leave-group-code-map-grid";
import LeaveGroupCodeView from "../modules/masters/pages/leave-master/leave-group-code-view";
import LeaveMasterGrid from "../modules/masters/pages/leave-master/leave-master-grid";
import LeaveTypeGrid from "../modules/masters/pages/leave-type-master/leave-type-master-grid";
import QualificationsGrid from "../modules/masters/pages/qualifications-grid/qualifications-grid";
import RelationsGrid from "../modules/masters/pages/relation-grid/relations-grid";
import ShiftView from "../modules/masters/pages/shift-view/shift-view";
import SkillsGrid from "../modules/masters/pages/skills-grid/skills-grid";
import SpecializationsForm from "../modules/masters/pages/specializations/specializations-form";
import SpecializationsView from "../modules/masters/pages/specializations/specializations-view";
import TypesOfLeavesGrid from "../modules/masters/pages/types-off-leaves-grid/types-off-leaves-grid";
import WeekOffLeavesGrid from "../modules/masters/pages/week-off-leaves-grid/week-off-leaves-grid";
import MainDashboard from "../modules/new-dashboards/main-dashboard";
import ReportingManagerWiseAttn from "../modules/new-dashboards/reporting-manager-wise-attendance";
import CodeBranchEmpTypeGrid from "../modules/payroll-management/component-names/code-branch-emptype-mapping-grid";
import ComponentNamesForm from "../modules/payroll-management/component-names/components-names-form";
import ComponentNamesGrid from "../modules/payroll-management/component-names/components-names-grid";
import PayrollCodeGeneration from "../modules/payroll-management/component-names/payroll-code-generation";
import PayrollCodeView from "../modules/payroll-management/component-names/payroll-code-view";
import DayWisePayUpload from "../modules/payroll-management/day-wise-pay/day-wise-pay-upload";
import DayWisePayExcelView from "../modules/payroll-management/day-wise-pay/day-wsie-pay-view";
import EmpLoanSalaryDetails from "../modules/payroll-management/employee-loan-salary/emp-loan-salary-details";
import EmployeeLoanGrid from "../modules/payroll-management/employee-loan-salary/emp-loan-salary-grid";
import EmployeePayrollComponent from "../modules/payroll-management/employee-payroll-components/employee-payroll-component";
import EmployeePayrollComponentLogs from "../modules/payroll-management/employee-payroll-components/employee-payroll-component-logs";
import EmpRecComponentTabs from "../modules/payroll-management/employee-reccuring-comp/emp-rec-comp-main";
import EmpPayableNonRecCompView from "../modules/payroll-management/employee-reccuring-comp/employee-non-rec-comp-view";
import MessExtraDaysUpload from "../modules/payroll-management/mess-extra-days/mess-extra-days";
import PayrollComponentsGrid from "../modules/payroll-management/payroll-components/payroll-comp-grid";
import EmpNonRecTermsLogs from "../modules/payroll-management/payroll-employee-non-recc/employee-non-rec-terms-logs";
import EmployeeNonRecurringView from "../modules/payroll-management/payroll-employee-non-recc/employee-non-rec-view";
import EmployeeNonRecurringForm from "../modules/payroll-management/payroll-employee-non-recc/employee-non-recc-form";
import CarryForwardHodApproval from "../modules/payroll-management/payroll-generation/carry-forward-hod-approval";
import PayrollCheckList from "../modules/payroll-management/payroll-generation/payroll-checklist";
import PayrollGeneration from "../modules/payroll-management/payroll-generation/payroll-generation";
import BankReconciliation from "../modules/payroll-management/payroll-reports/bank-reconilation-report";
import CashReconciliation from "../modules/payroll-management/payroll-reports/cash-reconilation-report";
import PayrollEsiReport from "../modules/payroll-management/payroll-reports/esi-report";
import PayrollComparisonReport from "../modules/payroll-management/payroll-reports/payroll-comparision-report";
import PayrollComponentWIseReport from "../modules/payroll-management/payroll-reports/payroll-component-wise-report";
import PayrollHeadcountReport from "../modules/payroll-management/payroll-reports/payroll-head-count-report";
import PayrollHeadWiseReport from "../modules/payroll-management/payroll-reports/payroll-headwise-report";
import PayrollMisEmployeeReport from "../modules/payroll-management/payroll-reports/payroll-mis-report";
import PayrollMisWorkerReport from "../modules/payroll-management/payroll-reports/payroll-mis-worker-report";
import PayrollProcessedLogReport from "../modules/payroll-management/payroll-reports/payroll-processed-log-report";
import PayrollPFReport from "../modules/payroll-management/payroll-reports/pf-report";
import PayrollTypeComponentsMapping from "../modules/payroll-management/payroll-type-components/payroll-type-components-mapping";
import PayrollTypesGrid from "../modules/payroll-management/payroll-types-grid/payroll-types-grid";
import PayslipGeneration from "../modules/payroll-management/payslip/payslip-generation";
import PayslipView from "../modules/payroll-management/payslip/payslip-view";
import ViewAssignProfile from "../modules/recruitment/assign-profile/view-assign-profile";
import RecruitmentDashboard from "../modules/recruitment/dashboard/recruitment-dashboard";
import ViewInterview from "../modules/recruitment/Interviews/view-interview";
import ViewProfile from "../modules/recruitment/profiles/view-profile";
import ProfileTrackingReport from "../modules/recruitment/reports/profile-tracking-report";
import RecruitmentTrackerReport from "../modules/recruitment/reports/recruitment-tracker-report";
import ViewRequirement from "../modules/recruitment/requirement/view-requirement";
import AbsentReportForRM from "../modules/self-service-portal/leaves-rm-employees/leaves-rm-employees";
import PayslipGenerationSelf from "../modules/self-service-portal/payslip/payslip-generation";
import { ApplicationPage } from "../modules/ums/applications";
import AttributePage from "../modules/ums/attributes/attribute-page";
import ClientToApplicationsMapping from "../modules/ums/client-applications-mapping/client-to-applications-mapping";
import MenuPage from "../modules/ums/menus/menu-page";
import ModulePage from "../modules/ums/modules/module-page";
import OrganizationPage from "../modules/ums/organizations/organization-page";
import PermissionsPage from "../modules/ums/permissions/permission-page";
import { RolePermissionsMapping } from "../modules/ums/role-permissions-mapping";
import RolesPage from "../modules/ums/roles/roles-page";
import ScopePage from "../modules/ums/scopes/scope-page";
import SubMenuPage from "../modules/ums/sub-menus/sub-menu-page";
import UnitPage from "../modules/ums/unit/unit-page";
import { UserRoleMappings } from "../modules/ums/user-role-mapping";
import UserToAttributes from "../modules/ums/user-to-attributes/user-to-attribute-page";
import UserPage from "../modules/ums/users/user-page";
export const components = {

    //DahBoard
    MainDashboard: (props) => <MainDashboard {...props} />,

    //Masters
    DepartmentsGrid: (props) => <DepartmentsGrid {...props} />,
    RelationsGrid: (props) => <RelationsGrid {...props} />,
    TypesOfLeavesGrid: (props) => <TypesOfLeavesGrid {...props} />,
    BranchView: (props) => <BranchView {...props} />,
    ShiftView: (props) => <ShiftView {...props} />,
    DesignationsGrid: (props) => <DesignationsGrid {...props} />,
    HolidayView: (props) => <HolidayView {...props} />,
    SkillsGrid: (props) => <SkillsGrid {...props} />,
    QualificationsGrid: (props) => <QualificationsGrid {...props} />,
    IdProofView: (props) => <IdProofView {...props} />,
    EmployeeTypeView: (props) => <EmployeeTypeView {...props} />,
    // WeekOffLeavesGrid:(props)=><WeekOffLeavesGrid {...props}/>,
    DivisionGrid: (props) => <DivisionGrid {...props} />,
    OverTimeGrid: (props) => <OverTimeGrid {...props} />,
    AttendanceDeviceGrid: (props) => <AttendanceDeviceGrid {...props} />,
    BranchMappingGrid: (props) => <BranchMappingGrid {...props} />,
    AttendanceStatusView: (props) => <AttendanceStatusView {...props} />,
    JobsGrid: (props) => <JobsGrid {...props} />,
    LeaveGroupsGrid: (props) => <LeaveGroupCodeView {...props} />,
    SpecializationsView: (props) => <SpecializationsView {...props} />,
    SpecializationsForm: (props) => <SpecializationsForm {...props} />,
    LeaveTypeGrid: (props) => <LeaveTypeGrid {...props} />,
    LeaveMasterGrid: (props) => <LeaveMasterGrid {...props} />,
    LeaveCodeGeneration: (props) => <LeaveCodeGeneration {...props} />,
    LeaveGroupCodeGrid: (props) => <LeaveGroupCodeGrid {...props} />,
    LeaveGroupCodeView: (props) => <LeaveGroupCodeView {...props} />,

    JobRateGrid: (props) => <JobRateGrid {...props} />,

    //Resource Management
    EmployeeForm: (props) => <EmployeeForm {...props} />,
    EmployeeView: (props) => <EmployeeView {...props} />,
    EmployeeRMUpdate: (props) => <EmployeeRMUpdate {...props} />,
    EmployeeFormConfig: (props) => <EmployeeFormConfig {...props} />,
    EmployeeSettings: (props) => <EmployeeSettings {...props} />,
    CaderBudget: (props) => <CaderBudget {...props} />,
    EmployeeResignationView: (props) => <EmpResignationView {...props} />,

    //Attendance Management
    WeekOffLeavesGrid: (props) => <WeekOffLeavesGrid {...props} />,
    AttendanceAdjustment: (props) => <AttendanceTabs {...props} />,
    AttendanceApproval: (props) => <BulkAttendanceApproval {...props} />,
    // AttendanceAdjustmentForBulk: (props) => <AttendanceAdjustmentForBulk {...props} />,
    ApplyForOdCoView: (props) => <ApplyForOdCoView  {...props} />,
    BulkOtApproval: (props) => <BulkOtApproval  {...props} />,
    OtApprovedView: (props) => <OtApprovedView  {...props} />,
    AttendanceInfo: (props) => <AttendanceInfo  {...props} />,
    AttendanceEmployeeInfo: (props) => <AttendanceEmployeeInfo  {...props} />,
    AttendanceWorkerInfo: (props) => <AttendanceWorkerInfo  {...props} />,



    //LeaveManagement
    // LeaveAllocationView: (props) => <LeaveAllocationView {...props} />,
    LeaveAllocationView: (props) => <AllocationTabs {...props} />,
    LeaveAdjustmentForm: (props) => <LeaveAdjustmentForm {...props} />,
    LeaveMapping: (props) => <LeaveMapping {...props} />,
    LeaveMappingView: (props) => <LeaveMappingView {...props} />,
    LeaveApplicabilityGrid: (props) => <LeaveApplicabilityGrid {...props} />,

    ApplyForLeavesGrid: (props) => <ApplyForLeavesGrid {...props} />,


    //ApplyForLeavesManualForm: (props) => <ApplyForLeavesManualForm {...props} />,
    ApplyForLeavesExcelUpload: (props) => <ApplyForLeavesExcelUpload {...props} />,

    //ApproveLeaves: (props) => <LeavesApprovalGrid  {...props} />,

    UpdateReportingManager: (props) => <EmployeeRMUpdate  {...props} />,
    EmployeeLogs: (props) => <EmployeeLogs  {...props} />,
    LeavePolicyMain: (props) => <LeavePolicyMain {...props} />,
    LeavePolicyView: (props) => <LeavePolicyView {...props} />,

    // new leave management
    LeaveBalanceEmployeeView: (props) => <LeaveBalanceEmployeeView {...props} />,
    LeaveBalanceWorkerView: (props) => <LeaveBalanceWorkerView {...props} />,
    ApplyForLeavesManualForm: (props) => <LeavesApplyManualForm {...props} />,
    ApplyForLeavesManualFormWorkers: (props) => <ApplyForLeavesManualFormWorkers {...props} />,
    ApproveLeaves: (props) => <LeaveApplyApprovalGrid  {...props} />,

    UnderConstruction: (props) => <UnderConstruction  {...props} />,


    //Reports
    AttendanceReport: (props) => <AttendanceReport {...props} />,
    SinglePunchAttandenceReport: (props) => <SinglePunchAttandenceReport {...props} />,
    MonthWiseEmpReport: (props) => <MonthWiseEmpReport {...props} />,
    WeekWiseEmpReport: (props) => <WeekWiseEmpReport {...props} />,
    LeaveBalanceReport: (props) => <LeaveBalanceReport {...props} />,
    LeaveAllocationsMonthlyReport: (props) => <LeaveAllocationsMonthlyReport {...props} />,
    ExtraWorkHours: (props) => <ExtraWorkHours {...props} />,
    EmpAttendenceScoreCard: (props) => <EmpAttendenceScoreCard {...props} />,
    AttendanceCompilanceAuditLogs: (props) => <AttendanceCompilanceAuditLogs {...props} />,
    EmpAllWorkingHrsReport: (props) => <EmpAllWorkingHrsReport {...props} />,
    MisleniousAttendanceReport: (props) => <MisleniousAttendanceReport {...props} />,
    LateMinutesReport: (props) => <LateMinutesReport {...props} />,
    EmployeeRMUnAssignedReport: (props) => <EmployeeRMUnAssignedReport {...props} />,
    LeaveCollisionReport: (props) => <LeaveCollisionReport {...props} />,
    EmployeePfAndEsiReport: (props) => <EmployeePfAndEsiReport {...props} />,
    ReferenceBasedEmployeeReport: (props) => <ReferenceBasedEmployeeReport {...props} />,
    BranchWiseEmployeeTrack: (props) => <BranchWiseEmployeeTrack {...props} />,
    BranchWiseWorkerTrack: (props) => <BranchWiseWorkerTrack {...props} />,

    EmployeeMisReport: (props) => <EmployeeMisReport {...props} />,
    AttendanceMisReport: (props) => <AttendanceMisReport {...props} />,
    MonthlyAttritionReport: (props) => <MonthlyAttritionReport {...props} />,
    MonthlyPayrollPlanReport: (props) => <MonthlyPayrollPlanReport {...props} />,
    WorkerMisReport: (props) => <WorkerMisReport {...props} />,
    WorkerAttendanceMisReport: (props) => <WorkerAttendanceMisReport {...props} />,

    EntrollStatusReport: (props) => <EntrollStatusReport {...props} />,
    MonthlySalariesSummaryReport: (props) => <MonthlySalariesSummaryReport {...props} />,
    AttritionAnalysisReport: (props) => <AttritionAnalysisReport {...props} />,
    ExpensesMisReport: (props) => <ExpensesMisReport {...props} />,
    PayBankCashMisReport: (props) => <PayBankCashMisReport {...props} />,

    //DEPT WISE STRENGTH
    DeptWiseEmpStrengthReport: (props) => <DeptWiseEmpStrengthReport {...props} />,
    DeptWiseWorkerStrengthReport: (props) => <DeptWiseWorkerStrengthReport {...props} />,
    //Dashboards

    //UMS
    AttributePage: (props) => <AttributePage{...props} />,
    ApplicationPage: (props) => <ApplicationPage {...props} />,
    ModulePage: (props) => <ModulePage {...props} />,
    MenuPage: (props) => <MenuPage{...props} />,
    SubMenuPage: (props) => <SubMenuPage {...props} />,
    ScopePage: (props) => <ScopePage {...props} />,
    PermissionsPage: (props) => <PermissionsPage {...props} />,
    OrganizationPage: (props) => <OrganizationPage{...props} />,

    UnitPage: (props) => <UnitPage {...props} />,
    RolesPage: (props) => <RolesPage {...props} />,
    UserPage: (props) => <UserPage {...props} />,
    UserRoleMappings: (props) => <UserRoleMappings {...props} />,
    RolePermissionsMapping: (props) => <RolePermissionsMapping {...props} />,



    ///UserPPage: (props) => <UserPPage {...props} />,
    UserToAttributes: (props) => <UserToAttributes {...props} />,
    ClientToApplicationsMapping: (props) => <ClientToApplicationsMapping {...props} />,

    // Statutory Handovers
    Forms: (props) => <Forms {...props} />,


    // Tour Management
    TourIntimationForm: (props) => <TourIntimationForm {...props} />,
    TourIntimationView: (props) => <TourIntimationView {...props} />,
    TourIntimationDetails: (props) => <TourIntimationDetails {...props} />,
    TourClaimView: (props) => <TourClaimView {...props} />,
    TourClaimDetailsForm: (props) => <TourClaimDetailsForm {...props} />,

    EmployeeJoiningData: (props) => <EmployeeJoiningData {...props} />,
    EmployeeOfferLetter: (props) => <SampleOfferLetterForm {...props} />,
    FinalSettlementData: (props) => <FinalSettlementData {...props} />,
    EmployeeExitDocumentData: (props) => <EmployeeExitDocumentData {...props} />,



    //Employee Directory
    EmployeeIdProofView: (props) => <EmployeeIdProofView {...props} />,

    //My Profile
    EmployeeDashboard: (props) => <EmployeeDashboard {...props} />,

    //Self Service Portal
    WorkingHoursReports: (props) => <WorkingHoursReports {...props} />,
    LeaveBalanceHistory: (props) => <LeaveBalanceHistory {...props} />,
    SelfLeaveApplyForm: (props) => <SelfLeaveApplyForm {...props} />,
    SelfServiceViewAttedance: (props) => <SelfServiceViewAttedance {...props} />,
    EmployeeShiftChangeReq: (props) => <EmployeeShiftChangeReq {...props} />,
    SelfAttendanceAdjustment: (props) => <SelfAttendanceAdjustment {...props} />,
    RMEmployeesReport: (props) => <AbsentReportForRM {...props} />,
    ReportingManagerWiseAttn: (props) => <ReportingManagerWiseAttn {...props} />,
    LeaveApplyApprovalGridByRm: (props) => <LeaveApplyApprovalGridByRm {...props} />,
    AttendanceApprovalByRm: (props) => <AttendanceApprovalByRm {...props} />,




    //All Tickets
    TicketsView: (props) => <TicketsView {...props} />,

    //Payroll
    PayrollTypesGrid: (props) => <PayrollTypesGrid {...props} />,
    PayrollTypeComponentsMapping: (props) => <PayrollTypeComponentsMapping {...props} />,
    PayrollComponentsGrid: (props) => <PayrollComponentsGrid {...props} />,
    PayrollComparisonReport: (props) => <PayrollComparisonReport {...props} />,
    EmpRecComponentTabs: (props) => <EmpRecComponentTabs {...props} />,
    EmployeeNonRecurringForm: (props) => <EmployeeNonRecurringForm {...props} />,
    PayrollGeneration: (props) => <PayrollGeneration {...props} />,
    EmployeePayrollComponent: (props) => <EmployeePayrollComponent {...props} />,
    DayWisePayUpload: (props) => <DayWisePayUpload {...props} />,
    PayrollProcessedLogReport: (props) => <PayrollProcessedLogReport {...props} />,
    PayrollComponentWIseReport: (props) => <PayrollComponentWIseReport {...props} />,
    EmployeeNonRecurringView: (props) => <EmployeeNonRecurringView {...props} />,
    EmployeeLoanGrid: (props) => <EmployeeLoanGrid {...props} />,
    PayslipGeneration: (props) => <PayslipGeneration {...props} />,
    PayslipView: (props) => <PayslipView {...props} />,
    PayrollHeadcountReport: (props) => <PayrollHeadcountReport {...props} />,
    BankReconciliation: (props) => <BankReconciliation {...props} />,
    CashReconciliation: (props) => <CashReconciliation {...props} />,
    MessExtraDaysUpload: (props) => <MessExtraDaysUpload {...props} />,
    EmpLoanSalaryDetails: (props) => <EmpLoanSalaryDetails {...props} />,
    EmployeePayrollComponentLogs: (props) => <EmployeePayrollComponentLogs {...props} />,
    CarryForwardHodApproval: (props) => <CarryForwardHodApproval {...props} />,
    PayrollHeadWiseReport: (props) => <PayrollHeadWiseReport {...props} />,
    PayrollCheckList: (props) => <PayrollCheckList {...props} />,
    //term logs
    EmpNonRecTermsLogs: (props) => <EmpNonRecTermsLogs {...props} />,
    EmpPayableNonRecCompView: (props) => <EmpPayableNonRecCompView {...props} />,
    DayWisePayExcelView: (props) => <DayWisePayExcelView {...props} />,
    EmployeeDetailsReport: (props) => <EmployeeDetailsReport {...props} />,
    ExceededLeavesGrid: (props) => <ExceededLeavesGrid {...props} />,
    PayslipGenerationSelf: (props) => <PayslipGenerationSelf {...props} />,



    //performance management
    MemoForm: (props) => <MemoForm {...props} />,
    MemoView: (props) => <MemoView {...props} />,
    EmpHistory: (props) => <EmpHistory {...props} />,
    // lateMinutes ui interface
    LateMinutescalculationInterface: (props) => <LateMinutescalculationInterface {...props} />,


    Employee: (props) => <EmployeeView {...props} />,
    Worker: (props) => <EmployeeView {...props} />,


    ComponentNamesForm: (props) => <ComponentNamesForm {...props} />,
    ComponentNamesGrid: (props) => <ComponentNamesGrid {...props} />,
    PayrollCodeGeneration: (props) => <PayrollCodeGeneration {...props} />,
    PayrollCodeView: (props) => <PayrollCodeView {...props} />,
    CodeBranchEmpTypeGrid: (props) => <CodeBranchEmpTypeGrid {...props} />,

    PayrollMisEmployeeReport: (props) => <PayrollMisEmployeeReport {...props} />,
    PayrollMisWorkerReport: (props) => <PayrollMisWorkerReport {...props} />,
    CompanyForm: (props) => <CompanyForm {...props} />,
    CompanyGrid: (props) => <CompanyGrid {...props} />,


    //Konowledge Repository ui

    KnowlegdeRepositoryForm: (props) => <KnowlegdeRepositoryForm {...props} />,
    KnowledgeRepositoryView: (props) => <KnowledgeRepositoryView {...props} />,

    //Expenses ui

    ExpensesForm: (props) => <ExpensesForm {...props} />,
    ExpensesView: (props) => <ExpensesView {...props} />,
    LateMinMomentRecords: (props) => <LateMinMomentRecords {...props} />,


    //Expenses Type UI

    AddExpensesType: (props) => <AddExpensesType {...props} />,
    ViewExpensesType: (props) => <ViewExpensesType {...props} />,

    //Expenses Against UI

    AddExpensesAgainst: (props) => <AddExpensesAgainst {...props} />,
    ViewExpensesAgainst: (props) => <ViewExpensesAgainst {...props} />,

    /* Meeting Rooms */
    LandingPage: (props) => <LandingPage {...props} />,
    MeetingRoomCardView: (props) => <MeetingRoomGrid {...props} />,
    MeetingRoomScheduleView: (props) => <MeetingRoomScheduleView {...props} />,
    ApprovalScreen: (props) => <ApprovalScreen {...props} />,

    /* Training Center */
    TrainingLandingPage: (props) => <TrainingLandingPage {...props} />,
    TrainingCardView: (props) => <TrainingGrid {...props} />,
    TrainingScheduleView: (props) => <TrainingScheduleView {...props} />,
    TrainingApprovalScreen: (props) => <TrainingApprovalScreen {...props} />,

    //Domain UI
    AddDomain: (props) => <DomainAdd {...props} />,
    ViewDomain: (props) => <DomainView {...props} />,
    PayrollEsiReport: (props) => <PayrollEsiReport {...props} />,
    PayrollPFReport: (props) => <PayrollPFReport {...props} />,

    //Document Type UI

    AddDocumentType: (props) => <AddDocumentType {...props} />,
    ViewDocumentType: (props) => <ViewDocumentType {...props} />,

    //Asset UI

    AddAsset: (props) => <AddAsset {...props} />,
    ViewAsset: (props) => <ViewAsset {...props} />,

    // Recruitment module
    ViewRequirement: (props) => < ViewRequirement {...props} />,
    ViewProfile: (props) => < ViewProfile {...props} />,
    ViewInterview: (props) => < ViewInterview {...props} />,
    ViewAssignProfile: (props) => < ViewAssignProfile {...props} />,
    RecruitmentTrackerReport: (props) => < RecruitmentTrackerReport {...props} />,
    ProfileTrackingReport: (props) => < ProfileTrackingReport {...props} />,
    RecruitmentDashboard: (props) => < RecruitmentDashboard {...props} />,
    
    
    // PMS
    PerformanceManagementGrid: (props) => < PerformanceManagementGrid {...props} />,
    PerformanceDashBoard: (props) => < PerformanceDashBoard {...props} />,
    PerformanceRMWiseReport: (props) => < PerformanceRMWiseReport {...props} />,


    //Asset Mapping 
    AddAssetMapping: (props) => <AddAssetMapping {...props} />,
    ViewAssetMapping: (props) => <ViewAssetMapping {...props} />,


    //mis report of assset mapping

    EmpAssetMappingMisReport: (props) => <EmpAssetMappingMisReport {...props} />,

}

