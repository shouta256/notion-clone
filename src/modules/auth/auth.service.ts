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

  //ハッシュ化されたパスワードを検証する
  public async verifyPassword(plainTextPassword: string, userPassword: string) {
    const authenticated = await compare(plainTextPassword, userPassword);
    if (!authenticated) {
      throw new BadRequestException('認証情報が正しくありません');
    }
  }

  //emailとpasswordから認証を行う
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
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  //リクエストヘッダーからトークンを取得してuserIdを返す
  async getUserIdFromAuthHeader(req: Request): Promise<number | null> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    return this.getUserIdFromToken(token);
  }
}
