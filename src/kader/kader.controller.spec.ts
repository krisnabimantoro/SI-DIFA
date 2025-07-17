import { Test, TestingModule } from '@nestjs/testing';
import { KaderController } from './kader.controller';
import { KaderService } from './kader.service';

describe('KaderController', () => {
  let controller: KaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KaderController],
      providers: [KaderService],
    }).compile();

    controller = module.get<KaderController>(KaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
