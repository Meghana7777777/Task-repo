import { Test, TestingModule } from '@nestjs/testing';
import { HolidayCalendarService } from './holiday_calendar.service';

describe('HolidayCalendarService', () => {
  let service: HolidayCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HolidayCalendarService],
    }).compile();

    service = module.get<HolidayCalendarService>(HolidayCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
