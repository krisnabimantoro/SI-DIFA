import { Test, TestingModule } from '@nestjs/testing';
import { PosyanduKaderService } from './posyandu-kader.service';

describe('PosyanduKaderService', () => {
  let service: PosyanduKaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosyanduKaderService],
    }).compile();

    service = module.get<PosyanduKaderService>(PosyanduKaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
