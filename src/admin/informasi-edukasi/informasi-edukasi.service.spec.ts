import { Test, TestingModule } from '@nestjs/testing';
import { InformasiEdukasiService } from './informasi-edukasi.service';

describe('InformasiEdukasiService', () => {
  let service: InformasiEdukasiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InformasiEdukasiService],
    }).compile();

    service = module.get<InformasiEdukasiService>(InformasiEdukasiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
