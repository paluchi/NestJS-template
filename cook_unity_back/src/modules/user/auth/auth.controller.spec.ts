import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './DTOs/register.dto';
import { LogInDto } from './DTOs/logIn.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController for users', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    // Mock AuthService implementation
    const mockAuthService = {
      register: jest.fn(),
      logIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const dto = new RegisterDto();
      dto.username = 'test';
      dto.password = 'password';

      jest.spyOn(service, 'register').mockImplementation(async () => undefined);

      await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto.username, dto.password);
    });

    it('should throw ConflictException if username is already taken', async () => {
      const dto = new RegisterDto();
      dto.username = 'test';
      dto.password = 'password';

      jest.spyOn(service, 'register').mockImplementation(() => {
        throw new ConflictException('Username already taken');
      });

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logIn', () => {
    it('should successfully log in a user and return a jwt token', async () => {
      const dto = new LogInDto();
      dto.username = 'test';
      dto.password = 'password';
      const jwt = 'jwt-token';

      jest.spyOn(service, 'logIn').mockResolvedValueOnce({ token: jwt });

      const result = await controller.logIn(dto);
      expect(service.logIn).toHaveBeenCalledWith(dto.username, dto.password);
      expect(result).toEqual({ jwt });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const dto = new LogInDto();
      dto.username = 'test';
      dto.password = 'password';

      jest.spyOn(service, 'logIn').mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      await expect(controller.logIn(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const dto = new LogInDto();
      dto.username = 'test';
      dto.password = 'wrongpassword';

      jest.spyOn(service, 'logIn').mockImplementation(() => {
        throw new UnauthorizedException('Invalid credentials');
      });

      await expect(controller.logIn(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // Additional tests could be added here for edge cases or other business rules
});
