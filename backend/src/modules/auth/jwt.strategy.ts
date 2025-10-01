import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: ConfigService must be runtime import for DI metadata
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { User } from "src/entities/user.entity";
// biome-ignore lint/style/useImportType: Service must be runtime import for DI metadata
import { UserService } from "../user/user.service";

interface JWTPayload {
  userId: User["id"];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UserService) private readonly userService: UserService,
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
      secretOrKey: configService.get<string>("JWT_SECRET") || "dev-secret",
    });
  }

  async validate(payload: JWTPayload) {
    return this.userService.getById(payload.userId);
  }
}
