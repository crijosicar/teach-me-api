import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { compact, isUndefined, last } from 'lodash';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../common/file-upload.util';
import { ACTIVE_STATUS, STUDENT_ROLE } from '../constants';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.interface';
import { userValidationSchema } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

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

      const studentRole = await this.roleService.findByName(STUDENT_ROLE);

      if (!studentRole) throw new Error('Role provided does not exist.');

      await this.userService.addRoleToUserById(userCreated.id, [
        studentRole.id,
      ]);

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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@Param('id') id: string, @UploadedFile() file: any) {
    try {
      const response = {
        originalname: file.originalname,
        filename: file.filename,
      };
      await this.userService.addAvatarToUserById(id, file.path);
      return response;
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

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    try {
      const user: User = await this.userService.find(id);
      const avatar = last(compact(user.avatars));
      res.sendFile(avatar, { root: './' });
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
