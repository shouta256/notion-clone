import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const authenticatedUser = await this.authService.getAuthenticatedUser(
      user.email,
      user.password,
    );

    const token = this.authService.createToken({
      userId: authenticatedUser.id,
    });
    authenticatedUser.password = undefined;
    return { ...authenticatedUser, token };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('authenticate')
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('userId')
  getUserIdByAuthHeader(@Request() req: Request) {
    return this.authService.getUserIdFromAuthHeader(req);
  }
}
