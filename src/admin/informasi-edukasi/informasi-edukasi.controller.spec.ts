import { Test, TestingModule } from '@nestjs/testing';
import { InformasiEdukasiController } from './informasi-edukasi.controller';

describe('InformasiEdukasiController', () => {
  let controller: InformasiEdukasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformasiEdukasiController],
    }).compile();

    controller = module.get<InformasiEdukasiController>(InformasiEdukasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
