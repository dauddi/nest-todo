import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { User } from '../../auth/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and save user', async () => {
      const registerDto: RegisterDto = {
        name: 'Jon Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = {
        id: 1,
        name: 'Jon Doe',
        email: 'test@example.com',
        password: hashedPassword,
      } as User;

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(repository, 'create').mockReturnValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      expect(await service.register(registerDto)).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('validateUser', () => {
    it('should return JWT token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = {
        id: 1,
        name: 'Jon Doe',
        email: 'test@example.com',
        password: hashedPassword,
      } as User;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      expect(await service.validateUser(loginDto)).toEqual('token');
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ userId: user.id });
    });

    it('should return null if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      expect(await service.validateUser(loginDto)).toBeNull();
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });
  });
});
