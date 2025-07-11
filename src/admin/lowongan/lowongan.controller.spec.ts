import { Test, TestingModule } from '@nestjs/testing';
import { LowonganController } from './lowongan.controller';

describe('LowonganController', () => {
  let controller: LowonganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LowonganController],
    }).compile();

    controller = module.get<LowonganController>(LowonganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
