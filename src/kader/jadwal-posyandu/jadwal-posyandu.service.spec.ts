import { Test, TestingModule } from '@nestjs/testing';
import { JadwalPosyanduService } from './jadwal-posyandu.service';
import { PrismaService } from 'src/prisma.service';
import { CreateJadwalPosyanduDto } from './dto/create-jadwal-posyandu.dto';
import { UpdateJadwalPosyanduDto } from './dto/update-jadwal-posyandu.dto';

describe('JadwalPosyanduService', () => {
  let service: JadwalPosyanduService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    jadwal_posyandu: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    ibk: {
      findMany: jest.fn(),
    },
    kader_posyandu: {
      findMany: jest.fn(),
    },
    presensi_ibk: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    presensi_kader: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    monitoring_ibk: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JadwalPosyanduService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JadwalPosyanduService>(JadwalPosyanduService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create jadwal posyandu and presensi records', async () => {
      const posyanduId = 'posyandu-uuid-1';
      const createDto: CreateJadwalPosyanduDto = {
        posyandu_id: posyanduId,
        nama_kegiatan: 'Posyandu Balita',
        jenis_kegiatan: 'Pemeriksaan',
        deskripsi: 'Pemeriksaan kesehatan balita',
        lokasi: 'Balai Desa',
        tanggal: new Date('2025-12-01'),
        waktu_mulai: '08:00',
        waktu_selesai: '12:00',
        created_at: new Date(),
      };

      const mockCreatedJadwal = {
        id: 'jadwal-uuid-1',
        posyandu_id: posyanduId,
        nama_kegiatan: 'Posyandu Balita',
        created_at: new Date(),
      };

      const mockIbkUsers = [{ id: 'ibk-uuid-1' }, { id: 'ibk-uuid-2' }];

      const mockKaderUsers = [
        { user_kader_id: 'kader-uuid-1' },
        { user_kader_id: 'kader-uuid-2' },
      ];

      mockPrismaService.jadwal_posyandu.create.mockResolvedValue(
        mockCreatedJadwal,
      );
      mockPrismaService.ibk.findMany.mockResolvedValue(mockIbkUsers);
      mockPrismaService.kader_posyandu.findMany.mockResolvedValue(
        mockKaderUsers,
      );
      mockPrismaService.presensi_ibk.createMany.mockResolvedValue({ count: 2 });
      mockPrismaService.presensi_kader.createMany.mockResolvedValue({
        count: 2,
      });

      const result = await service.create(posyanduId, createDto);

      expect(result).toEqual(mockCreatedJadwal);
      expect(mockPrismaService.jadwal_posyandu.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          posyandu: {
            connect: { id: posyanduId },
          },
          nama_kegiatan: 'Posyandu Balita',
        }),
      });
      expect(mockPrismaService.ibk.findMany).toHaveBeenCalledWith({
        where: { posyanduId },
        select: { id: true },
      });
      expect(mockPrismaService.kader_posyandu.findMany).toHaveBeenCalledWith({
        where: { posyandu_id: posyanduId },
        select: { user_kader_id: true },
      });
      expect(mockPrismaService.presensi_ibk.createMany).toHaveBeenCalled();
      expect(mockPrismaService.presensi_kader.createMany).toHaveBeenCalled();
    });

    it('should create jadwal without presensi when no IBK or Kader exists', async () => {
      const posyanduId = 'posyandu-uuid-1';
      const createDto: CreateJadwalPosyanduDto = {
        posyandu_id: posyanduId,
        nama_kegiatan: 'Posyandu Balita',
        jenis_kegiatan: 'Pemeriksaan',
        deskripsi: 'Pemeriksaan kesehatan balita',
        lokasi: 'Balai Desa',
        tanggal: new Date('2025-12-01'),
        waktu_mulai: '08:00',
        waktu_selesai: '12:00',
        created_at: new Date(),
      };

      const mockCreatedJadwal = {
        id: 'jadwal-uuid-1',
        posyandu_id: posyanduId,
        nama_kegiatan: 'Posyandu Balita',
        created_at: new Date(),
      };

      mockPrismaService.jadwal_posyandu.create.mockResolvedValue(
        mockCreatedJadwal,
      );
      mockPrismaService.ibk.findMany.mockResolvedValue([]);
      mockPrismaService.kader_posyandu.findMany.mockResolvedValue([]);

      const result = await service.create(posyanduId, createDto);

      expect(result).toEqual(mockCreatedJadwal);
      expect(mockPrismaService.presensi_ibk.createMany).not.toHaveBeenCalled();
      expect(
        mockPrismaService.presensi_kader.createMany,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated jadwal posyandu data', async () => {
      const mockJadwalData = [
        {
          id: 'jadwal-uuid-1',
          nama_kegiatan: 'Posyandu Balita',
          lokasi: 'Balai Desa',
          tanggal: new Date('2025-12-01'),
          waktu_mulai: '08:00',
          waktu_selesai: '12:00',
          created_at: new Date(),
        },
        {
          id: 'jadwal-uuid-2',
          nama_kegiatan: 'Posyandu Lansia',
          lokasi: 'Balai RT 02',
          tanggal: new Date('2025-12-02'),
          waktu_mulai: '09:00',
          waktu_selesai: '11:00',
          created_at: new Date(),
        },
      ];

      mockPrismaService.jadwal_posyandu.findMany.mockResolvedValue(
        mockJadwalData,
      );
      mockPrismaService.jadwal_posyandu.count.mockResolvedValue(15);

      const result = await service.findAll({
        skip: 0,
        take: 10,
        posyanduId: 'posyandu-uuid-1',
      });

      expect(result).toEqual({
        data: mockJadwalData,
        meta: {
          totalData: 15,
          totalPage: 2,
          currentPage: 1,
          limit: 10,
        },
      });
      expect(mockPrismaService.jadwal_posyandu.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { posyandu_id: 'posyandu-uuid-1' },
        orderBy: undefined,
        select: expect.any(Object),
      });
    });

    it('should return data with default pagination', async () => {
      const mockJadwalData = [
        {
          id: 'jadwal-uuid-1',
          nama_kegiatan: 'Posyandu Balita',
          lokasi: 'Balai Desa',
          tanggal: new Date('2025-12-01'),
          waktu_mulai: '08:00',
          waktu_selesai: '12:00',
          created_at: new Date(),
        },
      ];

      mockPrismaService.jadwal_posyandu.findMany.mockResolvedValue(
        mockJadwalData,
      );
      mockPrismaService.jadwal_posyandu.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result.meta.limit).toBe(10);
      expect(result.meta.currentPage).toBe(1);
    });

    it('should calculate correct page numbers', async () => {
      mockPrismaService.jadwal_posyandu.findMany.mockResolvedValue([]);
      mockPrismaService.jadwal_posyandu.count.mockResolvedValue(25);

      const result = await service.findAll({
        skip: 10,
        take: 10,
      });

      expect(result.meta).toEqual({
        totalData: 25,
        totalPage: 3,
        currentPage: 2,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single jadwal posyandu with posyandu details', async () => {
      const mockJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Posyandu Balita',
        lokasi: 'Balai Desa',
        tanggal: new Date('2025-12-01'),
        posyandu: {
          id: 'posyandu-uuid-1',
          nama_posyandu: 'Posyandu Melati',
          alamat: 'Jl. Melati No. 10',
        },
      };

      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(
        mockJadwal,
      );

      const result = await service.findOne({ id: 'jadwal-uuid-1' });

      expect(result).toEqual(mockJadwal);
      expect(mockPrismaService.jadwal_posyandu.findUnique).toHaveBeenCalledWith(
        {
          where: { id: 'jadwal-uuid-1' },
          include: {
            posyandu: {
              select: {
                id: true,
                nama_posyandu: true,
                alamat: true,
              },
            },
          },
        },
      );
    });

    it('should return null if jadwal not found', async () => {
      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(null);

      const result = await service.findOne({ id: 'non-existent-id' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update jadwal posyandu', async () => {
      const updateDto: UpdateJadwalPosyanduDto = {
        nama_kegiatan: 'Updated Posyandu',
        lokasi: 'Updated Location',
      };

      const mockUpdatedJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Updated Posyandu',
        lokasi: 'Updated Location',
        updated_at: new Date(),
      };

      mockPrismaService.jadwal_posyandu.update.mockResolvedValue(
        mockUpdatedJadwal,
      );

      const result = await service.update({ id: 'jadwal-uuid-1' }, updateDto);

      expect(result).toEqual(mockUpdatedJadwal);
      expect(mockPrismaService.jadwal_posyandu.update).toHaveBeenCalledWith({
        where: { id: 'jadwal-uuid-1' },
        data: expect.objectContaining({
          nama_kegiatan: 'Updated Posyandu',
          lokasi: 'Updated Location',
          updated_at: expect.any(Date),
        }),
      });
    });

    it('should update jadwal with file name', async () => {
      const updateDto: UpdateJadwalPosyanduDto = {
        nama_kegiatan: 'Updated Posyandu',
      };

      const mockUpdatedJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Updated Posyandu',
        file_name: 'new-file.pdf',
        updated_at: new Date(),
      };

      mockPrismaService.jadwal_posyandu.update.mockResolvedValue(
        mockUpdatedJadwal,
      );

      const result = await service.update(
        { id: 'jadwal-uuid-1' },
        updateDto,
        'new-file.pdf',
      );

      expect(result).toEqual(mockUpdatedJadwal);
      expect(mockPrismaService.jadwal_posyandu.update).toHaveBeenCalledWith({
        where: { id: 'jadwal-uuid-1' },
        data: expect.objectContaining({
          file_name: 'new-file.pdf',
        }),
      });
    });

    it('should update with posyandu relation', async () => {
      const updateDto: UpdateJadwalPosyanduDto = {
        posyandu_id: 'new-posyandu-uuid',
        nama_kegiatan: 'Updated Posyandu',
      };

      const mockUpdatedJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Updated Posyandu',
        posyandu_id: 'new-posyandu-uuid',
      };

      mockPrismaService.jadwal_posyandu.update.mockResolvedValue(
        mockUpdatedJadwal,
      );

      await service.update({ id: 'jadwal-uuid-1' }, updateDto);

      expect(mockPrismaService.jadwal_posyandu.update).toHaveBeenCalledWith({
        where: { id: 'jadwal-uuid-1' },
        data: expect.objectContaining({
          posyandu: {
            connect: { id: 'new-posyandu-uuid' },
          },
        }),
      });
    });
  });

  describe('remove', () => {
    it('should delete jadwal posyandu and all related records', async () => {
      const mockExistingJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Posyandu Balita',
        presensi_kader: [
          { id: 'presensi-kader-1' },
          { id: 'presensi-kader-2' },
        ],
        presensi_ibk: [{ id: 'presensi-ibk-1' }],
        monitoring_ibk: [{ id: 'monitoring-1' }],
      };

      const mockDeletedJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Posyandu Balita',
      };

      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(
        mockExistingJadwal,
      );
      mockPrismaService.presensi_kader.deleteMany.mockResolvedValue({
        count: 2,
      });
      mockPrismaService.presensi_ibk.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.monitoring_ibk.deleteMany.mockResolvedValue({
        count: 1,
      });
      mockPrismaService.jadwal_posyandu.delete.mockResolvedValue(
        mockDeletedJadwal,
      );

      const result = await service.remove({ id: 'jadwal-uuid-1' });

      expect(result).toEqual(mockDeletedJadwal);
      expect(mockPrismaService.jadwal_posyandu.findUnique).toHaveBeenCalledWith(
        {
          where: { id: 'jadwal-uuid-1' },
          include: {
            presensi_kader: true,
            presensi_ibk: true,
            monitoring_ibk: true,
          },
        },
      );
      expect(mockPrismaService.presensi_kader.deleteMany).toHaveBeenCalledWith({
        where: { jadwal_id: 'jadwal-uuid-1' },
      });
      expect(mockPrismaService.presensi_ibk.deleteMany).toHaveBeenCalledWith({
        where: { jadwal_id: 'jadwal-uuid-1' },
      });
      expect(mockPrismaService.monitoring_ibk.deleteMany).toHaveBeenCalledWith({
        where: { jadwal_posyandu_id: 'jadwal-uuid-1' },
      });
      expect(mockPrismaService.jadwal_posyandu.delete).toHaveBeenCalledWith({
        where: { id: 'jadwal-uuid-1' },
      });
    });

    it('should delete jadwal without related records', async () => {
      const mockExistingJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Posyandu Balita',
        presensi_kader: [],
        presensi_ibk: [],
        monitoring_ibk: [],
      };

      const mockDeletedJadwal = {
        id: 'jadwal-uuid-1',
        nama_kegiatan: 'Posyandu Balita',
      };

      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(
        mockExistingJadwal,
      );
      mockPrismaService.jadwal_posyandu.delete.mockResolvedValue(
        mockDeletedJadwal,
      );

      const result = await service.remove({ id: 'jadwal-uuid-1' });

      expect(result).toEqual(mockDeletedJadwal);
      expect(
        mockPrismaService.presensi_kader.deleteMany,
      ).not.toHaveBeenCalled();
      expect(mockPrismaService.presensi_ibk.deleteMany).not.toHaveBeenCalled();
      expect(
        mockPrismaService.monitoring_ibk.deleteMany,
      ).not.toHaveBeenCalled();
    });

    it('should throw error if jadwal not found', async () => {
      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(null);

      await expect(service.remove({ id: 'non-existent-id' })).rejects.toThrow(
        'Failed to delete jadwal posyandu',
      );
    });

    it('should handle deletion errors', async () => {
      const mockExistingJadwal = {
        id: 'jadwal-uuid-1',
        presensi_kader: [],
        presensi_ibk: [],
        monitoring_ibk: [],
      };

      mockPrismaService.jadwal_posyandu.findUnique.mockResolvedValue(
        mockExistingJadwal,
      );
      mockPrismaService.jadwal_posyandu.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.remove({ id: 'jadwal-uuid-1' })).rejects.toThrow();

      // Verify error was logged
      expect(mockPrismaService.jadwal_posyandu.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.jadwal_posyandu.delete).toHaveBeenCalled();
    });
  });
});
