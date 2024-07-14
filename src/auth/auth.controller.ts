import { Controller, Post, Body, Res, Render, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  loginPage(@Req() req: Request) {
    const user = req.cookies.jwt ? req.cookies.jwt : null;
    if (user) return { user, message: 'Already logged in' };
    return {};
  }

  @Get('register')
  @Render('auth/register')
  registerPage(@Req() req: Request) {
    const user = req.cookies.jwt ? req.cookies.jwt : null;
    if (user) return { user, message: 'Already registered' };
    return {};
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.validateUser(loginDto);
    if (token) {
      res.cookie('jwt', `Bearer ${token}`, { httpOnly: true });
      return res.redirect('/');
    }
    return res.redirect('/auth/login');
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    await this.authService.register(registerDto);
    return res.redirect('/auth/login');
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.redirect('/auth/login');
  }
}
