import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import type { User } from "src/entities/user.entity";
// biome-ignore lint/style/useImportType: Service must be runtime import for DI metadata
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.getAuthenticatedUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}
