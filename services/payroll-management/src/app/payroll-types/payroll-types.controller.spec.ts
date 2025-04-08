import { Test, TestingModule } from '@nestjs/testing';
import { PayrollTypesController } from '../../../../payroll-management/src/app/payroll-types/payroll-types.controller';
describe('PayrollTypesController', () => {
  let controller: PayrollTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollTypesController],
    }).compile();

    controller = module.get<PayrollTypesController>(PayrollTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
