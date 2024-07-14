import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

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
