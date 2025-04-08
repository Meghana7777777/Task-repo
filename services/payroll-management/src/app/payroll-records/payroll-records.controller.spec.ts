import { Test, TestingModule } from '@nestjs/testing';
import { PayrollRecordsController } from '../payroll-records/payroll-records.controller';
describe('PayrollRecordsController', () => {
  let controller: PayrollRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollRecordsController],
    }).compile();

    controller = module.get<PayrollRecordsController>(PayrollRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
