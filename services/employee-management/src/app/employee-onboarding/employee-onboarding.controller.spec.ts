import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeOnboardingController } from './employee-onboarding.controller';

describe('EmployeeOnboardingController', () => {
  let controller: EmployeeOnboardingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeOnboardingController],
    }).compile();

    controller = module.get<EmployeeOnboardingController>(EmployeeOnboardingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
