import { Test, TestingModule } from '@nestjs/testing';
import { JadwalPosyanduService } from './jadwal-posyandu.service';

describe('JadwalPosyanduService', () => {
  let service: JadwalPosyanduService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JadwalPosyanduService],
    }).compile();

    service = module.get<JadwalPosyanduService>(JadwalPosyanduService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
