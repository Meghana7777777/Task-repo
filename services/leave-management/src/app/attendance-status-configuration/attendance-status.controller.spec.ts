import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceStatusController } from './attendance-status.controller';

describe('AttendanceStatusController', () => {
  let controller: AttendanceStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceStatusController],
    }).compile();

    controller = module.get<AttendanceStatusController>(AttendanceStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
