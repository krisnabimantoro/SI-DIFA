import { Test, TestingModule } from '@nestjs/testing';
import { DisabilitasIbkService } from './disabilitas-ibk.service';

describe('DisabilitasIbkService', () => {
  let service: DisabilitasIbkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisabilitasIbkService],
    }).compile();

    service = module.get<DisabilitasIbkService>(DisabilitasIbkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
