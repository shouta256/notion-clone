import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async verifyPassword(plainTextPassword: string, userPassword: string) {
    const authenticated = await compare(plainTextPassword, userPassword);
    if (!authenticated) {
      throw new BadRequestException('認証情報が正しくありません');
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      const hashedProvidedPassword = await hash(plainTextPassword, 10);
      await this.verifyPassword(plainTextPassword, hashedProvidedPassword);
      user.password = undefined;
      return user;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('認証情報が正しくありません');
    }
  }

  public createToken(payload: any) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
