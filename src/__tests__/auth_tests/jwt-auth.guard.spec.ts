import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test_secret' });
    configService = {
      get: jest.fn().mockReturnValue({ jwtSecret: 'test_secret' }),
    } as unknown as ConfigService;
    guard = new JwtAuthGuard(jwtService, configService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for valid token', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: { jwt: 'Bearer valid.jwt.token' },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 1 });

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: { jwt: 'Bearer invalid.jwt.token' },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    try {
      guard.canActivate(mockExecutionContext);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: {},
      }),
    } as unknown as ExecutionContext;

    try {
      guard.canActivate(mockExecutionContext);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
