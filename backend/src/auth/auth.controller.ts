import {
    Body,
    Controller,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from 'src/user/dto/register.dto';
import { UserDocument } from 'src/user/schemas/user.schema';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

  @Post('login')
  async login(@Body() body: { email: string; password: string; jti?: string }) {
      const user: UserDocument = await this.authService.validateUser(
          body.email,
          body.password,
          body.jti,
      );
      if (!user) {
          throw new UnauthorizedException('Invalid credentials');
      }
      return this.authService.login(user);
  }
}
