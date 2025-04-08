import { Test, TestingModule } from '@nestjs/testing';
import { QualificationsController } from './qualifications.controller';

describe('QualificationsController', () => {
  let controller: QualificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualificationsController],
    }).compile();

    controller = module.get<QualificationsController>(QualificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
