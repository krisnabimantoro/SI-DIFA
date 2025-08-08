import { Test, TestingModule } from '@nestjs/testing';
import { PresensiKaderController } from './presensi-kader.controller';
import { PresensiKaderService } from './presensi-kader.service';

describe('PresensiKaderController', () => {
  let controller: PresensiKaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresensiKaderController],
      providers: [PresensiKaderService],
    }).compile();

    controller = module.get<PresensiKaderController>(PresensiKaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
