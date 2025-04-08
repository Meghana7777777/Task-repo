import { Test, TestingModule } from '@nestjs/testing';
import { PayrollRecordsService } from '../payroll-records/payroll-records.service';

describe('PayrollRecordsService', () => {
  let service: PayrollRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollRecordsService],
    }).compile();

    service = module.get<PayrollRecordsService>(PayrollRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
