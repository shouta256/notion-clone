import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import JwtAuthenticationGuard from '../auth/jwtAuthentication.guard';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('/')
  async getUsers(@Req() req: Request) {
    // Restrict: return only current user to avoid leaking user list
    const currentUser: any = (req as any).user;
    return [currentUser];
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id')
  async getUserByToken(@Param('id') id: number, @Req() req: Request) {
    const currentUser: any = (req as any).user;
    if (+id !== currentUser.id) {
      throw new ForbiddenException('You cannot access other user data');
    }
    return this.userService.getById(id);
  }

  @Post('/')
  async createUser(@Body() user: CreateUserDto) {
    const createdUser = await this.userService.createUser(user as any);
    const safeUser = { ...(createdUser as any) };
    delete (safeUser as any).password;
    return safeUser;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('/')
  async updateUser(@Body() user: UpdateUserDto, @Req() req: Request) {
    if ('id' in user) {
      const currentUser: any = (req as any).user;
      if (user.id !== currentUser.id) {
        throw new ForbiddenException('You cannot update other user');
      }
      const updatedUser = await this.userService.updateUser(user as any);
      const safeUser = { ...(updatedUser as any) };
      delete (safeUser as any).password;
      return safeUser;
    } else {
      throw new Error('id, userName, email, password must be provided');
    }
  }
}
