import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from "bcrypt";
import type { Request } from "express";
import type { User } from "src/entities/user.entity";
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // ハッシュ化されたパスワードを検証する
  public async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const authenticated = await compare(plainTextPassword, hashedPassword);
    if (!authenticated) {
      throw new BadRequestException("Incorrect password");
    }
  }

  // emailとpasswordから認証を行う
  public async getAuthenticatedUser(email: string, plainTextPassword: string): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (err) {
      console.log(err);
      throw new BadRequestException("Authentication credentials are incorrect");
    }
  }

  //トークンを作成
  public createToken(payload: { userId: number }) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //トークンからuserIdを取得する
  async getUserIdFromToken(token: string): Promise<number | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.userId;
    } catch (error) {
      console.error("Token error:", error);
      throw new Error("Invalid token format");
    }
  }

  //リクエストからトークンを取得してuserIdを返す（Cookie優先、なければAuthヘッダ）
  async getUserIdFromAuthHeader(req: Request): Promise<number> {
    // Cookie: Authentication
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => {
          const [k, ...v] = c.trim().split("=");
          return [k, decodeURIComponent(v.join("="))];
        }),
      );
      const cookieToken = (cookies as Record<string, string>).Authentication;
      if (cookieToken) {
        return this.getUserIdFromToken(cookieToken);
      }
    }

    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new NotFoundException("Authorization header is missing");
    }
    const token = authHeader.split(" ")[1];
    return this.getUserIdFromToken(token);
  }
}
