import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({
      secret: 'test_secret',
      signOptions: { expiresIn: '1d' },
    });
    guard = new JwtAuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should validate JWT token and return true', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: { jwt: 'Bearer valid_token' },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 1 });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        cookies: { jwt: 'Bearer invalid_token' },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error();
    });

    expect(() => guard.canActivate(context)).toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ cookies: {} }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrowError(
      UnauthorizedException,
    );
  });
});
