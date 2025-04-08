import { ApiProperty } from "@nestjs/swagger";

export class PayRollAttnDto {
    @ApiProperty()
    empId: number;

    @ApiProperty()
    empCode: string;

    @ApiProperty()
    presentCount: number;

    @ApiProperty()
    absentCount: number

    @ApiProperty()
    leaveCount: number

    @ApiProperty()
    coCount: number

    @ApiProperty()
    odCount: number

    @ApiProperty()
    wpCount: number

    @ApiProperty()
    woCount: number

    // @ApiProperty()
    // otHours: number
    @ApiProperty()
    splOtHours: Date

    @ApiProperty()
    holidayCount: number

    @ApiProperty()
    hpCount: number

    @ApiProperty()
    branchId: number;

    @ApiProperty()
    divisionId: number;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    attnFromDate: Date;

    @ApiProperty()
    attnToDate: Date;

    @ApiProperty()
    departmentId: number;

    @ApiProperty()
    desginationId: number;

    @ApiProperty()
    payrollMonth: string;

    @ApiProperty()
    payDays: number;

    @ApiProperty()
    allowanceDays: number;

    @ApiProperty()
    lateMinutes: number;

    @ApiProperty()
    employeeTypeId: number;

    @ApiProperty()
    bankName: string;

    @ApiProperty()
    bankAccNo: string;

    @ApiProperty()
    bankIfscCode: string;

    @ApiProperty()
    payMode: string;

    @ApiProperty()
    lateMinsDeductDays: number;
   
    @ApiProperty()
    lopCountData?: number;

    constructor(
        empId: number,
        empCode: string,
        presentCount: number = 0,
        absentCount: number = 0,
        leaveCount: number = 0,
        coCount: number = 0,
        odCount: number = 0,
        wpCount: number = 0,
        woCount: number = 0,
        // otHours: number = 0,
        splOtHours: Date,
        holidayCount: number = 0,
        hpCount: number = 0,
        branchId: number,
        divisionId: number,
        createdUser: string,
        attnFromDate: Date,
        attnToDate: Date,
        departmentId: number,
        desginationId: number,
        payrollMonth: string,
        payDays: number,
        allowanceDays: number,
        lateMinutes: number,
        employeeTypeId: number,
        bankName: string,
        bankAccNo: string,
        bankIfscCode: string,
        payMode: string,
        lateMinsDeductDays: number,
        lopCountData?: number

    ) {
        this.empId = empId;
        this.empCode = empCode;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.leaveCount = leaveCount;
        this.coCount = coCount;
        this.odCount = odCount;
        this.wpCount = wpCount;
        this.woCount = woCount;
        this.splOtHours = splOtHours;
        this.holidayCount = holidayCount;
        this.hpCount = hpCount;
        this.branchId = branchId;
        this.divisionId = divisionId;
        this.createdUser = createdUser;
        this.attnFromDate = attnFromDate;
        this.attnToDate = attnToDate;
        this.departmentId = departmentId;
        this.desginationId = desginationId;
        this.payrollMonth = payrollMonth;
        this.payDays = payDays;
        this.allowanceDays = allowanceDays;
        this.lateMinutes = lateMinutes;
        this.employeeTypeId = employeeTypeId;
        this.bankName = bankName;
        this.bankAccNo = bankAccNo;
        this.bankIfscCode = bankIfscCode;
        this.payMode = payMode;
        this.lateMinsDeductDays = lateMinsDeductDays
        this.lopCountData = lopCountData
    }
}
