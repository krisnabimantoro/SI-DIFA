import { Test, TestingModule } from '@nestjs/testing';
import { PosyanduController } from './posyandu.controller';

describe('PosyanduController', () => {
  let controller: PosyanduController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosyanduController],
    }).compile();

    controller = module.get<PosyanduController>(PosyanduController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
