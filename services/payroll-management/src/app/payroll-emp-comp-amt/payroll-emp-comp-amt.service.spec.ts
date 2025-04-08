import { Test, TestingModule } from '@nestjs/testing';
import { PayrollEmployeeComponentAmountsService } from '../payroll-employee-component-amounts/payroll-employee-component-amounts.service';

describe('PayrollEmployeeComponentAmountsService', () => {
  let service: PayrollEmployeeComponentAmountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollEmployeeComponentAmountsService],
    }).compile();

    service = module.get<PayrollEmployeeComponentAmountsService>(PayrollEmployeeComponentAmountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
