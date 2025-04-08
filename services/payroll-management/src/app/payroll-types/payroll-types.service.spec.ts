import { Test, TestingModule } from '@nestjs/testing';
import { PayrollTypesService } from '../../../../payroll-management/src/app/payroll-types/payroll-types.service';

describe('PayrollTypesService', () => {
  let service: PayrollTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollTypesService],
    }).compile();

    service = module.get<PayrollTypesService>(PayrollTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
