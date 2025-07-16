import { Test, TestingModule } from '@nestjs/testing';
import { PosyanduController } from './posyandu.controller';
import { PosyanduService } from './posyandu.service';

describe('PosyanduController', () => {
  let controller: PosyanduController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosyanduController],
      providers: [PosyanduService],
    }).compile();

    controller = module.get<PosyanduController>(PosyanduController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
