import { Test, TestingModule } from '@nestjs/testing';
import { PayrollComponentsService } from '../../../../payroll-management/src/app/payroll-components/payroll-components.service';

describe('PayrollComponentsService', () => {
  let service: PayrollComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollComponentsService],
    }).compile();

    service = module.get<PayrollComponentsService>(PayrollComponentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
