import { Test, TestingModule } from '@nestjs/testing';
import { PosyanduKaderController } from './posyandu-kader.controller';

describe('PosyanduKaderController', () => {
  let controller: PosyanduKaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosyanduKaderController],
    }).compile();

    controller = module.get<PosyanduKaderController>(PosyanduKaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
