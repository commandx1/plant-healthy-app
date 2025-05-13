import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Get('verify-email')
    async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
    ) {
        return await this.userService.verifyEmail(token, email);
    }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
      const user = await this.userService.findUserById(id);
      return { user };
  }
}
