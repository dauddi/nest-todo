import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Response, Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'test_secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and redirect to login', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      jest.spyOn(service, 'register').mockResolvedValue({} as any);

      await controller.register(registerDto, res);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('login', () => {
    it('should login a user and redirect to home', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(service, 'validateUser').mockResolvedValue('token');

      await controller.login(loginDto, res);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto);
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'Bearer token', {
        httpOnly: true,
      });
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should redirect to login if validation fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const res = { redirect: jest.fn() } as unknown as Response;

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await controller.login(loginDto, res);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto);
      expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('logout', () => {
    it('should clear the cookie and redirect to login', async () => {
      const res = {
        clearCookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt');
      expect(res.redirect).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('loginPage', () => {
    it('should return message if already logged in', () => {
      const req = {
        cookies: { jwt: 'some-jwt-token' },
      } as Partial<Request> as Request;
      expect(controller.loginPage(req)).toEqual({
        user: 'some-jwt-token',
        message: 'Already logged in',
      });
    });

    it('should return empty object if not logged in', () => {
      const req = { cookies: {} } as Partial<Request> as Request;
      expect(controller.loginPage(req)).toEqual({});
    });
  });

  describe('registerPage', () => {
    it('should return message if already registered', () => {
      const req = {
        cookies: { jwt: 'some-jwt-token' },
      } as Partial<Request> as Request;
      expect(controller.registerPage(req)).toEqual({
        user: 'some-jwt-token',
        message: 'Already registered',
      });
    });

    it('should return empty object if not registered', () => {
      const req = { cookies: {} } as Partial<Request> as Request;
      expect(controller.registerPage(req)).toEqual({});
    });
  });
});
