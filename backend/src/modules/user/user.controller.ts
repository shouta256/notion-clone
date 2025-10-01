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
} from "@nestjs/common";
import type { Request } from "express";
import type { User } from "src/entities/user.entity";
import JwtAuthenticationGuard from "../auth/jwtAuthentication.guard";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import type { UserService } from "./user.service";

interface RequestWithUser extends Request {
  user: User;
}

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get("/")
  async getUsers(@Req() req: RequestWithUser) {
    // Restrict: return only current user to avoid leaking user list
    const currentUser = req.user;
    return [currentUser];
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get("/:id")
  async getUserByToken(@Param("id") id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    if (+id !== currentUser.id) {
      throw new ForbiddenException("You cannot access other user data");
    }
    return this.userService.getById(id);
  }

  @Post("/")
  async createUser(@Body() user: CreateUserDto) {
    const createdUser = await this.userService.createUser(user as unknown as User);
    const safeUser: Omit<User, "password"> & { password?: undefined } = {
      ...(createdUser as User),
    } as Omit<User, "password"> & { password?: undefined };
    safeUser.password = undefined;
    return safeUser;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch("/")
  async updateUser(@Body() user: UpdateUserDto, @Req() req: RequestWithUser) {
    if ("id" in user) {
      const currentUser = req.user;
      if (user.id !== currentUser.id) {
        throw new ForbiddenException("You cannot update other user");
      }
      const updatedUser = await this.userService.updateUser(user as unknown as User);
      const safeUser: Omit<User, "password"> & { password?: undefined } = {
        ...(updatedUser as User),
      } as Omit<User, "password"> & { password?: undefined };
      safeUser.password = undefined;
      return safeUser;
    }
    throw new Error("id, userName, email, password must be provided");
  }
}
