import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringIbkController } from './monitoring-ibk.controller';
import { MonitoringIbkService } from './monitoring-ibk.service';

describe('MonitoringIbkController', () => {
  let controller: MonitoringIbkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringIbkController],
      providers: [MonitoringIbkService],
    }).compile();

    controller = module.get<MonitoringIbkController>(MonitoringIbkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
