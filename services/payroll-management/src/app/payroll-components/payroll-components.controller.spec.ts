import { Test, TestingModule } from '@nestjs/testing';
import { PayrollComponentsController } from '../payroll-components/payroll-components.controller';
describe('PayrollComponentsController', () => {
  let controller: PayrollComponentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollComponentsController],
    }).compile();

    controller = module.get<PayrollComponentsController>(PayrollComponentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
