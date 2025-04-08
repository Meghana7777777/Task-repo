import { Test, TestingModule } from '@nestjs/testing';
import { PayrollEmployeesService } from '../../../../payroll-management/src/app/payroll-employees/payroll-employees.service';

describe('PayrollEmployeesService', () => {
  let service: PayrollEmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollEmployeesService],
    }).compile();

    service = module.get<PayrollEmployeesService>(PayrollEmployeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
