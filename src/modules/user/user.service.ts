import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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
    const passwordHashed = await hash(user.password, 10);
    const createdUser = await this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
    return createdUser;
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
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('ユーザーが存在しません');
    }
    return user;
  }
}
