import { PaymentStatusEnum, PaymentTypeEnum } from '@hrexpert/shared-models';
import { ApiOAuth2, ApiProperty } from '@nestjs/swagger';

export class CreateExpensesDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  DateTime: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdUser: string;
  @ApiProperty()
  updatedUser: string;
  @ApiProperty()
  versionFlag: number;
  @ApiProperty()
  expensesAgainst: string;
  @ApiProperty()
  employeeName: string;
  @ApiProperty()
  branch: string;
  @ApiProperty()
  branchManager: string;
  @ApiProperty()
  expensesType: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  paymentMode: PaymentTypeEnum;
  @ApiProperty()
  referenceNo: string;
  @ApiProperty()
  paymentStatus: PaymentStatusEnum;
  @ApiProperty()
  taxApplicable: string;
  @ApiProperty()
  approvedBy: string;

  @ApiProperty()
  expensesCode: string;
  // @ApiProperty({ required: false })
  // uploadFile?: string; //
  @ApiProperty()
  remarks: string;
}
