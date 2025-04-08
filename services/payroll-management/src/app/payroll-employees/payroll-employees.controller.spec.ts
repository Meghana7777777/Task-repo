import { Test, TestingModule } from '@nestjs/testing';
import { PayrollEmployeesController } from './payroll-employees.controller';
describe('PayrollEmployeesController', () => {
  let controller: PayrollEmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollEmployeesController],
    }).compile();

    controller = module.get<PayrollEmployeesController>(PayrollEmployeesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
