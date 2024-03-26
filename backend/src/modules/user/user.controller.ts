import { Body, Controller, Get, Patch, Post, Param } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }
  @Get('/:id')
  async getUserByToken(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Post('/')
  async createUser(@Body() user: User) {
    const createdUser = await this.userService.createUser(user);
    return createdUser;
  }

  @Patch('/')
  async updateUser(@Body() user: User) {
    if ('id' in user) {
      const updatedUser = await this.userService.updateUser(user);
      return updatedUser;
    } else {
      throw new Error('id, userName, email, password must be provided');
    }
  }
}
