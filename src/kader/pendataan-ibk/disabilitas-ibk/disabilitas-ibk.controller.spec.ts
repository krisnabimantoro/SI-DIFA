import { Test, TestingModule } from '@nestjs/testing';
import { DisabilitasIbkController } from './disabilitas-ibk.controller';
import { DisabilitasIbkService } from './disabilitas-ibk.service';

describe('DisabilitasIbkController', () => {
  let controller: DisabilitasIbkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisabilitasIbkController],
      providers: [DisabilitasIbkService],
    }).compile();

    controller = module.get<DisabilitasIbkController>(DisabilitasIbkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
