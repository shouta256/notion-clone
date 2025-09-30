import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { genSalt, hash } from "bcrypt";
import { User } from "src/entities/user.entity";
import type { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async createUser(user: User) {
    try {
      if (!user.password) {
        throw new BadRequestException("Password is required");
      }

      // メールアドレスの存在をチェック
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (existingUser) {
        throw new ConflictException("Email already registered");
      }

      const salt = await genSalt(12);
      const passwordHashed = await hash(user.password, salt);
      const createdUser = await this.userRepository.save({
        ...user,
        password: passwordHashed,
      });
      return createdUser;
    } catch (error) {
      // より具体的なエラー処理を追加
      if (error.status === 409) {
        // ConflictException が投げられた場合
        throw error;
      }

      console.error("Error creating user:", error);
      throw new BadRequestException("Unable to create user, please check the provided data");
    }
  }

  async updateUser(user: User) {
    const passwordHashed = await hash(user.password, 10);
    const updatedUser = await this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
    return updatedUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "userName", "email", "password"],
    });
    return user;
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException("ユーザーが存在しません");
    }
    return user;
  }
}
