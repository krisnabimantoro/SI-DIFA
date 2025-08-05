import { Test, TestingModule } from '@nestjs/testing';
import { PresensiIbkService } from './presensi-ibk.service';

describe('PresensiIbkService', () => {
  let service: PresensiIbkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresensiIbkService],
    }).compile();

    service = module.get<PresensiIbkService>(PresensiIbkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
