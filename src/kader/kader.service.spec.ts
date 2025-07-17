import { Test, TestingModule } from '@nestjs/testing';
import { KaderService } from './kader.service';

describe('KaderService', () => {
  let service: KaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KaderService],
    }).compile();

    service = module.get<KaderService>(KaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
