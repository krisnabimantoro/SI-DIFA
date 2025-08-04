import { Test, TestingModule } from '@nestjs/testing';
import { JadwalPosyanduController } from './jadwal-posyandu.controller';
import { JadwalPosyanduService } from './jadwal-posyandu.service';

describe('JadwalPosyanduController', () => {
  let controller: JadwalPosyanduController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JadwalPosyanduController],
      providers: [JadwalPosyanduService],
    }).compile();

    controller = module.get<JadwalPosyanduController>(JadwalPosyanduController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
