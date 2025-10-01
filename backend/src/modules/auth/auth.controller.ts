import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import type { User } from "src/entities/user.entity";
import { AuthService } from "./auth.service";
import JwtAuthenticationGuard from "./jwtAuthentication.guard";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";

interface RequestWithUser extends Request {
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post("login")
  async login(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const { user } = request;

    const token = this.authService.createToken({
      userId: user.id,
    });
    // Set HttpOnly cookie for XSS protection
    res.cookie("Authentication", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
    const userWithoutPassword: Omit<User, "password"> & {
      password?: undefined;
    } = {
      ...(user as User),
    } as Omit<User, "password"> & { password?: undefined };
    userWithoutPassword.password = undefined;
    // Optionally return token for backward compatibility during transition
    const includeToken = process.env.INCLUDE_TOKEN_IN_RESPONSE === "true";
    return includeToken ? { ...userWithoutPassword, token } : { ...userWithoutPassword };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get("authenticate")
  authenticate(@Req() request: RequestWithUser) {
    const { user } = request;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("Authentication", { path: "/" });
    return { success: true };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get("userId")
  getUserIdByAuthHeader(@Req() req: Request) {
    return this.authService.getUserIdFromAuthHeader(req);
  }
}
