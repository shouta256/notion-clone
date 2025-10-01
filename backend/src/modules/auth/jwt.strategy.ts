import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { User } from "src/entities/user.entity";
import { UserService } from '../user/user.service';

interface JWTPayload {
  userId: User["id"];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Parse cookie header manually to avoid cookie-parser dependency
          const cookieHeader = req.headers?.cookie;
          if (!cookieHeader) {
            return null;
          }
          const cookies = Object.fromEntries(
            cookieHeader.split(";").map((c) => {
              const [k, ...v] = c.trim().split("=");
              return [k, decodeURIComponent(v.join("="))];
            }),
          );
          return (cookies as Record<string, string>).Authentication || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev-secret',
    });
  }

  async validate(payload: JWTPayload) {
    return this.userService.getById(payload.userId);
  }
}
