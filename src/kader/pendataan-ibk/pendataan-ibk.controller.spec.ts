import { Test, TestingModule } from '@nestjs/testing';
import { PendataanIbkController } from './pendataan-ibk.controller';
import { PendataanIbkService } from './pendataan-ibk.service';

describe('PendataanIbkController', () => {
  let controller: PendataanIbkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PendataanIbkController],
      providers: [PendataanIbkService],
    }).compile();

    controller = module.get<PendataanIbkController>(PendataanIbkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
