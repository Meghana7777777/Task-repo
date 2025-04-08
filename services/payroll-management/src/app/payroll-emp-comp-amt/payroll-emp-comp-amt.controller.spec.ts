import { Test, TestingModule } from '@nestjs/testing';
import { PayrollEmployeeComponentAmountsController } from '../payroll-employee-component-amounts/payroll-employee-component-amounts.controller';
describe('PayrollEmployeeComponentAmountsController', () => {
  let controller: PayrollEmployeeComponentAmountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollEmployeeComponentAmountsController],
    }).compile();

    controller = module.get<PayrollEmployeeComponentAmountsController>(PayrollEmployeeComponentAmountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
