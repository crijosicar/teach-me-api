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
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { hash } from 'bcrypt';
import { Response } from 'express';
import { compact, isUndefined, last, map } from 'lodash';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../common/file-upload.util';
import { ACTIVE_STATUS, STUDENT_ROLE } from '../constants';
import { RoleService } from '../role/role.service';
import { AdditionalDataUserDto } from './dto/additionalDataUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './interface/user.interface';
import {
  additionalUserDataValidationSchema,
  userValidationSchema,
} from './user.schema';
import { UserService } from './user.service';
import { JoiValidationPipe } from 'src/common/joi-validation.pipe';

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
  @UsePipes(new JoiValidationPipe(userValidationSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password } = createUserDto;
      const passHash = await hash(password, 10);

      const userCreated = await this.userService.create({
        ...createUserDto,
        password: passHash,
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
      const user = await this.userService.find(id);
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

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/additional-data')
  @UsePipes(new JoiValidationPipe(additionalUserDataValidationSchema))
  async setAdditionalData(
    @Param('id') id: string,
    @Body() additionalDataUserDto: AdditionalDataUserDto,
  ) {
    try {
      const user = await this.userService.find(id);

      if (!user) throw new Error('User provided does not exist.');

      const { courses, studies, skills } = additionalDataUserDto;

      if (courses)
        await this.userService.addCoursesToUserById(id, map(courses, '_id'));
      if (skills)
        await this.userService.addSkillsToUserById(id, map(skills, '_id'));
      if (studies)
        await this.userService.addStudiesToUserById(id, map(studies, '_id'));
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
