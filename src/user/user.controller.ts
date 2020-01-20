import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { hash } from 'bcrypt';
import { isUndefined } from 'lodash';
import { extname } from 'path';
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
  @Post(':id/upload/profile')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/profile',
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  editFileName = (req: any, file: any, callback: CallableFunction) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };

  imageFileFilter = (req: any, file: any, callback: CallableFunction) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      return callback(new Error('Only image files are allowed!'), false);

    callback(null, true);
  };
}
