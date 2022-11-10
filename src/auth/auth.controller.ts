import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Controller, Request, Post, UseGuards, Body, Patch, Param, Delete, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private usersService: AuthService) { }

  @Post('signup')
  async signup(@Body('email') email: string, @Body('password') password: string, @Body('name') name: string) {
    return this.usersService.signup(email, password, name);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.usersService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.usersService.getSingleUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body('email') email: string,
    @Body('name') name: string,
  ) {
    return await this.usersService.updateUser(userId, email, name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return await this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteuserbyadmin/:id')
  async deleteUserByAdmin(@Param('id') userId: string) {
    return await this.usersService.deleteUserByAdmin(userId);
  }
}
