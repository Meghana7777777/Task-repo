import { Test, TestingModule } from '@nestjs/testing';
import { HolidayCalendarController } from './holiday_calendar.controller';

describe('HolidayCalendarController', () => {
  let controller: HolidayCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidayCalendarController],
    }).compile();

    controller = module.get<HolidayCalendarController>(HolidayCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
