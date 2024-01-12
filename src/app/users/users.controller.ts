import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async index() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async show(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findOneOrFail({ where: { id } });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.delete(id);
  }
}
