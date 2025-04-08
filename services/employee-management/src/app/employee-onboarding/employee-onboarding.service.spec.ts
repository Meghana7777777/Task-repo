import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeOnboardingService } from './employee-onboarding.service';

describe('EmployeeOnboardingService', () => {
  let service: EmployeeOnboardingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeOnboardingService],
    }).compile();

    service = module.get<EmployeeOnboardingService>(EmployeeOnboardingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
