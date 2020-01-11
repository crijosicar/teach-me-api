import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hash } from 'bcrypt';
import { isUndefined, omit } from 'lodash';
import { ACTIVE_STATUS } from '../constants';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.interface';
import { userValidationSchema } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<User> {
    return this.userService.find(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      await userValidationSchema.validateAsync(createUserDto);

      const { password } = createUserDto;
      const passHash = await hash(password, 10);
      const createdAt = new Date().valueOf().toString();

      const userCreated = await this.userService.create({
        ...createUserDto,
        password: passHash,
        createdAt,
        status: ACTIVE_STATUS,
      });

      return userCreated;
    } catch (error) {
      const message = isUndefined(error.response)
        ? error.message
        : error.response.data;
      const statusCode = isUndefined(error.response)
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : error.response.status;
      throw new HttpException(message, statusCode);
    }
  }
}
