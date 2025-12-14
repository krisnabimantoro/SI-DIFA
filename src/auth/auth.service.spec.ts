import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';
import { KaderDto } from '../dto/kader.dto';
import { RegisterPsikologDto } from '../dto/register-psikolog.dto';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockUsersService = {
    user: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockMailService = {
    sendRegisterAccount: jest.fn(),
    sendResetPasswordLink: jest.fn(),
    decodeConfirmationToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerKader', () => {
    const userDto: UserDto = {
      name: 'Test Kader',
      email: 'kader@test.com',
      password: 'password123',
      no_telp: '081234567890',
    };

    const kaderDto: KaderDto = {
      jabatan: 'Ketua Kader',
    };

    it('should successfully register a new kader', async () => {
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 'user-uuid-1',
        name: userDto.name,
        email: userDto.email,
        password: hashedPassword,
        no_telp: userDto.no_telp,
        role: 'kader',
        verification: 'unverified',
        created_at: new Date(),
      };

      mockUsersService.user.mockResolvedValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.createUser.mockResolvedValue(mockUser);
      mockMailService.sendRegisterAccount.mockResolvedValue(undefined);

      const result = await service.registerKader(kaderDto, userDto);

      expect(mockUsersService.user).toHaveBeenCalledWith({
        email: userDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        name: userDto.name,
        email: userDto.email,
        password: hashedPassword,
        no_telp: userDto.no_telp,
        role: 'kader',
        verification: 'unverified',
        created_at: expect.any(Date),
        users_kader: {
          create: {
            jabatan: kaderDto.jabatan,
            created_at: expect.any(Date),
          },
        },
      });
      expect(mockMailService.sendRegisterAccount).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(result).toEqual({
        message:
          'Akun berhasil didaftarkan, silahkan cek email anda lebih lanjut',
      });
    });

    it('should throw error if email already exists', async () => {
      const existingUser = {
        id: 'user-uuid-1',
        email: userDto.email,
        name: 'Existing User',
      };

      mockUsersService.user.mockResolvedValue(existingUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      await expect(service.registerKader(kaderDto, userDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.registerKader(kaderDto, userDto)).rejects.toThrow(
        'Email sudah terdaftar',
      );

      expect(mockUsersService.createUser).not.toHaveBeenCalled();
      expect(mockMailService.sendRegisterAccount).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should generate access and refresh tokens', async () => {
      const user = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        role: 'kader',
      };

      const mockAccessToken = 'mock_access_token';
      const mockRefreshToken = 'mock_refresh_token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await service.login(user);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { email: user.email, sub: user.id, role: user.role },
        expect.objectContaining({
          expiresIn: '30m',
        }),
      );
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { email: user.email, sub: user.id, role: user.role },
        expect.objectContaining({
          expiresIn: '7d',
        }),
      );
      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
      });
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should return user without password if credentials are valid', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'psikolog',
        verification: 'approved',
      };

      mockUsersService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(mockUsersService.user).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        verification: mockUser.verification,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if kader is unverified', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email,
        password: 'hashed_password',
        name: 'Test Kader',
        role: 'kader',
        verification: 'unverified',
      };

      mockUsersService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        'unverified',
      );
    });

    it('should throw UnauthorizedException if kader is declined', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email,
        password: 'hashed_password',
        name: 'Test Kader',
        role: 'kader',
        verification: 'declined',
      };

      mockUsersService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        'declined',
      );
    });

    it('should return null if user not found', async () => {
      mockUsersService.user.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'kader',
      };

      mockUsersService.user.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should generate new access token from valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';
      const mockPayload = {
        email: 'test@example.com',
        sub: 'user-uuid-1',
        role: 'kader',
      };
      const newAccessToken = 'new_access_token';

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const result = await service.refresh(refreshToken);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        refreshToken,
        expect.any(Object),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockPayload.email,
          sub: mockPayload.sub,
          role: mockPayload.role,
        },
        expect.objectContaining({
          expiresIn: '30m',
        }),
      );
      expect(result).toEqual({ new_access_token: newAccessToken });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const invalidToken = 'invalid_refresh_token';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh(invalidToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(invalidToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send reset password link if user exists', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 'user-uuid-1',
        email,
        name: 'Test User',
      };

      mockUsersService.user.mockResolvedValue(mockUser);
      mockMailService.sendResetPasswordLink.mockResolvedValue(undefined);

      await service.forgotPassword(email);

      expect(mockUsersService.user).toHaveBeenCalledWith({ email });
      expect(mockMailService.sendResetPasswordLink).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.user.mockResolvedValue(null);

      await expect(service.forgotPassword(email)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.forgotPassword(email)).rejects.toThrow(
        `No user found for email: ${email}`,
      );
      expect(mockMailService.sendResetPasswordLink).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const token = 'valid_token';
      const email = 'test@example.com';
      const newPassword = 'newPassword123';
      const hashedPassword = 'hashed_new_password';

      const mockUser = {
        id: 'user-uuid-1',
        email,
        password: 'old_hashed_password',
        name: 'Test User',
      };

      mockMailService.decodeConfirmationToken.mockResolvedValue(email);
      mockUsersService.user.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersService.updateUser.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await service.resetPassword(token, newPassword);

      expect(mockMailService.decodeConfirmationToken).toHaveBeenCalledWith(
        token,
      );
      expect(mockUsersService.user).toHaveBeenCalledWith({ email });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith({
        where: { email },
        data: { password: hashedPassword },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const token = 'valid_token';
      const email = 'nonexistent@example.com';
      const newPassword = 'newPassword123';

      mockMailService.decodeConfirmationToken.mockResolvedValue(email);
      mockUsersService.user.mockResolvedValue(null);

      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        `No user found for email: ${email}`,
      );
      expect(mockUsersService.updateUser).not.toHaveBeenCalled();
    });
  });
});
