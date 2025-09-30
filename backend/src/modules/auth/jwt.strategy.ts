import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

interface JWTPayload {
  userId: User['id'];
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
          if (!cookieHeader) return null;
          const cookies = Object.fromEntries(
            cookieHeader.split(';').map((c) => {
              const [k, ...v] = c.trim().split('=');
              return [k, decodeURIComponent(v.join('='))];
            }),
          );
          return (cookies as any)['Authentication'] || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JWTPayload) {
    return this.userService.getById(payload.userId);
  }
}
