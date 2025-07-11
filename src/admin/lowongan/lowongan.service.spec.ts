import { Test, TestingModule } from '@nestjs/testing';
import { LowonganService } from './lowongan.service';

describe('LowonganService', () => {
  let service: LowonganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LowonganService],
    }).compile();

    service = module.get<LowonganService>(LowonganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
