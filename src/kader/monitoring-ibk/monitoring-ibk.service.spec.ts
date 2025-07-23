import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringIbkService } from './monitoring-ibk.service';

describe('MonitoringIbkService', () => {
  let service: MonitoringIbkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringIbkService],
    }).compile();

    service = module.get<MonitoringIbkService>(MonitoringIbkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
