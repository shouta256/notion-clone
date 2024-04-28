import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // ハッシュ化されたパスワードを検証する
  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const authenticated = await compare(plainTextPassword, hashedPassword);
    if (!authenticated) {
      throw new BadRequestException('Incorrect password');
    }
  }

  // emailとpasswordから認証を行う
  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('認証情報が正しくありません');
    }
  }

  //トークンを作成
  public createToken(payload: any) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //トークンからuserIdを取得する
  async getUserIdFromToken(token: string): Promise<number | null> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded.userId;
    } catch (error) {
      console.error('Token error:', error);
      throw new Error('Invalid token format');
    }
  }

  //リクエストヘッダーからトークンを取得してuserIdを返す
  async getUserIdFromAuthHeader(req: Request): Promise<number> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new NotFoundException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    return this.getUserIdFromToken(token);
  }
}
