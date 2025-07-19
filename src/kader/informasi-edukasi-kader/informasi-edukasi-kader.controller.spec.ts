import { Test, TestingModule } from '@nestjs/testing';
import { InformasiEdukasiKaderController } from './informasi-edukasi-kader.controller';

describe('InformasiEdukasiKaderController', () => {
  let controller: InformasiEdukasiKaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformasiEdukasiKaderController],
    }).compile();

    controller = module.get<InformasiEdukasiKaderController>(InformasiEdukasiKaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
