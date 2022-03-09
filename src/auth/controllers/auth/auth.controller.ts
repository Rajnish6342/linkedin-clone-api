import { AuthService } from './../../services/auth/auth.service';
import { from, Observable, map } from 'rxjs';
import { User } from './../../models/user.interface';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User): Observable<User> {
    return from(this.authService.registerAccount(user));
  }

  @Post('login')
  async login(@Body() user: User): Promise<{ token: string }> {
    return this.authService.login(user);
  }
}
