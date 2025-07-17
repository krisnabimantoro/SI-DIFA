import { Test, TestingModule } from '@nestjs/testing';
import { PosyanduService } from './posyandu.service';

describe('PosyanduService', () => {
  let service: PosyanduService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosyanduService],
    }).compile();

    service = module.get<PosyanduService>(PosyanduService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
