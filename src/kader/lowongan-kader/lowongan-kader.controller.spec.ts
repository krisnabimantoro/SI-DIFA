import { Test, TestingModule } from '@nestjs/testing';
import { LowonganKaderController } from './lowongan-kader.controller';

describe('LowonganKaderController', () => {
  let controller: LowonganKaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LowonganKaderController],
    }).compile();

    controller = module.get<LowonganKaderController>(LowonganKaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
