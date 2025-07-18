import { Test, TestingModule } from '@nestjs/testing';
import { PendataanIbkService } from './pendataan-ibk.service';

describe('PendataanIbkService', () => {
  let service: PendataanIbkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PendataanIbkService],
    }).compile();

    service = module.get<PendataanIbkService>(PendataanIbkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
