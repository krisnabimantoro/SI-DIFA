import { Test, TestingModule } from '@nestjs/testing';
import { PresensiIbkController } from './presensi-ibk.controller';
import { PresensiIbkService } from './presensi-ibk.service';

describe('PresensiIbkController', () => {
  let controller: PresensiIbkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresensiIbkController],
      providers: [PresensiIbkService],
    }).compile();

    controller = module.get<PresensiIbkController>(PresensiIbkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
