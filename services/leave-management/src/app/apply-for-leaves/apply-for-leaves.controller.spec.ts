import { Test, TestingModule } from '@nestjs/testing';
import { ApplyForLeavesController } from './apply-for-leaves.controller';

describe('ApplyForLeavesController', () => {
  let controller: ApplyForLeavesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyForLeavesController],
    }).compile();

    controller = module.get<ApplyForLeavesController>(ApplyForLeavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
