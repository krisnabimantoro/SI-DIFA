import { Test, TestingModule } from '@nestjs/testing';
import { PresensiKaderService } from './presensi-kader.service';

describe('PresensiKaderService', () => {
  let service: PresensiKaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresensiKaderService],
    }).compile();

    service = module.get<PresensiKaderService>(PresensiKaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
