import { Test, TestingModule } from '@nestjs/testing';
import { ApplyForLeaveService } from './apply-for-leaves.service';

describe('ApplyForLeaveService', () => {
  let service: ApplyForLeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplyForLeaveService],
    }).compile();

    service = module.get<ApplyForLeaveService>(ApplyForLeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
